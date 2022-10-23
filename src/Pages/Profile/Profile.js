import React from 'react'
import { useSelector } from 'react-redux'
import Navbar from '../../Component/Navbar/Navbar'
import ProfileLeftbar from '../../Component/ProfileLeftsidecontainer/ProfileLeftbar'
import ProfileMainPost from '../../Component/ProfileMainPostContainer/ProfileMainPost'
import ProfileRightbar from '../../Component/ProfileRightsideContainer/ProfileRightbar'
import "./profile.css"
export default function Profile() {
  const userDetails = useSelector((state)=>state.user);
  let user = userDetails.user
  console.log(user)
  return (
    <div className='ProfileContainer'>
          <Navbar/>
          <div className='subProfileContainer'>
                    <ProfileLeftbar/>
                    <ProfileMainPost/>
                    <ProfileRightbar/>
          </div>
    </div>
  )
}
