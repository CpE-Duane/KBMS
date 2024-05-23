import mongoose from "mongoose"
import Folder from "../models/folderModel.js"
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const createFolder = async (req, res) => {
    try {
        const { folderName, email } = req.body; // Assuming email is sent in the request body
        console.log("req.body", req.body);
        if (!folderName || !email) {
            return res.status(400).send({
                success: false,
                message: "Please provide folder name and email."
            });
        }

        const existingFolder = await Folder.findOne({ folderName });
        if (existingFolder) {
            return res.status(409).send({
                success: false,
                message: "Folder with this name already exists."
            });
        }

        const folder = await Folder.create({
            folderName,
            email // Storing the email provided in the request
        });

        const uploadsDir = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir);
        }
        
        const folderPath = path.join(uploadsDir, folderName);
        fs.mkdirSync(folderPath);

        res.status(201).send({
            success: true,
            message: "Folder created successfully",
            folder
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Creating a folder.",
            error: error
        });
    }
}


const updateFolderName = async (req, res) => {
    try {
        const { folderName, id } = req.params;
        console.log("para,s", req.params);

        const findFolder = await Folder.findOne(
            new mongoose.Types.ObjectId(id)
        );

        if (!findFolder) {
            return res.status(404).send({
                success: false,
                message: "Folder not found."
            });
        }

        const updatedFolder = await Folder.findByIdAndUpdate(
            new mongoose.Types.ObjectId(id),
            { folderName },
            { new: true }
        );

        console.log("updatedFolder", updatedFolder);

        // Rename folder on the file system
        const oldFolderPath = path.join(__dirname, '..', 'uploads', findFolder.folderName);
        const newFolderPath = path.join(__dirname, '..', 'uploads', folderName);

        fs.rename(oldFolderPath, newFolderPath, (err) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: "Error in updating folder name on the file system.",
                    error: err
                });
            }
        });

        res.status(200).send({
            success: true,
            message: "Folder name updated successfully.",
            folder: updatedFolder
        });
    } catch (error) {
        console.log("error", error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in updating folder name."
        });
    }
};


const getAllFolders = async (req, res) => {
    try {
        const {email} = req.params
        const folders = await Folder.find({email});

        if (!folders) {
            return res.status(404).send({
                success: false,
                message: "No Folder exist."
           })
        }

        res.status(200).send({
            success: true,
            message: "Folders fetch successfully.",
            folders
       })

    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: "Error while getting folders."
       })
    }
}

const getFolder = async (req, res) => {
    try {
        const {id} = req.params;

        const folder = await Folder.findOne({_id: new mongoose.Types.ObjectId(id)})

        if (!folder) {
            return res.status(404).send({
                success: false,
                message: "Folder not found."
           })
        }

        return res.status(200).send({
            success: true,
            message: "Folder fetched successfully.",
            category
       })
        
    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: "Error while getting a folder."
       })
    }
}

const deleteFolderRecursive = async (folderPath) => {
    return new Promise((resolve, reject) => {
        fs.stat(folderPath, (err, stats) => {
            if (err) {
                return reject(new Error('Folder does not exist'));
            }

            if (stats.isDirectory()) {
                fs.readdir(folderPath, async (err, files) => {
                    if (err) {
                        return reject(err);
                    }

                    const promises = files.map(file => {
                        const filePath = path.join(folderPath, file);
                        return fs.promises.stat(filePath).then(stats => {
                            if (stats.isDirectory()) {
                                return deleteFolderRecursive(filePath);
                            } else {
                                return fs.promises.unlink(filePath);
                            }
                        });
                    });

                    await Promise.all(promises)
                        .then(() => fs.promises.rmdir(folderPath))
                        .then(resolve)
                        .catch(reject);
                });
            } else {
                reject(new Error('Path is not a directory'));
            }
        });
    });
};


const deleteFolder = async (req, res) => {
    try {
        const { id, folderName } = req.params
        
        console.log("folderName", folderName);

        const folder = await Folder.findOne({ _id: new mongoose.Types.ObjectId(id), folderName: folderName  })
        console.log("folder", folder);
        if (!folder) {
             req.status(400).send({
                  success: false,
                  message: "Folder not found."
             })
        }

        await Folder.findByIdAndDelete({ _id: new mongoose.Types.ObjectId(id), folderName: folderName  })


        const folderPath = path.join(__dirname, '..', 'uploads', folderName);

        await deleteFolderRecursive(folderPath)
        .then(() => {
            res.status(200).send({
                success: true,
                message: "Folder deleted successfully."
           })
        })
        .catch(err => res.status(500).json({ error: err.message }));
        
   } catch (error) {
        res.status(500).send({
             success: false,
             error,
             message: "Error in deleting a folder."
        })
   }
}

const FolderController = {
    createFolder,
    getAllFolders,
    getFolder,
    deleteFolder,
    updateFolderName
}

export default FolderController;