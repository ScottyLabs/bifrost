import type { Node } from 'constructs';

import { EnvType } from '~/lib/env-type';
import { schema } from './env-config';

export async function initConfig(node: Node) {
  const env = node.tryGetContext('env');

  if (!Object.values(EnvType).includes(env)) {
    throw new Error(`Invalid environment type: ${env}`);
  }

  const config = await import(`./${env}.config`);

  return schema.parse(config.default);
}
