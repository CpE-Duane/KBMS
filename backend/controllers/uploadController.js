import path, { dirname } from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const uploadFile = (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files were uploaded' });
  }
  req.files.forEach(file => {
  });
  res.json({ message: 'Files uploaded successfully' });
};

const getFile = (req, res) => {
    const {filename, folderName} = req.params;
    const filePath = path.join(__dirname, '..', 'uploads', folderName, filename);
    // Check if file exists
    fs.exists(filePath, (exists) => {
      if (exists) {
        // Send the file
        res.sendFile(filePath);
      } else {
        res.status(404).json({ message: 'File not found' });
      }
    });
  };

  const deleteFile = (req, res) => {
    const { filename, folderName } = req.params;
    const filePath = path.join(__dirname, '..', 'uploads', folderName, filename);
  
    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).json({ error: 'File not found' });
      }
  
      // Delete the file
      fs.unlink(filePath, (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error deleting file' });
        }
        return res.json({ message: 'File deleted successfully' });
      });
    });
  };

  const getLatestFiles = (req, res) => {
    const uploadsPath = path.join(__dirname, '..', 'uploads');
  
    // Read the contents of the uploads directory
    fs.readdir(uploadsPath, (err, folders) => {
      if (err) {
        return res.status(500).json({ error: 'Error reading directory' });
      }
  
      const latestFiles = [];
  
      // Counter to keep track of how many folders have been processed
      let processedFolders = 0;
  
      // Loop through each folder
      folders.forEach((folder) => {
        const folderPath = path.join(uploadsPath, folder);
  
        // Read the contents of each folder
        fs.readdir(folderPath, (err, files) => {
          if (err) {
            return res.status(500).json({ error: 'Error reading folder' });
          }
  
          // Get information about each file
          files.forEach((file) => {
            const filePath = path.join(folderPath, file);
            const fileStats = fs.statSync(filePath);
            const fileInfo = {
              folderName: folder,
              fileName: file,
              createdAt: fileStats.birthtime // Using birthtime to get creation time
            };
            latestFiles.push(fileInfo);
          });
  
          // Increment the counter
          processedFolders++;
  
          // Check if all folders have been processed
          if (processedFolders === folders.length) {
            // Sort files by creation time (newest first)
            latestFiles.sort((a, b) => b.createdAt - a.createdAt);
  
            // Send the three latest files
            res.json(latestFiles.slice(0, 3));
          }
        });
      });
    });
  };
  

const UploadController = {
    uploadFile,
    getFile,
    deleteFile,
    getLatestFiles
}

export default UploadController