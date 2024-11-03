import aws from '@pulumi/aws';
import pulumi from '@pulumi/pulumi';
import { vpc, vpcCidrBlocks } from './vpc';

const cfg = new pulumi.Config();
const allowedListArray = cfg.require('ALLOWED_IP_LIST').split(',');

type DbInstanceArgs = {
  username: string;
  password: string;
  dbName: string;
  instanceClass: string;
  allocatedStorage: number;
  maxAllocatedStorage: number;
  storageType: string;
  iops: number;
  engine: string;
  engineVersion: string;
  isProd: boolean;
  storageEncrypted: boolean;
};

export class DbInstance extends pulumi.ComponentResource {
  public readonly dbInstance: aws.rds.Instance;

  constructor(
    name: string,
    args: DbInstanceArgs,
    opts?: pulumi.ComponentResourceOptions
  ) {
    super('custom:db:DbInstance', name, {}, opts);

    const dbSecurityGroup = new aws.ec2.SecurityGroup(`${name}-db`, {
      vpcId: vpc.vpcId,
      ingress: [
        {
          protocol: 'tcp',
          fromPort: 5432,
          toPort: 5432,
          cidrBlocks: [vpcCidrBlocks, ...allowedListArray],
        },
      ],
    });

    const dbSubnetGroup = new aws.rds.SubnetGroup(`${name}-db`, {
      subnetIds: [vpc.publicSubnetIds[0], vpc.publicSubnetIds[1]],
    });

    const dbParameterGroup = new aws.rds.ParameterGroup(
      `${name}-db-parameter-group`,
      {
        family: 'postgres15',
        parameters: [
          {
            name: 'rds.logical_replication',
            value: '1',
            applyMethod: 'pending-reboot',
          },
        ],
      }
    );

    this.dbInstance = new aws.rds.Instance(name, {
      username: args.username,
      password: args.password,
      dbName: args.dbName,
      instanceClass: args.instanceClass,
      allocatedStorage: args.allocatedStorage,
      maxAllocatedStorage: args.maxAllocatedStorage,
      storageType: args.storageType,
      iops: args.iops,
      engine: args.engine,
      engineVersion: args.engineVersion,
      parameterGroupName: dbParameterGroup.name,
      dbSubnetGroupName: dbSubnetGroup.name,
      vpcSecurityGroupIds: [dbSecurityGroup.id],
      publiclyAccessible: true,
      applyImmediately: true,
      backupRetentionPeriod: 30,
      performanceInsightsEnabled: true,
      multiAz: args.isProd,
      finalSnapshotIdentifier: `${name}-final-snapshot`,
      storageEncrypted: args.storageEncrypted,
    });

    this.registerOutputs({
      dbInstance: this.dbInstance,
    });
  }
}
