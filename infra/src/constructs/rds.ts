import { Duration, RemovalPolicy } from "aws-cdk-lib";
import ec2 from "aws-cdk-lib/aws-ec2";
import rds from "aws-cdk-lib/aws-rds";
import { Construct } from "constructs";

export interface DatastoreProps {
  vpc: ec2.Vpc;
  dbName: string;
}

export class Datastore extends Construct {
  static RDS_SIMLPE_BACKUP_RETENTION_DAYS = 30;

  public readonly sg: ec2.SecurityGroup;
  public readonly dbInstance: rds.DatabaseInstance;
  public readonly secret: rds.DatabaseSecret;
  public readonly credentials: rds.Credentials;

  constructor(scope: Construct, id: string, props: DatastoreProps) {
    super(scope, id);

    this.sg = new ec2.SecurityGroup(this, "SecurityGroup", {
      securityGroupName: "database-sg",
      vpc: props.vpc,
      allowAllOutbound: true,
    });

    this.sg.addIngressRule(
      ec2.Peer.ipv4(props.vpc.vpcCidrBlock),
      ec2.Port.tcp(5432),
    );

    this.secret = new rds.DatabaseSecret(this, "Secret", {
      username: "postgres",
    });

    this.credentials = rds.Credentials.fromSecret(this.secret);

    const parameterGroup = new rds.ParameterGroup(this, "ParameterGroup", {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_16,
      }),
      parameters: {
        "rds.force_ssl": "0",
        log_connections: "1",
        log_disconnections: "1",
        // Add max_connections parameter to handle multiple Fargate tasks
        max_connections: "100",
      },
    });

    this.dbInstance = new rds.DatabaseInstance(this, "DatabaseInstance", {
      vpc: props.vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T4G,
        ec2.InstanceSize.MICRO,
      ),
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_16,
      }),
      port: 5432,
      multiAz: true,
      securityGroups: [this.sg],
      parameterGroup,
      databaseName: props.dbName,
      credentials: this.credentials,
      backupRetention: Duration.days(30),
      removalPolicy: RemovalPolicy.RETAIN,
    });
  }
}
