import type { Construct } from 'constructs';
import cdk from 'aws-cdk-lib';
import ec2 from 'aws-cdk-lib/aws-ec2';
import ecs from 'aws-cdk-lib/aws-ecs';
import route53 from 'aws-cdk-lib/aws-route53';

import type { Config } from '~/config/env-config';
import { BastionHost } from '~/constructs/bastion';
import { Cache } from '~/constructs/cache';
import { Domain } from '~/constructs/domain';
import { Datastore } from '~/constructs/rds';
import { Storage } from '~/constructs/s3';

interface Props extends cdk.StackProps {
  config: Config;
}

export class InfraStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;
  public readonly datastore: Datastore;
  public readonly storage: Storage;
  public readonly cache: Cache;
  public readonly cluster: ecs.Cluster;
  public readonly hostedZone: route53.IHostedZone;
  public readonly domain: Domain;
  public readonly bastion: BastionHost;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: 3,
      natGateways: 1,
      vpcName: 'vpc',
      ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
      subnetConfiguration: [
        { cidrMask: 20, name: 'Public', subnetType: ec2.SubnetType.PUBLIC },
        { cidrMask: 20, name: 'Private', subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      ],
    });

    this.domain = new Domain(this, 'Domain', {
      zoneName: props.config.domain,
      hostedZoneId: props.config.zoneId,
    });

    this.cache = new Cache(this, 'Cache', {
      vpc: this.vpc,
    });

    this.datastore = new Datastore(this, 'Datastore', {
      dbName: props.config.name,
      vpc: this.vpc,
    });

    this.storage = new Storage(this, 'S3Instance', {
      bucketName: `${props.config.name}-bucket-${props.config.accountId}`,
    });

    this.cluster = new ecs.Cluster(this, 'Cluster', {
      vpc: this.vpc,
      clusterName: `${props.config.name}-cluster`,
    });

    this.hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
      hostedZoneId: props.config.zoneId,
      zoneName: props.config.domain,
    });

    this.bastion = new BastionHost(this, 'Bastion', {
      dbInstance: this.datastore.dbInstance,
      vpc: this.vpc,
    });
  }
}
