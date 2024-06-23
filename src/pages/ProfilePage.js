// import React, { useEffect, useState } from 'react'
// import logo from "../assets/leetcode.svg"
// import { auth } from '../firebase-config'
// import { SignInMethod,signOut } from 'firebase/auth';
// import { useNavigate } from 'react-router-dom';

// function ProfilePage() {
//   const [user,setUser] = useState(auth.currentUser);
//   const [isLoading,setLoading] = useState(1);
//   const navigate = useNavigate();
//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       setUser(null);
//       navigate("/");
//     } catch (error) {
//       alert(error.message);
//     }
//   };
//   return (
    
   
//       <div className = "flex col max-w-30  mx-auto">
//        <div className='h-[90vh] w-[30%] bg-blue-50 m-2 rounded-lg p-2 flex flex-col items-center justify-center '>
//         <b className='p-2'>
//           UserName : {!user?"--": "Naresh_xyz"}
//         </b>
//         <b className='p-2'>
//           Email : {!user?"Email Not Found":user.email}
//         </b>
//         <b className='p-2'>
//           Skills : No Skills
//         </b>
//         <b className='p-2'>
//           Experience : No Exprience
//         </b>
//           <button className='rounded-lg bg-red-400 p-2' onClick={handleLogout}>
//              Logout
//           </button>
       
          
//         </div>
//        <div className='w-[70%]  m-2 flex flex-col h-auto'>
//         <div className='bg-blue-50 m-2 br-lg h-[30vh] rounded-lg flex items-center justify-center'>
//         Ratings
//         </div>
//         <div className='bg-blue-50 m-2 br-lg h-[30vh] rounded-lg flex items-center justify-center'>
//         Activity
//         </div>
//         <div className='bg-blue-50 m-2 br-lg h-[30vh] rounded-lg flex items-center justify-center'>
//           Solve Count
//         </div>
//       </div>
//    </div>
      
//   )
// }

// export default ProfilePage

import React, { useEffect, useState } from 'react';
import { auth } from '../firebase-config';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const [user, setUser] = useState(auth.currentUser);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate('/');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 min-h-screen py-10 text-white">
      <div className="w-full max-w-6xl bg-gray-800 shadow-md rounded-lg overflow-hidden flex">
        {/* Left Column */}
        <div className="w-full max-w-xs bg-gray-700 p-6 flex flex-col items-center">
          <img
            src="https://assets.leetcode.com/static_assets/public/webpack_bundles/images/logo-dark.e99485d9b.svg"
            alt="Profile"
            className="w-32 h-32 rounded-full mb-4"
          />
          <h2 className="text-2xl font-semibold">
            {user ? "Naresh_xyz" : "--"}
          </h2>
          <p className="text-gray-400">{user ? user.email : "Email Not Found"}</p>
          <button
            className="mt-2 bg-green-500 text-white py-1 px-3 rounded-lg"
            onClick={() => alert('Edit Profile')}
          >
            Edit Profile
          </button>
          <div className="mt-4 w-full">
            <div className="text-lg font-semibold mb-2">Personal Details</div>
            <p>Location: India</p>
            <p>Username: naresh-xyz</p>
            <p>LinkedIn: linkedin.com/in/naresh-xyz</p>
            <p>Skills: C++</p>
          </div>
          <div className="mt-4 w-full">
            <div className="text-lg font-semibold mb-2">Experience</div>
            <p>No Experience</p>
          </div>
          <div className="mt-4 w-full">
            <div className="text-lg font-semibold mb-2">Community Stats</div>
            <p>Views: 0</p>
            <p>Solution: 0</p>
            <p>Discuss: 0</p>
            <p>Reputation: 0</p>
          </div>
          <button
            className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg w-full"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
        {/* Right Column */}
        <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <div className="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-2">Contest Rating</h3>
            <p>Not Available</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-2">Global Ranking</h3>
            <p>Not Available</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-2">Solve Count</h3>
            <p>Not Available</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-2">Badges</h3>
            <p>Not Available</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col items-center md:col-span-2">
            <h3 className="text-xl font-semibold mb-2">Submissions</h3>
            <p>Not Available</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
