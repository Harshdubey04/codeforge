import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {checkAuth} from "../../api/authAPI";
import {setUser,setLoading} from "../../redux/authSlice";


const AuthInitializer=({children})=>{

const dispatch=useDispatch();


useEffect(()=>{


const verify=async()=>{

try{

const response=await checkAuth();

dispatch(setUser(response.user));

}

catch(error){

console.log("User not authenticated");

}

finally{

dispatch(setLoading(false));

}


};


verify();


},[dispatch]);



return children;

};


export default AuthInitializer;