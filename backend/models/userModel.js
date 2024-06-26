import mongoose from "mongoose";

const userSchema = mongoose.Schema(
     {
          firstName: {
               type: String,
               required: true,
               trim: true
          },
          lastName: {
               type: String,
               required: true,
               trim: true
          },
          email: {
               type: String,
               required: true,
               unique: true
          },
          password: {
               type: String,
               required: true,
          },
     },
     {
          timeStamps: true
     }
)

const User = mongoose.model("User", userSchema)

export default User