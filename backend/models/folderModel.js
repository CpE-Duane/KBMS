import mongoose from "mongoose";

const folderSchema = mongoose.Schema(
     {
          folderName: {
               type: String,
               required: true,
               trim: true
          },
          createdAt: {
               type: Date,
               default: Date.now
          },
          email: {
               type: String,
               required: true // Assuming email is required
          }
     },
     {
          timeStamps: true
     }
)

const Folder = mongoose.model("Folder", folderSchema)

export default Folder