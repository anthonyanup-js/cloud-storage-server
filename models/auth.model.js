import {Schema,model} from "mongoose"

const userSchema=Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    fullName:{
        type:String,
        required:true,
    },
    storageUsed:{
        type:Number,
        required:true,
        default:0,
        min:0
    },
    rootFolder:{
        type:Schema.Types.ObjectId,
        required:true

    }
},{timestamps:true})

const User=model("User",userSchema)
export default User