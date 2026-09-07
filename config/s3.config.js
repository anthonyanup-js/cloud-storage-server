import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({}); //we dont need to put credentials because s3 will automatically extract it from .env