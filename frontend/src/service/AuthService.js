import axios from 'axios'

const serverURL = import.meta.env.VITE_API_KEY

const signUpUser = (payload) => {
     return axios.post(`${serverURL}/api/v1/auth/register`, payload, {
          headers: {
               "Content-Type": "application/json"
          }
     })
}

const loginUser = (payload) => {
     return axios.post(`${serverURL}/api/v1/auth/login`, payload, {
          headers: {
               "Content-Type": "application/json"
          }
     })
}

const updatePassword = (payload) => {
     return axios.post(`${serverURL}/api/v1/auth/update-password`, payload, {
          headers: {
               "Content-Type": "application/json"
          }
     })
}

const checkIfEmailIsAlreadyRegistered = (payload) => {
     return axios.post(`${serverURL}/api/v1/auth/check-email`, payload, {
          headers: {
               "Content-Type": "application/json"
          }
     })
}

const updateProfile = (payload) => {
     return axios.put(`${serverURL}/api/v1/auth/update-profile`, payload, {
          headers: {
               "Content-Type": "application/json"
          }
     })
}


const AuthService = {
     signUpUser,
     loginUser,
     updatePassword,
     checkIfEmailIsAlreadyRegistered,
     updateProfile
}

export default AuthService