import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3notifications from "aws-cdk-lib/aws-s3-notifications";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export class OpsLambdaCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // create an s3 bucket
    const bucket = new s3.Bucket(this, "OpsBucket");

    // create dynamodb table
    const table = new dynamodb.Table(this, "OpsTable", {
      partitionKey: { name: "fileId", type: dynamodb.AttributeType.STRING },
    });

    // create proccess file lambda
    const processFileLambda = new lambda.Function(this, "ProcessFileLambda", {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("lambda"),
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    // grant read access to the bucket
    bucket.grantRead(processFileLambda);

    // grant write access to the table
    table.grantWriteData(processFileLambda);

    // add event notification to the bucket
    bucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new s3notifications.LambdaDestination(processFileLambda)
    );
  }
}
