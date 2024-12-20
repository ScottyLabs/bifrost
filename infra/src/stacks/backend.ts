import elasticache from "aws-cdk-lib/aws-elasticache";
import type rds from "aws-cdk-lib/aws-rds";
import type s3 from "aws-cdk-lib/aws-s3";
import type sm from "aws-cdk-lib/aws-secretsmanager";
import type { Construct } from "constructs";

import * as cdk from "aws-cdk-lib";
import * as cm from "aws-cdk-lib/aws-certificatemanager";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
import * as iam from "aws-cdk-lib/aws-iam";
import * as logs from "aws-cdk-lib/aws-logs";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as route53Targets from "aws-cdk-lib/aws-route53-targets";

import type { Config } from "~/config/env-config";
import { AwsEcrRepository } from "~/constructs/ecr";


export interface BackendStackProps extends cdk.StackProps {
  readonly cluster: ecs.ICluster;
  readonly bucket: s3.Bucket;
  readonly dbInstance: rds.DatabaseInstance;
  readonly dbCredentials: rds.Credentials;
  readonly cacheCluster: elasticache.CfnCacheCluster;
  readonly hostedZone: route53.IHostedZone;
  readonly config: Config;
  readonly commonSecret: sm.ISecret;
  readonly backendSecret: sm.ISecret;
}

export class BackendStack extends cdk.Stack {
  public readonly repository: AwsEcrRepository;
  public readonly service: ecs.FargateService;

  constructor(scope: Construct, id: string, props: BackendStackProps) {
    super(scope, id, props);

    this.repository = new AwsEcrRepository(this, "Repository", {
      repoName: `${props.config.name}-backend`,
    });

    const certificate = new cm.Certificate(this, "Certificate", {
      domainName: `api.${props.config.domain}`,
      validation: cm.CertificateValidation.fromDns(props.hostedZone),
    });

    const fargateLogGroup = new logs.LogGroup(this, "LogGroup", {
      logGroupName: `/ecs/backend`,
      retention: logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const taskRole = new iam.Role(this, "TaskRole", {
      roleName: "backend-fargate-task-role",
      assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
    });

    props.commonSecret.grantRead(taskRole);
    props.backendSecret.grantRead(taskRole);
    props.bucket.grantReadWrite(taskRole);
    props.dbInstance.grantConnect(taskRole);

    const taskDefinition = new ecs.FargateTaskDefinition(
      this,
      "TaskDefinition",
      {
        family: "backend",
        memoryLimitMiB: 4096,
        cpu: 1024,
        taskRole,
      },
    );

    taskDefinition.addContainer("Container", {
      image: ecs.ContainerImage.fromEcrRepository(this.repository.repository),
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: "backend",
        logGroup: fargateLogGroup,
      }),
      containerName: "bifrost-resource-app",
      environment: {},
      secrets: {},
      portMappings: [{ containerPort: 8080 }],
    });

    this.service = new ecs.FargateService(this, "Service", {
      serviceName: "backend-service",
      cluster: props.cluster,
      taskDefinition,
      desiredCount: 2,
      vpcSubnets: props.cluster.vpc.selectSubnets({
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      }),
    });

    const loadBalancer =
      new cdk.aws_elasticloadbalancingv2.ApplicationLoadBalancer(
        this,
        "LoadBalancer",
        {
          vpc: props.cluster.vpc,
          vpcSubnets: props.cluster.vpc.selectSubnets({
            subnetType: ec2.SubnetType.PUBLIC,
          }),
          internetFacing: true,
        },
      );

    this.service.connections.allowFrom(
      loadBalancer,
      ec2.Port.tcp(8080),
      "Allow ALB traffic to ECS tasks",
    );

    const listener = loadBalancer.addListener("Listener", {
      port: 443,
      certificates: [certificate],
    });

    listener.addTargets("ListenerTarget", {
      targets: [this.service],
      port: 8080,
      protocol: elbv2.ApplicationProtocol.HTTP,
      healthCheck: {
        path: "/",
        protocol: elbv2.Protocol.HTTP,
      },
    });

    loadBalancer.addRedirect({
      sourcePort: 80,
      targetPort: 443,
    });

    new route53.ARecord(this, "Alias", {
      zone: props.hostedZone,
      recordName: `api.${props.config.domain}`,
      target: route53.RecordTarget.fromAlias(
        new route53Targets.LoadBalancerTarget(loadBalancer),
      ),
    });
  }
}
