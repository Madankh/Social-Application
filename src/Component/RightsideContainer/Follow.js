import React from 'react'
import image1 from "../Images/image3.jpg";
import image2 from "../Images/image2.jpg";
import image5 from "../Images/image5.jpg";
import image4 from "../Images/image4.jpg";
import image6 from "../Images/image6.jpg";
import image7 from "../Images/image1.jpg";
import addFriends from "../Images/add-user.png";
import UserToFollow from "../Images/afterFollowImg.png"
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
export default function Follow({userdetails}) {
  const userDetails = useSelector((state)=>state.user);
  let user = userDetails?.user
  // console.log(user);
  let id = user?.other?._id;
  // console.log(id);

    const accessToken = user?.accessToken;
    const [Follow , setFollow] = useState(addFriends);
    const handleFollow= async(e)=>{
            await fetch(`http://localhost:5000/api/user/following/${userdetails._id}` , {method:'PUT', headers:{'Content-Type':"application/JSON" , token:accessToken} , body:JSON.stringify({user:`${id}`})})
            setFollow(UserToFollow);
      }
  return (
          <div style={{marginTop:"-10px"}} key={userdetails._id}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link to={`/Profile/${userdetails._id}`}>
            <div style={{ display: 'flex', alignItems: "center" }}>
              <img src={`${userdetails.profile}`} className="Profileimage" alt="" />
              <div>
                <p style={{ marginLeft: "10px" , textAlign:'start' }}>{userdetails.username}</p>
                <p style={{ marginLeft: "10px" , textAlign:'start' , marginTop:"-16px" , fontSize:"11px" , color:"#aaa" }}>Suggested for you</p>
              </div>
            </div>
            </Link>
            <div style={{ backgroundColor: "#aaa", padding: '10px', marginRight: 13, borderRadius: "50%" , cursor:'pointer' }} onClick={e=>handleFollow(userdetails._id)}>
              <img src={`${Follow}`} className="addfriend" alt=""  />
            </div>
          </div>
        </div>
  )
}
