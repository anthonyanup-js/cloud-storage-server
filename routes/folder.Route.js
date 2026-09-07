import express from "express"
import {deleteFolder,renameFolder,createFolder,getFolderContent} from "../controllers/folder.controller.js"

const router=express.Router()

// router.get("/root",getRootFolders)
router.get("{/:id}",getFolderContent)
router.post("{/:parentFolder}",createFolder)
router.delete("/:id",deleteFolder)
router.patch("/:id",renameFolder)
export default router