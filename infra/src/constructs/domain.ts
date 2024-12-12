import route53 from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";

interface Props {
  zoneName: string;
  hostedZoneId: string;
}

export class Domain extends Construct {
  readonly hostedZone: route53.IHostedZone;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    this.hostedZone = route53.HostedZone.fromHostedZoneAttributes(
      this,
      "HostedZone",
      {
        zoneName: props.zoneName,
        hostedZoneId: props.hostedZoneId,
      },
    );
  }
}
