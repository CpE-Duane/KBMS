import OtpModel from '../models/otpModel.js';
import nodemailer from 'nodemailer';

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'kbms05232024@gmail.com',
    pass: 'jsbc rlao akcm krnx'
  }
});

// Generate OTP
const generateOTPCode = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const generateOtp = async (req, res) => {
  const { email } = req.body;
  const otp = generateOTPCode();
  const otpExpires = Date.now() + 100000; // 1 hour

  try {
    await OtpModel.findOneAndUpdate({ email }, { otp, otpExpires }, { upsert: true });

    const mailOptions = {
      from: 'kbms05232024@gmail.com',
      to: email,
      subject: 'Your OTP',
      text: `Your OTP is ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send(error.toString());
      }
      res.status(200).send({
        success: true,
        message: "Verification code sent successfully."
      });
    });
  } catch (error) {
    res.status(500).send('Server error');
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await OtpModel.findOne({ email, otp, otpExpires: { $gt: Date.now() } });

    if (!user) {
      return res.status(400).send({
        success:false,
        message: 'Invalid or expired OTP'
      });
    }

    res.status(200).send({
        success: true,
        message: 'OTP verified successfully'
    });
  } catch (error) {
    res.status(500).send('Server error');
  }
};
