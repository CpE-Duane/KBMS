import express from 'express'
import multer from 'multer';
import path, { dirname }  from 'path';
import { fileURLToPath } from 'url';
import UploadController from '../controllers/uploadController.js';
import bodyParser from 'body-parser';
import fs from 'fs'

const router = express.Router()

const __dirname = dirname(fileURLToPath(import.meta.url));

router.use(bodyParser.urlencoded({ extended: false }));

router.use(bodyParser.json());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    const { folderName } = req.params;
    let uploadPath = path.join(__dirname, '..', 'uploads');

    if (folderName) {
        uploadPath = path.join(uploadPath, folderName);
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true }); 
        }
    }

    cb(null, uploadPath);

    },

    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage }).array('file');


router.post('/upload/:folderName', upload, UploadController.uploadFile);

router.get('/files/:folderName/:filename', UploadController.getFile);

router.get('/files/latest-files', UploadController.getLatestFiles);

router.delete('/files/:folderName/:filename', UploadController.deleteFile); // New route for file deletion

export default router