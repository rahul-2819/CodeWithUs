import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import {useNavigate} from "react-router-dom"
import { auth } from '../firebase-config';
export default function Login() {
    const [error,setErr] = useState("");
    const navigate = useNavigate();
    const details = {
        email:"",
        password:""
    }
    const handleSubmit = async(e)=>{
      setErr("");
        e.preventDefault();
     signInWithEmailAndPassword(auth,details.email,details.password)
     .then((userCredentials)=>{
        console.log(userCredentials.user);
        navigate("/");
     })
     .catch((err)=>{
        setErr(err.message);
     })
    }
    const handleChange = (e)=>{
        details[e.target.name] = e.target.value;
    }
  return (
    <>
    <div className='grid place-items-center '>
      <form className='bg-gray-300 justify-center item-center mt-[10%] p-[2%] rounded-lg' onSubmit={handleSubmit}>
        <div className='p-3 m-2 '>
            <input className = "p-2 rounded-lg" type="text" name="email" placeholder='Username/Email' onChange={handleChange} required/>
        </div>
        <div className='p-3 m-2 '>
            <input className = "p-2 rounded-lg" type="password" name = "password" placeholder='Password' onChange={handleChange} required/>
        </div>
        <div className='p-3 m-2 flex items-center justify-center '>
        <button type="submit" className='bg-blue-400 rounded-lg p-2'>Submit</button>
        </div>
        {error !== ""?<div className='text-red-300'>{error}</div>:<div></div>}
        <div>Don't have Account 
        <button onClick={()=>{navigate("/register")}}>
            Register</button>
        </div>
      </form>
    </div>
    </>
  )
}
