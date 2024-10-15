import * as aws from "@pulumi/aws";
import * as dotenv from "dotenv";
import { z } from "zod";

// Validate environment variables
dotenv.config();

const envSchema = z.object({
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
    console.error("Invalid environment variables:", env.error.format());
    process.exit(1);
}

// Create a postgres RDS instance
const db = new aws.rds.Instance("bifrost-db", {
  engine: "postgres",
  instanceClass: aws.rds.InstanceType.T3_Micro,
  allocatedStorage: 20,
  dbName: "bifrost",
  username: env.data.DB_USERNAME,
  password: env.data.DB_PASSWORD,
  skipFinalSnapshot: true,
  publiclyAccessible: true,
});

export const dbEndpoint = db.endpoint;

// Create a UserPool and client for hackathon hosts
const hostUserPool = new aws.cognito.UserPool("hackathon-hosts", {
  userPoolAddOns: {
    advancedSecurityMode: "ENFORCED",
  },
  usernameAttributes: ["email"],
  autoVerifiedAttributes: ["email"],
});

const hostUserPoolClient = new aws.cognito.UserPoolClient(
  "hackathon-hosts-client",
  {
    userPoolId: hostUserPool.id,
    generateSecret: false,
  }
);

export const hostUserPoolId = hostUserPool.id;
export const hostUserPoolClientId = hostUserPoolClient.id;
