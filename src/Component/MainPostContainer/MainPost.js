import React from 'react'
import "./mainPost.css";
import ContentPost from "../ContentPostContainer/ContentPost"
import Post from '../PostContainer/Post';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { useSelector } from 'react-redux';
export default function MainPost() {
  const userDetails = useSelector((state)=>state.user);
  let user = userDetails.user;
  console.log(user);
  let id = user?.other?._id;
  const accesstoken = user.accessToken;
  console.log(accesstoken)
  const [post , setPost] = useState([]);
  useEffect(() => {
   const getPost = async()=>{
    try {
      const res = await axios.get(`http://139.144.12.15:80/api/user/flw/${id}` , {
        headers:{
          token:accesstoken
        }
      })
      setPost(res.data);
    } catch (error) {
      
    }
   }
   getPost();
  }, [])

  console.log(post);
  
  return (
    <div className='mainPostContainer'>
      <ContentPost/>
      {post.map((item)=>(
          <Post post={item}/>
      ))}
    </div>
  )
}
