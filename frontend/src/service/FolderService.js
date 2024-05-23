import axios from "axios";

const serverURL = import.meta.env.VITE_API_KEY

const createFolder = (payload) => {
    console.log("payload", payload);
    return axios.post(`${serverURL}/api/v1/createFolder` , payload, {
        headers: {
            "Content-Type": "application/json"
       }
    })
}

const getAllFolders = (email) => {
    return axios.get(`${serverURL}/api/v1/folders/${email}`)
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