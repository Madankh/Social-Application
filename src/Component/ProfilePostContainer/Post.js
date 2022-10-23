import React, { useState } from 'react'
import "./post.css";
import ProfileImage from "../Images/Profile.png"
import LikeIcon from "../Images/like.png";
import CommentIcon from "../Images/speech-bubble.png";
import Shareicon from "../Images/share.png";
import Moreoption from "../Images/more.png";
import anotherlikeicon from "../Images/setLike.png"
import { useEffect } from 'react';
import axios from 'axios';
export default function Post({detail}) {
  console.log(detail)
  const [count, setCount] = useState(0);
  const [Comments, setComments] = useState([]);
  const [commentwriting, setcommentwriting] = useState('');
  const [show, setshow] = useState(false);
  
  const [user , setuser] = useState([]);
  useEffect(() => {
    const getuser = async()=>{
      try {
        const res  = await axios.get(`http://localhost:5000/api/user/post/user/details/${detail.user}`)
        setuser(res.data);
      } catch (error) {
        console.log("Some error occured")
      }
    }
    getuser();
  }, [])

  console.log(user)
  
  const handleLike = async() => {
    // if (Like == LikeIcon) {
    //   await fetch(`http://localhost:5000/api/post/${post._id}/like` , {method:"PUT" , headers:{'Content-Type':"application/Json" , token:accessToken}})
    //   setLike(anotherlikeicon);
    //   setCount(count + 1);
    // } else {
    //   await fetch(`http://localhost:5000/api/post/${post._id}/like` , {method:"PUT" , headers:{'Content-Type':"application/Json" , token:accessToken}})
    //   setLike(LikeIcon)
    //   setCount(count - 1);
    // }
  }

  const addComment = () => {
    const comment = {
      "id": "61fsbf23123123123123",
      "username": "suman",
      "title": `${commentwriting}`
    }
    setComments(Comments.concat(comment));
  }

  const handleComment = () => {
    addComment();
  }

  console.log(Comments)

const handleshow = ()=>{
  if(show === false){
    setshow(true)
  }else{
    setshow(false)
  }
}
console.log(detail.like.length)

  return (
    <div className='PostContainer'>
      <div className='SubPostContainer'>
        <div>
          <div style={{ display: 'flex', alignItems: "center" }}>
            <img src={`${user.profile}`} className="PostImage" alt="" /> 
            
            <div>
              <p style={{ marginLeft: '5px', textAlign: "start" }}>{user.username}</p>
              <p style={{ fontSize: "11px", textAlign: "start", marginLeft: 5, marginTop: -13, color: "#aaa" }}>Following by suman</p>
            </div>
            <img src={`${Moreoption}`} className="moreicons" alt="" />
          </div>
          <p style={{ textAlign: 'start', width: "96%", marginLeft: 20, marginTop: 0 }}>{detail.title}</p>
          <img src={`${detail.image}`} className="PostImages" alt="" />
          <div style={{ display: "flex" }}>
            <div style={{ display: "flex", marginLeft: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                {/* <img src={`${Like}`} className="iconsforPost" onClick={handleLike} alt="" /> */}
                <p style={{ marginLeft: "6px" }}>{detail.like.length} Likes</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", marginLeft: 20, cursor: "pointer" }}>
                <img src={`${CommentIcon}`} className="iconsforPost" onClick={handleshow} alt="" />
                <p style={{ marginLeft: "6px" }}>{detail.comments.length} Comments</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", marginLeft: 200, cursor: "pointer" }}>
              <img src={`${Shareicon}`} className="iconsforPost" alt="" />
              <p style={{ marginLeft: "6px" }}>Share</p>
            </div>
          </div>
          {show === true ?
          <div style={{padding:'10px'}}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={`${ProfileImage}`} className="PostImage" alt="" />
              {/* <p style={{marginLeft:"6px"}}>Suman</p> */}
              <input type="text" className='commentinput' placeholder='Write your thought' onChange={(e) => setcommentwriting(e.target.value)} />
              <button className='addCommentbtn' onClick={handleComment}>Post</button>
            </div>
            {Comments.map((item) => (
              <div style={{ alignItems: "center" }}>
                <div style={{display:"flex" , alignItems:"center"}}> 
                  <img src={`${ProfileImage}`} className="PostImage" alt="" />
                  <p style={{ marginLeft: "6px" , fontSize:18, marginTop:6 }}>{item.username}</p>
                </div>
                <p style={{ marginLeft: "55px" , textAlign:'start' , marginTop:-16 }}>{item.title}</p>
                <p style={{ marginLeft: "55px" , textAlign:'start' , marginTop:-10 , color:"#aaa" , fontSize:11}}>Reply</p>
                
              </div>

            ))}
          </div>:''
           }
        </div>
      </div>
    </div>
  )
}
