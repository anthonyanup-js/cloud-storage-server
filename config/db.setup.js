import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
console.log("hello")
//run this script when u r running the server for the first time or else u have changes the schema
const userJsonSchema = {
  $jsonSchema: {
    required: [
      "_id",
      "email",
      "password",
      "fullName",
      "storageUsed",
      "createdAt",
      "updatedAt",
    ],
    properties: {
      _id: {
        bsonType: "objectId",
      },
      email: {
        bsonType: "string",
        pattern: "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",
      },
      password: {
        bsonType: "string",
      },
      fullName: {
        bsonType: "string",
      },
      storageUsed: {
        bsonType: "long",
        minimum: 0,
      },
      createdAt: {
        bsonType: "date",
      },
      updatedAt: {
        bsonType: "date",
      },
    },
    additionalProperties: false,
  },
};
const fileJsonSchema = {
  $jsonSchema: {
    required: [
      "_id",
      "owner",
      "fileName",
      "fileSize",
      "mimeType",
      "parentFolder",
      "s3Key",
      "createdAt",
      "updatedAt",
    ],
    properties: {
      _id: {
        bsonType: "objectId",
      },
      owner: {
        bsonType: "objectId",
      },
      fileName: {
        bsonType: "string",
      },
      fileSize: {
        bsonType: "long",
        minimum: 0,
      },
      mimeType: {
        bsonType: "string",
      },
      parentFolder: {
        bsonType: "objectId",
      },
      s3Key: {
        bsonType: "string",
      },
      createdAt: {
        bsonType: "date",
      },
      updatedAt: {
        bsonType: "date",
      },
    },
    additionalProperties: false,
  },
};
const folderJsonSchema = {
  $jsonSchema: {
    required: [
      "_id",
      "parentFolder",
      "owner",
      "folderName",
      "createdAt",
      "updatedAt",
    ],
    properties: {
      _id: {
        bsonType: "objectId",
      },
      parentFolder: {
        bsonType: ["objectId", "null"],
      },
      owner: {
        bsonType: "objectId",
      },
      folderName: {
        bsonType: "string",
      },
      createdAt: {
        bsonType: "date",
      },
      updatedAt: {
        bsonType: "date",
      },
    },
    additionalProperties: false,
  },
};

async function dbSetup() {
  const connectDb = await mongoose.connect(process.env.MONGODB_URL);

  try {
    const db = connectDb.connection.db;


    const [userCollectionExist] = await db
      .listCollections({ name: "users" })
      .toArray();


    const [fileCollectionExist] = await db
      .listCollections({ name: "files" })
      .toArray();


    const [folderCollectionExist] = await db
      .listCollections({ name: "folders" })
      .toArray();


    if (!userCollectionExist) {
      await db.createCollection("users", {
        validator: userJsonSchema,
        validationLevel: "strict",
        validationAction: "error",
      });
    } else {
      await db.command({
        collMod: "users",
        validator: userJsonSchema,
        validationAction: "error",
        validationLevel: "strict",
      });
    }

    if (!fileCollectionExist) {
      await db.createCollection("files", {
        validator: fileJsonSchema,
        validationLevel: "strict",
        validationAction: "error",
      });
    } else {
      await db.command({
        collMod: "files",
        validator: fileJsonSchema,
        validationAction: "error",

        validationLevel: "strict",
      });
    }

    if (!folderCollectionExist) {
      await db.createCollection("folders", {
        validator: folderJsonSchema,
        validationLevel: "strict",
        validationAction: "error",
      });
    } else {
      await db.command({
        collMod: "folders",
        validator: folderJsonSchema,
        validationAction: "error",
        validationLevel: "strict",
      });
    }
  } catch (error) {
    console.log("error while dbsetup");
    console.log(error);
  } finally {
    await connectDb.disconnect();
    console.log("db disconnected");
  }
}


await dbSetup()
export default dbSetup