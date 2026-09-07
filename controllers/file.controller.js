import File from "../models/file.model.js";
import customError from "../utils/customError.js";
import crypto from "crypto";
import { PutObjectCommand, GetObjectCommand,DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../config/s3.config.js";

export const getAllFiles = async (req, res) => {
  let { id: parentFolder } = req.params;
  if (parentFolder == "root") {
    parentFolder = null;
  }
  const createdBy = req.userId || 1;
  if (!createdBy) {
    throw new customError("Unauthorized Access", 400);
    return;
  }

  const files = await File.find({ createdBy, parentFolder });

  res.status(200).json({ files });
};

export const uploadFile = async (req, res) => {
  let { id: parentFolder } = req.params;
  if (parentFolder === "root") {
    parentFolder = null;
  }
  const createdBy = req.userId || 1;
  const { fileName, fileSize, mimeType, s3Key } = req.body;

  const newFile = await File.create({
    createdBy,
    fileName,
    fileSize,
    mimeType,
    parentFolder,
    s3Key,
  });

  res.status(201).json({ newFile });
};

export const renameFile = async (req, res) => {
  const createdBy = req.userId || 1;
  let { id } = req.params;

  const { newFileName } = req.body;
  if (!createdBy || !id || !newFileName) {
    throw new customError("All fields are required", 400);
    return;
  }
  const updatedFile = await File.updateOne(
    { _id: id, createdBy },
    { $set: { fileName: newFileName } },
    { new: true, runValidators: true },
  );

  if (!updatedFile) {
    throw new customError("File Not Found", 400);
    return;
  }
  res.status(200).json({ message:"File renamed successfully" });
};

export const deleteFile = async (req, res) => {
  //delete file in s3 after that in db
  const createdBy = req.userId || 1;
  const { id } = req.params;
  const file=await File.findById(id);
  if(!file){
    throw new customError("File not found",400)
    return
  }
  const command=new DeleteObjectCommand({
    Bucket:process.env.AWS_BUCKET_NAME,
    Key:file.s3Key
  })

  await s3Client.send(command)
  await file.deleteOne()
  res.status(200).json({ message: "File deleted successfully" });
};

//signed urls
export const getViewSignedUrl = async (req, res) => {
  const { id } = req.params;
  const file = await File.findById(id).select("s3Key -_id");

  if (!file) {
    throw new customError("File not found", 404);
  }
  const { s3Key } = file;

  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: s3Key,
  });
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: 60 * 10,
  });
  res.status(200).json({ url });
};

export const getUploadSignedUrl = async (req, res) => {
  const { fileType, fileName } = req.body;
  // generate unique id using crypto
  //set the content type
  const s3Key = `uploads/${crypto.randomUUID()}-${fileName}`;
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: s3Key,
    ContentType: fileType,
  });

  const url = await getSignedUrl(s3Client, command, {
    expiresIn: 900, //15 min
  });

  res.status(200).json({ url, s3Key });
};

export const getDownloadSignedUrl = async (req, res) => {
  const { id } = req.params;
  const file = await File.findById(id).select("s3Key fileName -_id");
  if (!file) {
    throw new customError("file not found", 400);
  }
  const { s3Key, fileName } = file;
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    key: s3Key,
    ResponseContentDisposition: `attachment; fileNam=${fileName}`,
  });
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: 60 * 2,
  });
};
