import * as pulumi from "@pulumi/pulumi";

const stack = pulumi.getStack();

export const config = new pulumi.Config();

export const nm = (name: string) => `${name}-pl-${stack}`;
