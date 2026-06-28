import axiosClient from "../utils/axiosInstance";


// Signup API
export const registerUser = async(data)=>{
try{
        const response = await axiosClient.post(
            "/user/register",
            data
        );

        return response.data;

    }
    catch(error){

        throw error.response?.data || error.message;

    }


};



// Login API

export const loginUser = async(data)=>{


 try{

    const response = await axiosClient.post(
        "/user/login",
        data
    );

        return response.data;

    }
    catch(error){

        throw error.response?.data || error.message;

    }


};




// Check existing login

export const checkAuth = async()=>{

const response = await axiosClient.get(
    "/user/check"
);

return response.data;

};




// Logout

export const logoutUser = async()=>{


const response = await axiosClient.post(
    "/user/logout"
);


return response.data;


};