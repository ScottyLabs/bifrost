import type rds from "aws-cdk-lib/aws-rds";
import ec2 from "aws-cdk-lib/aws-ec2";
import iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export interface BastionHostProps {
  vpc: ec2.Vpc;
  dbInstance: rds.DatabaseInstance;
}

export class BastionHost extends Construct {
  public readonly instance: ec2.Instance;

  constructor(scope: Construct, id: string, props: BastionHostProps) {
    super(scope, id);

    const bastionSG = new ec2.SecurityGroup(this, "BastionSecurityGroup", {
      vpc: props.vpc,
      allowAllOutbound: true,
    });

    bastionSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      "Allow SSH access",
    );

    props.dbInstance.connections.allowFrom(bastionSG, ec2.Port.tcp(5432));

    const bastionRole = new iam.Role(this, "BastionHostRole", {
      assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "AmazonSSMManagedInstanceCore",
        ),
        iam.ManagedPolicy.fromAwsManagedPolicyName("SecretsManagerReadWrite"),
      ],
    });

    const ubuntuAmi = new ec2.GenericSSMParameterImage(
      "/aws/service/canonical/ubuntu/server/focal/stable/current/amd64/hvm/ebs-gp2/ami-id",
      ec2.OperatingSystemType.LINUX,
    );

    this.instance = new ec2.Instance(this, "BastionHost", {
      vpc: props.vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MEDIUM,
      ),
      machineImage: ubuntuAmi,
      securityGroup: bastionSG,
      role: bastionRole,
    });
  }
}
