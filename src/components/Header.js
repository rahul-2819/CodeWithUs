import React, { useEffect, useState } from "react";
import Wrapper from "./Wrapper";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/leetcode.svg"
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import { CgProfile } from "react-icons/cg";
const Header = () => {
  const navigate = useNavigate();
  const [user,setUser] = useState(null);
  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged((user)=>{
      console.log(user);
      if(user){
        setUser(user);
      }
      else{
        setUser(null);
      }
    });
    return unsubscribe;
  },[]);

  const handleOut = async()=>{
    // setShowConfirmation(false);
   try {
    await signOut(auth);
    setUser(null);
   } catch (error) {
    alert(error.message);
   }
  }
  return (
    <div className="w-full h-[50px] md:h-[70px] bg-white flex items-center justify-between z-20 top-0 transition-transform duration-300">
     
        <div className=" fixed flex col w-full bg-gray-200 mt-0 p-[25px]">
        <div className=" ml-5 w-1/2">
          <img src={logo} alt="nahi h" className="h-[30px] md:h-[30px]"/>
        </div>
        <div className="flex col gap-6">
        <button className = "" onClick={()=>navigate("/")}>
       Home
       </button>
       <button onClick={()=>navigate("/")}>
       Problems
       </button>
       <button>
       Discuss
       </button>
       <button onClick={()=>{navigate("/Potd")}}>
       Potd
       </button>
       {user === null?<button className="fixed right-0 bg-blue-400 p-2 mr-2 rounded-md" onClick={()=>navigate("/login")}>
        Login/Register
      </button>:<button className="fixed right-0 bg-blue-400 p-2 mr-2 rounded-2xl" onClick={()=>{handleOut()}}>Logout</button>}
       
       </div>
       </div>
     
      
             
      
    </div>
    
  );
};

export default Header;