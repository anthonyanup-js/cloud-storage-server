import express from "express"
import {uploadFile,renameFile,deleteFile,getAllFiles,getViewSignedUrl,getUploadSignedUrl,getDownloadSignedUrl} from "../controllers/file.controller.js"
const router=express.Router()

router.get("/:id",getAllFiles)
router.post("/:id",uploadFile)
router.patch("/:id",renameFile)
router.delete("/:id",deleteFile)


//generate signed urls
router.post("/signed-url/upload",getUploadSignedUrl)
router.get("/signed-url/view/:id",getViewSignedUrl)
router.get("/signed-url/download",getDownloadSignedUrl)

//multipart upload

export default router