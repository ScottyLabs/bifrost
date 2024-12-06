#!/usr/bin/env node
import type { Environment } from "aws-cdk-lib";
import { App } from "aws-cdk-lib";

import type { Config } from "~/config/env-config";
import { initConfig } from "~/config/init";
import { BackendStack } from "~/stacks/backend";
import { CiStack } from "~/stacks/ci";
import { InfraStack } from "~/stacks/infra";

import { SecretsStack } from "~/stacks/secrets";

const app = new App();

async function deploy(config: Config) {
  const env: Environment = {
    account: config.accountId,
    region: config.region,
  };

  const ci = new CiStack(app, "Ci", {
    env,
    config,
    owner: config.github.owner,
    repo: config.github.repo,
    branch: config.github.branch,
  });

  const infra = new InfraStack(app, "Infra", { env, config });

  const secrets = new SecretsStack(app, "Secrets", {
    env,
    config: config,
    serviceNames: ["backend"],
  });

  const backend = new BackendStack(app, "Backend", {
    env,
    config,
    cluster: infra.cluster,
    dbInstance: infra.datastore.dbInstance,
    dbCredentials: infra.datastore.credentials,
    cacheCluster: infra.cache.cacheCluster,
    bucket: infra.storage.bucket,
    hostedZone: infra.domain.hostedZone,
    backendSecret: secrets.serviceSecrets.get("backend")!,
    commonSecret: secrets.commonSecret,
  });

  backend.node.addDependency(infra, secrets);

  app.synth();
}

initConfig(app.node).then((config) => deploy(config));

// Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));
