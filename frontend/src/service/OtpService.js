import axios from 'axios'

const serverURL = "https://kbms-api.onrender.com"
// const serverURL = "http://localhost:5000"

const generateOtp = (payload) => {
    return axios.post(`${serverURL}/api/v1/generate-otp`, payload)
}

const verifyOtp = (payload) => {
    return axios.post(`${serverURL}/api/v1/verify-otp`, payload)
}


const OtpService = {
    generateOtp,
    verifyOtp
}

export default OtpService