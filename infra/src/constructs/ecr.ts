import * as ecr from 'aws-cdk-lib/aws-ecr';
import { Construct } from 'constructs';

export interface AwsEcrRepositoryProps {
  repoName: string;
}

export class AwsEcrRepository extends Construct {
  public readonly repository: ecr.IRepository;

  constructor(scope: Construct, id: string, props: AwsEcrRepositoryProps) {
    super(scope, id);

    this.repository = ecr.Repository.fromRepositoryName(this, `${props.repoName}Repository`, props.repoName);
  }
}
