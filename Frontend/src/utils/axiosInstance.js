import axios from "axios";


const axiosInstance = axios.create({

    baseURL:"http://localhost:3000",

    withCredentials:true //Allows browser to send cookies

});


export default axiosInstance;