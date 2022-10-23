import { async } from '@firebase/util';
import React, { useState } from 'react'

export default function Forgotpassword() {
  const [email , setEmail] = useState('');
const handleclick = async(e)=>{
  e.preventDefault();
  await fetch(`http://localhost:5000/api/user/forgot/password` , {method:"POST" , headers:{"Content-Type":"application/JSON"} , body:JSON.stringify({email:email})}).then(()=>{
    alert("We sent you a token email")
  }).catch(()=>{
    alert("Fail to proccess")
  })
}
  return (
    <div style={{width:"100vw" , height:"100vh", display:'flex' , alignItems:"center" , justifyContent:"center"}}>
            <div style={{width:"25%" , padding:"20px" , margin:"auto" , borderRadius:"10px" , backgroundColor:"black"}}>
                <p style={{color:"white"}}>Enter your Email</p>
                <form style={{display:"flex" , flexDirection:"column"}}>
                    <input type={"text"} placeholder="Email" style={{flex:1 , minWidth:"40px" , margin:"10px 0px" , padding:"10px", borderRadius:"10px"}} onChange={(e)=>setEmail(e.target.value)} />
                    <button style={{width:"40%" , border:"none" , padding:"10px 20px" , backgroundColor:"white" , color:"black" , borderRadius:"10px" , margin:"20px 0px" , cursor:"pointer"}} onClick={handleclick}>Send</button>
         
                </form>
            </div>
        </div>
  )
}
