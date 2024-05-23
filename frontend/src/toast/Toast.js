import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const toastDefault = {
    position: "top-right", 
    theme: "colored",
    autoClose: 3000,
    hideProgressBar: false,
    pauseOnHover: false,
    pauseOnFocusLoss: false
}

let successMsg = (msg) => {
    toast.success(msg, toastDefault);

}
let errorMsg = (msg) => {
    toast.error(msg, toastDefault);
}

let warningMsg = (msg) => {
     toast.warning(msg, toastDefault);
 }

const Toast = {
    successMsg,
    errorMsg,
    warningMsg
}

export default Toast