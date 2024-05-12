import {toast} from "react-hot-toast";
import { apiConnector } from "../Connector";
import { userEndpoints } from "../Apis";

import { logOutUser, setAccount } from "../../App/Slice/UserSlice";

const {LOGIN_API, REGISTER_API, VALIDATE_GMAIL} = userEndpoints;

export function login(email, password, navigate){
    return async(dispatch) => {
        const toastId = toast.loading("Letting you In..");
        let data;
        try{
            const response = await apiConnector("POST",LOGIN_API, {email, password})
            console.log("Login API response : ", response);
            if(response.data.success){
                toast.success("Login Successful..");
                console.log("l"+ response.data);
                const temp = { "id": response.data.user.loginId, "uname": response.data.user.username, "uemail": response.data.user.useremail,"token":response.data.token}
                dispatch(setAccount(temp))
                navigate("/dashboard");
              }else{
                throw new Error(response.data.message);
              }
        } catch(error){
            console.log("LOGIN API Error....", error);
            toast.dismiss(toastId);
            toast.error(error.response?.data?.message);
        }
        toast.dismiss(toastId);
    }
}
export function register(email, password, username, navigate){
    return async(dispatch) => {
        const toastId = toast.loading("Registering..");
        try{
            const response = await apiConnector("POST", REGISTER_API, {email, password, username})
            console.log("Register API response : ", response);
            if(response.data.success){
                toast.success("Registration Successful..");
                toast.success("Verify your email..");
                const temp = {"token":response.data.token, "id": response.data.user.id,}
                dispatch(setAccount(temp));
                navigate("/verifyEmail");
                console.log(response);
              }else{
                toast.error(response.data.message);
                throw new Error(response.data.message);
              }
        } catch(error){
            console.log("REGISTRATION API Error....", error);
            toast.error("Registration Failed..");
        }
        toast.dismiss(toastId);
    }
}
export function authEmail(userId, otp, token, navigate){
    return async(dispatch) => {
        const toastId = toast.loading("Registering..");
        try{
            const response = await apiConnector("POST", VALIDATE_GMAIL, {userId, otp}, {Authorization: `Bearer ${token}`,})
            console.log("Validate API response : ", response);
            if(response.data.success){
                toast.success("Validation Successful..");
                navigate("/login");
                toast("Please Login...")
                console.log(response);
              }else{
                toast.error(response.data.message);
                throw new Error(response.data.message);
              }
        } catch(error){
            console.log("VALIDATION API Error....", error);
            toast.error("Validation Failed..");
        }
        toast.dismiss(toastId);
    }
}
