import type { Construct } from "constructs";
import cdk from "aws-cdk-lib";
import secretsmanager from "aws-cdk-lib/aws-secretsmanager";

import type { Config } from "~/config/env-config";

interface Props extends cdk.StackProps {
  readonly config: Config;
  readonly serviceNames: string[];
}

export class SecretsStack extends cdk.Stack {
  public readonly commonSecret: secretsmanager.Secret;
  public readonly serviceSecrets: Map<gitstring, secretsmanager.Secret>;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);

    this.commonSecret = new secretsmanager.Secret(this, "CommonSecrets", {
      secretName: "/common/secrets",
      description: "Common secrets used across services",
    });

    this.serviceSecrets = new Map();

    props.serviceNames.forEach((serviceName) => {
      const serviceSecret = new secretsmanager.Secret(
        this,
        `${serviceName}Secrets`,
        {
          secretName: `/${serviceName}/secrets`,
          description: `Secrets for ${serviceName}`,
        },
      );

      this.serviceSecrets.set(serviceName, serviceSecret);

      new cdk.CfnOutput(this, `${serviceName}SecretsArn`, {
        value: serviceSecret.secretArn,
        description: `ARN for ${serviceName} secrets`,
      });
    });

    new cdk.CfnOutput(this, "CommonSecretsArn", {
      value: this.commonSecret.secretArn,
      description: "ARN for common secrets",
    });
  }
}
