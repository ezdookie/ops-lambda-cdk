#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { OpsLambdaCdkStack } from "../lib/ops-lambda-cdk-stack";

const app = new cdk.App();
new OpsLambdaCdkStack(app, "OpsLambdaCdkStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
