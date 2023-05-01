import axios from "axios";
import {loginStart , loginSuccess , loginFailure , logout} from "./userReducer";

export const login = async(dispatch , user)=>{
          dispatch(loginStart());
          try {
                   const res = await axios.post("http://139.144.12.15:80/api/user/login" , user);
                   dispatch(loginSuccess(res.data)); 
          } catch (error) {
                    dispatch(loginFailure());
          }
}

export const VerifyEmail = async(dispatch , user)=>{
          dispatch(loginStart());
          try {
                   const res = await axios.post("http://139.144.12.15:80/api/user/verify/email" , user);
                   dispatch(loginSuccess(res.data)); 
          } catch (error) {
                    dispatch(loginFailure());
          }
}


export const signup = async(dispatch , user)=>{
          dispatch(loginStart());
          try {
                   const res = await axios.post("http://139.144.12.15:80/api/user/create/user" , user);
                   dispatch(loginSuccess(res.data)); 
          } catch (error) {
                    dispatch(loginFailure());
          }
}