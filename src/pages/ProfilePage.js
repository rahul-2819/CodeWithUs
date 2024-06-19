import React from 'react'
import logo from "../assets/leetcode.svg"

function ProfilePage() {
  return (
   <div className = "flex col max-w-30  mx-auto">
       <div className='h-[90vh] w-[30%] bg-blue-50 m-2 rounded-lg p-2 flex item-center justify-center'>
       <div className=''>
       <img src={logo} alt="" className="h-8 " />
       <b>I Am A Red Coder</b>
       </div>
         
       </div>
       <div className='w-[70%]  m-2 flex flex-col h-auto'>
        <div className='bg-blue-50 m-2 br-lg h-[30vh] rounded-lg flex item-center justify-center'>
        Ratings
        </div>
        <div className='bg-blue-50 m-2 br-lg h-[30vh] rounded-lg flex item-center justify-center'>
        Activity
        </div>
        <div className='bg-blue-50 m-2 br-lg h-[30vh] rounded-lg flex item-center justify-center'>
          Solve Count
        </div>
         
       </div>
   </div>
  )
}

export default ProfilePage

