import type { Construct } from "constructs";
import cdk from "aws-cdk-lib";
import { Stack } from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as route53 from "aws-cdk-lib/aws-route53";

import type { Config } from "~/config/env-config";
import { BastionHost } from "~/constructs/bastion";
import { Cache } from "~/constructs/cache";

import { Datastore } from "~/constructs/rds";
import { Storage } from "~/constructs/s3";

interface Props extends cdk.StackProps {
  config: Config;
}

export class InfraStack extends Stack {
  public readonly vpc: ec2.Vpc;
  public readonly datastore: Datastore;
  public readonly storage: Storage;
  public readonly cache: Cache;
  public readonly cluster: ecs.Cluster;
  public readonly hostedZone: route53.IHostedZone;
  public readonly bastion: BastionHost;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, "Vpc", {
      natGateways: 1,
      vpcName: "vpc",
      ipAddresses: ec2.IpAddresses.cidr("10.0.0.0/16"),
      reservedAzs: 2,
      availabilityZones: Stack.of(this).availabilityZones.sort().slice(0,2),
      subnetConfiguration: [
        { cidrMask: 20, name: "Public", subnetType: ec2.SubnetType.PUBLIC},
        {
          cidrMask: 20,
          name: "Private",
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
      ],
    });

    this.hostedZone = route53.HostedZone.fromHostedZoneAttributes(
      this,
      "HostedZone",
      { zoneName: props.config.domain, hostedZoneId: props.config.zoneId },
    );

    this.cache = new Cache(this, "Cache", {
      vpc: this.vpc,
    });

    this.datastore = new Datastore(this, "Datastore", {
      dbName: props.config.name,
      vpc: this.vpc,
    });

    this.storage = new Storage(this, "S3Instance", {
      bucketName: `${props.config.name}-bucket-${props.config.accountId}`,
    });

    this.cluster = new ecs.Cluster(this, "Cluster", {
      vpc: this.vpc,
      clusterName: `${props.config.name}-cluster`,
    });

    this.bastion = new BastionHost(this, "Bastion", {
      dbInstance: this.datastore.dbInstance,
      vpc: this.vpc,
    });
  }
}
