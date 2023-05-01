import { async } from '@firebase/util';
import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function Resetpassword() {
  const location = useLocation();
  const code = location.search.split("?")[1];
  console.log(code);
  const [password , setpassword] = useState("");
  console.log(password);
  const handleClick = async(e)=>{
    e.preventDefault();
    await fetch(`http://139.144.12.15:5000/api/user/reset/password?${code}` , {method:"PUT" , headers:{'Content-Type':"application/JSON"} , body:JSON.stringify({password:password})}).then((data)=>{
      alert("Your password rest successfully")
    })
  };
  return (
    <div style={{width:"100vw" , height:"100vh", display:'flex' , alignItems:"center" , justifyContent:"center"}}>
            <div style={{width:"25%" , padding:"20px" , margin:"auto" , borderRadius:"10px" , backgroundColor:"black"}}>
                <p style={{color:"white"}}>Enter Your New Password</p>
                <form style={{display:"flex" , flexDirection:"column"}}>
                    <input type={"password"} placeholder="**********" style={{flex:1 , minWidth:"40px" , margin:"10px 0px" , padding:"10px", borderRadius:"10px"}} onChange={(e)=>setpassword(e.target.value)}/>
                    <button style={{width:"40%" , border:"none" , padding:"10px 20px" , backgroundColor:"white" , color:"black" , borderRadius:"10px" , margin:"20px 0px" , cursor:"pointer"}} onClick={handleClick}>Set Password</button>
         
                </form>
            </div>
        </div>
  )
}
