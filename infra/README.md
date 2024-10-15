# infra

First, insure that you have [installed Pulumi](https://www.pulumi.com/docs/iac/get-started/aws/begin/#install-pulumi) on your system.

Then, install the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html#getting-started-install-instructions). Use `aws configure` to create or update your shared credentials file at `~/.aws/credentials`. For more detailed instructions, see [Pulumi's instructions](https://www.pulumi.com/registry/packages/aws/installation-configuration/#create-a-shared-credentials-file).

> [!IMPORTANT]  
> If this is your first time running `aws configure`, the credential was probably saved as under `[default]`. Make sure to edit your `~/.aws/credentials` and change it to `[bifrost]`.
