import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const config = new pulumi.Config();

const dbName = config.get("dbName");
const dbUsername = config.require("dbUsername");
const dbPassword = config.requireSecret("dbPassword");

// Create an Aurora Serverless v2 cluster with Data API
const vpc = aws.ec2.getVpc({ default: true });
const subnet = aws.rds.getSubnetGroup({ name: "default" });

const securityGroup = new aws.ec2.SecurityGroup("aurora-sg", {
  vpcId: vpc.then((v) => v.id),
  description: "Allow PostgreSQL access",
  ingress: [
    {
      protocol: "tcp",
      fromPort: 5432, // default port for PostgreSQL
      toPort: 5432,
      cidrBlocks: ["0.0.0.0/0"], // TODO: restrict for production
    },
  ],
  egress: [
    // allow all outbound traffic
    {
      protocol: "-1", // all protocols
      fromPort: 0,
      toPort: 0,
      cidrBlocks: ["0.0.0.0/0"], // all destinations
    },
  ],
});

const dbSecret = new aws.secretsmanager.Secret("dbSecret", {
  description: "Secrets for Aurora DB",
});

new aws.secretsmanager.SecretVersion("dbSecretVersion", {
  secretId: dbSecret.id,
  secretString: pulumi.interpolate`{
      "username": "${dbUsername}",
      "password": "${dbPassword}"
  }`,
});

const cluster = new aws.rds.Cluster("bifrost-cluster", {
  engine: "aurora-postgresql",
  engineMode: "serverless",
  engineVersion: "13.7",
  masterUsername: dbUsername,
  masterPassword: dbPassword,
  databaseName: dbName,
  vpcSecurityGroupIds: [securityGroup.id],
  dbSubnetGroupName: subnet.then((s) => s.name),
  scalingConfiguration: {
    autoPause: false,
    maxCapacity: 8,
    minCapacity: 2, // lowest possible value for PostgreSQL
  },
  enableHttpEndpoint: true, // Enable Data API
});

export const clusterArn = cluster.arn;
export const secretArn = dbSecret.arn;
export const clusterEndpoint = cluster.endpoint;
export const databaseName = cluster.databaseName;

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
  },
);

export const poolId = hostUserPool.id;
export const poolClientId = hostUserPoolClient.id;
