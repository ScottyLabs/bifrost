import type { Vpc } from "aws-cdk-lib/aws-ec2";
import { Cluster } from "aws-cdk-lib/aws-ecs";
import { Construct } from "constructs";

export interface IClusterProps {
  vpc: Vpc;
  clusterName: string;
  env: string;
}

export class AwsEcsCluster extends Construct {
  public readonly cluster: Cluster;

  constructor(scope: Construct, id: string, props: IClusterProps) {
    super(scope, id);

    this.cluster = new Cluster(this, "Cluster", {
      clusterName: props.clusterName,
      containerInsights: true,
      vpc: props.vpc,
    });
  }
}
