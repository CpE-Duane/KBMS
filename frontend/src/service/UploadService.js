import axios from 'axios';

const serverURL = import.meta.env.VITE_API_KEY

const uploadFile = (payload, folderName) => {
    return axios.post(`${serverURL}/api/v1/upload/${folderName}` , payload)
}

const deleteFile = (folderName, fileName) => {
    return axios.delete(`${serverURL}/api/v1/files/${folderName}/${fileName}`)
}

const getLatestFiles = () => {
    return axios.get(`${serverURL}/api/v1/files/latest-files`)

}


const UploadService = {
    uploadFile,
    deleteFile,
    getLatestFiles
}

export default UploadService;