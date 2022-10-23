import React from 'react'
import { useSelector } from 'react-redux'
import Leftbar from '../../Component/Leftsidecontainer/Leftbar'
import MainPost from "../../Component/MainPostContainer/MainPost"
import Navbar from '../../Component/Navbar/Navbar'
import Rightbar from '../../Component/RightsideContainer/Rightbar'
import "./home.css"
export default function Home() {
  const userDetails = useSelector((state)=>state.user);
  let user = userDetails.user
  console.log(user)
  return (
    <div className='home'>
          <Navbar/>
          <div className="ComponentContainer">
            <Leftbar/>
            <MainPost/>
            <Rightbar/>
          </div>
    </div>
  )
}
