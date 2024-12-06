import { z } from 'zod';

export const schema = z.object({
  name: z.string(),
  accountId: z.string(),
  region: z.string(),
  zoneId: z.string(),
  domain: z.string(),
  github: z.object({
    owner: z.string(),
    repo: z.string(),
    branch: z.string(),
  }),
});

export type Config = z.infer<typeof schema>;
