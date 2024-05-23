import axios from "axios";

const serverURL = "https://kbms-api.onrender.com"
// const serverURL = "http://localhost:5000"

const createFolder = (payload) => {
    return axios.post(`${serverURL}/api/v1/createFolder` , payload, {
        headers: {
            "Content-Type": "application/json"
       }
    })
}

const getAllFolders = () => {
    return axios.get(`${serverURL}/api/v1/folders`)
}

const getFolder = (id) => {
    return axios.get(`${serverURL}/api/v1/folder/${id}` , {
        headers: {
            "Content-Type": "application/json"
       }
    })
}

const updateFolderName = (id, folderName) => {
    return axios.put(`${serverURL}/api/v1/folder/${id}/${folderName}`)
}

const deleteFolder = (id, folderName) => {
    return axios.delete(`${serverURL}/api/v1/delete-folder/${id}/${folderName}` , {
        headers: {
            "Content-Type": "application/json"
       }
    })
}

const FolderService = {
    createFolder,
    getAllFolders,
    getFolder,
    deleteFolder,
    updateFolderName
}

export default FolderService