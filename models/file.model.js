import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    owner:{
      type:Number,
      ref:"User",
      default:1,

    },
  fileName: {
    type:String,
    required:true
  },
  fileSize:{
    type:Number,
    required:true
  },
  mimeType:{
    type:String,required:true

  },
  parentFolder:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Folder",
    default:null
  },
  s3Key:{
    type:String,
    required:true,
    unique:true
  }

},{timestamps: true});


const File = mongoose.model('File', fileSchema);
export default File