import { getS3Object } from "./services/s3Service.js";
import { updateFileStatus, saveMetadata } from "./services/dynamoService.js";
import { getMetadata } from "./services/fileService.js";

export const handler = async (event) => {
  const tasks = event.Records.map(async (record) => {
    // get s3 object details
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));
    const fileId = key.split("/")[0];

    let fileObject;

    try {
      // get s3 object
      fileObject = await getS3Object(bucket, key);
    } catch (err) {
      console.log("error fetching file: ", err);
      throw err;
    }

    let metadata;

    try {
      // extract metadata from file
      metadata = await getMetadata(fileObject);
    } catch (err) {
      console.log("error getting metadata: ", err);
      updateFileStatus(fileId, "PROCESSING_ERROR");
      throw err;
    }

    // save metadata to dynamodb
    await saveMetadata(fileId, metadata);
  });

  await Promise.all(tasks);
};
