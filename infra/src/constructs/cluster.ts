import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as sd from "aws-cdk-lib/aws-servicediscovery";
import { Construct } from "constructs";

interface Props {
  vpcId: string;
  stage: string;
}

export class Cluster extends Construct {
  readonly vpc: ec2.IVpc;
  readonly cluster: ecs.ICluster;
  readonly namespace: sd.IPrivateDnsNamespace;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    this.vpc = ec2.Vpc.fromLookup(this, "Vpc", {
      vpcId: props.vpcId,
    });

    this.cluster = new ecs.Cluster(this, "Cluster", {
      vpc: this.vpc,
      enableFargateCapacityProviders: true,
    });

    this.namespace = new sd.PrivateDnsNamespace(this, "Namespace", {
      name: `ns-${props.stage}`,
      vpc: this.vpc,
    });
  }
}
