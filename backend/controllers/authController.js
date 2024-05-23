import authHelper from "../helpers/authHelper.js"
import User from "../models/userModel.js"
import jwt from 'jsonwebtoken'

const register = async (req, res) => {
     try {
          const { firstName, lastName, email, password } = req.body

          if (!firstName || !lastName || !email || !password) {
               return res.send({ error: "All fields are required." })
          }

          const existingUser = await User.findOne({ email })

          if (existingUser) {
               return res.status(200).send({
                    success: false,
                    message: "You are already registered please login."
               })
          }

          const hashedPassword = await authHelper.hashPassword(password)

          const user = await User.create({
               firstName,
               lastName,
               email,
               password: hashedPassword
          })

          res.status(201).send({
               success: true,
               message: "Registered Successfully",
               user: user
          })

     } catch (error) {
          console.log(error)
          res.status(500).send({
               success: false,
               message: "Error in Registration.",
               error: error
          })
     }
}

const checkIfEmailIsAlreadyRegistered = async (req,res) => {
     try {
          const {email} = req.body;

          if (!email) {
               return res.send({ error: "Please enter your email." })
          }

          const existingUser = await User.findOne({ email })

          if (!existingUser) {
               res.status(400).send({
                    success: false,
                    message: "Your email is not registered..",
               })
          }

          res.status(200).send({
               success: true,
               message: "Verification code sent successfully.",
               email
          })

     } catch (error) {
          console.log(error)
          res.status(500).send({
               success: false,
               message: "Error sending code.",
               error: error
          })
     }
}

const login = async (req, res) => {
     try {
          const { email, password } = req.body
          if (!email || !password) {
               return res.status(404).send({
                    success: false,
                    message: "All fields are required."
               })
          }

          const user = await User.findOne({ email })
          if (!user) {
               return res.status(400).send({
                    success: false,
                    message: "Invalid email or password."
               })
          }

          const match = await authHelper.comparePassword(password, user.password)
          if (!match || !user) {
               return res.status(400).send({
                    success: false,
                    message: "Invalid email or password."
               })
          }

          const token = jwt.sign(
               { _id: user._id },
               process.env.JWT_SECRET,
               { expiresIn: "1d" }
          )

          res.status(200).send({
               success: true,
               message: "Login successfully.",
               user: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
               },
               token: token
          })

     } catch (error) {
          console.log(error)
          res.status(500).send({
               success: false,
               message: "Error in Login.",
               error: error
          })
     }
}

const updatePassword = async (req, res) => {
     try {

          const { email, newPassword } = req.body
          if (!email || !newPassword) {
               res.status(400).send({ message: "All fields are required."})
          }

          const user = await User.findOne({email})
          if (!user) {
               return res.status(404).send({
                    success: false,
                    message: "Email not registered."
               })
          }

          const hashed = await authHelper.hashPassword(newPassword)
          await User.findByIdAndUpdate(user._id, { password: hashed})
          res.status(200).send({
               success: true,
               message: "Password reset sucessfully."
          })

     } catch (error) {
          console.log(error)
          res.status(500).send({
               success: false,
               message: "Something went wrong.",
               error: error
          })
     }
}

const updateProfile = async (req, res) => {
     try {
         const { email, firstName, lastName } = req.body;
 
         if (!email || !firstName || !lastName) {
             return res.status(400).send({ message: "All fields are required." });
         }
 
         // Find the user by email
         const user = await User.findOne({ email });
         if (!user) {
             return res.status(404).send({
                 success: false,
                 message: "Email not registered."
             });
         }
 
         // Update the user's firstName and lastName
         user.firstName = firstName;
         user.lastName = lastName;
         await user.save();
 
         // Respond with success message
         res.status(200).send({
             success: true,
             message: "Profile updated successfully.",
             user: {
                 _id: user._id,
                 firstName: user.firstName,
                 lastName: user.lastName,
                 email: user.email
             }
         });
     } catch (error) {
         console.log(error);
         res.status(500).send({
             success: false,
             message: "Error updating name.",
             error: error
         });
     }
 };
 

const authController = {
     register,
     login,
     updatePassword,
     checkIfEmailIsAlreadyRegistered,
     updateProfile
}

export default authController
