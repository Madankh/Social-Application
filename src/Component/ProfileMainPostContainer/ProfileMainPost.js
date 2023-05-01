import React, { useEffect } from 'react'
import "./profilemainPost.css";
import Coverimage from "../Images/Profile.png"
import ContentPost from "../ContentPostContainer/ContentPost"
import Post from '../ProfilePostContainer/Post';
import { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
export default function ProfileMainPost() {
  const [post , setPost] = useState([]);
  let location = useLocation();
  let id = location.pathname.split("/")[2];
  useEffect(() => {
    const getPost = async()=>{
      try {
        const res = await axios.get(`http://139.144.12.15:80/api/post/get/post/${id}`)
        setPost(res.data);
      } catch (error) {
        console.log("error occured")
      }
    }
    getPost();
  }, [])
  
  return (
    <div className='ProfilemainPostContainer'>
      <div>
        <img src={`${Coverimage}`} className="profileCoverimage" alt="" />
        <h2 style={{marginTop:-43 , color:"white" , textAlign:"start" , marginLeft:"34px"}}>Your Profile</h2>
      </div>
      <ContentPost/>
      {post.map((item)=>(
        <Post detail={item}/>
      ))}
    </div>
  )
}
