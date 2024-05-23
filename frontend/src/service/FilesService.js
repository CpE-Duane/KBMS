import axios from "axios";

const serverURL = import.meta.env.VITE_API_KEY

const getFiles = (folderName) => {
    return axios.get(`${serverURL}/api/v1/files/${folderName}`)
}

const FilesService = {
    getFiles
}

export default FilesService