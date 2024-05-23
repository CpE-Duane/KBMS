import axios from 'axios'

const serverURL = import.meta.env.VITE_API_KEY

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