import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client();

export const getS3Object = async (bucket, key) => {
  return await s3Client.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );
};
