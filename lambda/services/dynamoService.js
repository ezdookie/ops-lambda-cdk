import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const dynamoClient = new DynamoDBClient();
const TABLE_NAME = process.env.TABLE_NAME;

export const updateFileStatus = async (fileId, status) => {
  // update file status in dynamodb
  await dynamoClient.send(
    new UpdateItemCommand({
      TableName: TABLE_NAME,
      Key: {
        fileId: { S: fileId },
      },
      UpdateExpression: "SET fileStatus = :status",
      ExpressionAttributeValues: {
        ":status": { S: status },
      },
    })
  );
};

export const saveMetadata = async (fileId, metadata) => {
  // update file metadata in dynamodb and set file status to PROCESSED
  await dynamoClient.send(
    new UpdateItemCommand({
      TableName: TABLE_NAME,
      Key: {
        fileId: { S: fileId },
      },
      UpdateExpression: "SET fileMetadata = :metadata, fileStatus = :status",
      ExpressionAttributeValues: {
        ":metadata": { M: marshall(metadata) },
        ":status": { S: "PROCESSED" },
      },
    })
  );
};
