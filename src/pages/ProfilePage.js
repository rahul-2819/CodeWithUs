import React, { useEffect, useState } from 'react'
import logo from "../assets/leetcode.svg"
import { auth } from '../firebase-config'
import { SignInMethod,signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const [user,setUser] = useState(auth.currentUser);
  const [isLoading,setLoading] = useState(1);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    
   
      <div className = "flex col max-w-30  mx-auto">
       <div className='h-[90vh] w-[30%] bg-blue-50 m-2 rounded-lg p-2 flex flex-col items-center justify-center '>
        <b className='p-2'>
          UserName : {!user?"--": "Naresh_xyz"}
        </b>
        <b className='p-2'>
          Email : {!user?"Email Not Found":user.email}
        </b>
        <b className='p-2'>
          Skills : No Skills
        </b>
        <b className='p-2'>
          Experience : No Exprience
        </b>
          <button className='rounded-lg bg-red-400 p-2' onClick={handleLogout}>
             Logout
          </button>
       
          
        </div>
       <div className='w-[70%]  m-2 flex flex-col h-auto'>
        <div className='bg-blue-50 m-2 br-lg h-[30vh] rounded-lg flex items-center justify-center'>
        Ratings
        </div>
        <div className='bg-blue-50 m-2 br-lg h-[30vh] rounded-lg flex items-center justify-center'>
        Activity
        </div>
        <div className='bg-blue-50 m-2 br-lg h-[30vh] rounded-lg flex items-center justify-center'>
          Solve Count
        </div>
      </div>
   </div>
      
  )
}

export default ProfilePage

