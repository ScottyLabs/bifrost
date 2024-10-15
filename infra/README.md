# infra

First, insure that you have [installed Pulumi](https://www.pulumi.com/docs/iac/get-started/aws/begin/#install-pulumi) on your system.

Then, install the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html#getting-started-install-instructions). Use `aws configure` to create or update your shared credentials file at `~/.aws/credentials`. For more detail, see [Pulumi's instructions](https://www.pulumi.com/registry/packages/aws/installation-configuration/#create-a-shared-credentials-file).

> [!IMPORTANT]
> If this is your first time running `aws configure`, the credential was probably saved as under `[default]`. Make sure to edit your `~/.aws/credentials` and change it to `[bifrost]`.

When you create the access key for your IAM user, ensure that it has sufficient permissions. We are temporarily assigning an `admin` role with `AdministratorAccess`.

We also expect an `.env` file in this directory that follows the format set by `.env.example`.
