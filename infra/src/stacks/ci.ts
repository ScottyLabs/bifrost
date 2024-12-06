import type { Construct } from 'constructs';
import cdk from 'aws-cdk-lib';
import iam from 'aws-cdk-lib/aws-iam';

import type { Config } from '~/config/env-config';

interface Props extends cdk.StackProps {
  config: Config;
  owner: string;
  repo: string;
  branch: string;
}

export class CiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);

    const githubOidcDomain = 'token.actions.githubusercontent.com';

    const provider = new iam.OpenIdConnectProvider(this, 'GithubProvider', {
      url: `https://${githubOidcDomain}`,
      clientIds: ['sts.amazonaws.com'],
    });

    const condition = `repo:${props.owner}/${props.repo}:ref:refs/heads/${props.branch}`;

    const role = new iam.Role(this, 'GhActionsRole', {
      assumedBy: new iam.WebIdentityPrincipal(provider.openIdConnectProviderArn, {
        StringEquals: {
          [`${githubOidcDomain}:sub`]: condition,
          [`${githubOidcDomain}:aud`]: 'sts.amazonaws.com',
        },
      }),
      description: 'Role for GitHub Actions',
      maxSessionDuration: cdk.Duration.hours(1),
    });

    role.addToPolicy(
      new iam.PolicyStatement({
        actions: [
          'ecr:GetAuthorizationToken',
          'ecr:BatchCheckLayerAvailability',
          'ecr:GetDownloadUrlForLayer',
          'ecr:BatchGetImage',
          'ecr:InitiateLayerUpload',
          'ecr:UploadLayerPart',
          'ecr:CompleteLayerUpload',
          'ecr:PutImage',
        ],
        resources: ['*'], // should be restricted
      })
    );

    role.addToPolicy(
      new iam.PolicyStatement({
        actions: [
          'ecs:DescribeTaskDefinition',
          'ecs:RegisterTaskDefinition',
          'ecs:UpdateService',
          'ecs:DescribeServices',
        ],
        resources: ['*'],
      })
    );

    role.addToPolicy(
      new iam.PolicyStatement({
        actions: ['iam:PassRole'],
        resources: [`arn:aws:iam::${props.config.accountId}:role/*`],
      })
    );

    new cdk.CfnOutput(this, 'RoleArn', {
      value: role.roleArn,
      description: `GitHub Actions Role ARN for ${condition}`,
    });
  }
}
