import mongoose from "mongoose";

const folderSchema = new mongoose.Schema({
  owner:{
    type:Number,
    ref:"User",
    default:1,

  },
  folderName: {
    type:String,
    required:true
  },
  parentFolder:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Folder",
    default:null
  },
},{timestamps: true});


const Folder = mongoose.model('Folder', folderSchema);
export default Folder