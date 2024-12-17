import z from "zod";

const schema = z.object({
  OIDC_ISSUER: z.string(),
  OIDC_CLIENT_ID: z.string(),
  OIDC_CLIENT_SECRET: z.string(),
  SESSION_SECRET: z.string(),
  API_URL: z.string(),
  URL: z.string(),
});

export const env = schema.parse(process.env);
