import axios from "axios";

const serverURL = "https://kbms-api.onrender.com"
// const serverURL = "http://localhost:5000"


const getFiles = (folderName) => {
    return axios.get(`${serverURL}/api/v1/files/${folderName}`)
}

const FilesService = {
    getFiles
}

export default FilesService