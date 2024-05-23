import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js';
import authRoute from './routes/authRoute.js'
import otpRoutes from './routes/otpRoutes.js'
import folderRoute from './routes/folderRoute.js'
import uploadRoute from './routes/uploadRoute.js'
import fileRoutes from './routes/fileRoutes.js'

// configure env
dotenv.config()

// database config
connectDB()

// rest object
const app = express()
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRoute)
app.use("/api/v1/", otpRoutes)
app.use("/api/v1/", folderRoute)
app.use('/api/v1/', uploadRoute);
app.use('/api/v1/', fileRoutes);

app.listen(process.env.PORT, () => {
     console.log(`Server running on port ${process.env.PORT}`.bgBlue)
})