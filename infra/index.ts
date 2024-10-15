import * as aws from "@pulumi/aws";

// Create a UserPool and client for hackathon hosts
const hostUserPool = new aws.cognito.UserPool("hackathon-hosts", {
    userPoolAddOns: {
        advancedSecurityMode: "ENFORCED",
    },
    usernameAttributes: ["email"],
    autoVerifiedAttributes: ["email"],
});

const hostUserPoolClient = new aws.cognito.UserPoolClient("hackathon-hosts-client", {
    userPoolId: hostUserPool.id,
    generateSecret: false,
});

export const hostUserPoolId = hostUserPool.id;
export const hostUserPoolClientId = hostUserPoolClient.id;
