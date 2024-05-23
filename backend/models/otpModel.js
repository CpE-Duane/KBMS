import mongoose from 'mongoose'

const otpSchema = mongoose.Schema(
  {
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    otp: Number,
    otpExpires: Date
  },
  {
    timeStamps: true
  }
);

const OtpModel = mongoose.model('OtpModel', otpSchema);

export default OtpModel;
