import ec2 from "aws-cdk-lib/aws-ec2";
import elasticache from "aws-cdk-lib/aws-elasticache";
import { Construct } from "constructs";

export interface CacheProps {
  vpc: ec2.Vpc;
}

export class Cache extends Construct {
  public readonly sg: ec2.SecurityGroup;
  public readonly subnetRedisGroup: elasticache.CfnSubnetGroup;
  public readonly cacheCluster: elasticache.CfnCacheCluster;

  constructor(scope: Construct, id: string, props: CacheProps) {
    super(scope, id);

    this.sg = new ec2.SecurityGroup(this, "SecurityGroup", {
      vpc: props.vpc,
      allowAllOutbound: false,
    });

    this.sg.addIngressRule(
      ec2.Peer.ipv4(props.vpc.vpcCidrBlock),
      ec2.Port.tcp(6379),
    );

    this.subnetRedisGroup = new elasticache.CfnSubnetGroup(
      this,
      "SubnetGroup",
      {
        subnetIds: props.vpc.selectSubnets({
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        }).subnetIds,
        description: "Subnet group for Redis",
      },
    );

    this.cacheCluster = new elasticache.CfnCacheCluster(this, "CacheCluster", {
      cacheNodeType: "cache.t3.micro",
      engine: "redis",
      numCacheNodes: 1,
      cacheSubnetGroupName: this.subnetRedisGroup.ref,
      vpcSecurityGroupIds: [this.sg.securityGroupId],
    });

    this.cacheCluster.addDependency(this.subnetRedisGroup);
  }
}
