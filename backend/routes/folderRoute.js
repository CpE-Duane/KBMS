import express from 'express'
import FolderController from '../controllers/folderController.js'


const router = express.Router()

router.post("/createFolder", FolderController.createFolder)

router.get("/folders/:email", FolderController.getAllFolders)

router.get("/folder/:id", FolderController.getFolder)

router.put("/folder/:id/:folderName", FolderController.updateFolderName);

router.delete("/delete-folder/:id/:folderName", FolderController.deleteFolder)

export default router;