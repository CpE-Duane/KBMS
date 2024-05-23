import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'

const router = express.Router();

const __dirname = dirname(fileURLToPath(import.meta.url));

router.get('/files/:folderName', (req, res) => {
    const {folderName} = req.params;
    const directoryPath = path.join(__dirname, '..', 'uploads', folderName);

    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        return res.status(500).json({ error: 'Unable to read directory' });
      }
      res.json({ files });
    });
  });

export default router