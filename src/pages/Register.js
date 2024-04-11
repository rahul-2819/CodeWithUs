import React,{useState} from 'react'
import {useNavigate} from "react-router-dom"
import {auth,app} from "../firebase-config"
import { createUserWithEmailAndPassword } from 'firebase/auth';
export default function Register() {
  const [error,setErr] = useState("");
  const details = {
    email:"",
    password:""
}
    const navigate = useNavigate();
    const handleSubmit = async(e)=>{
      e.preventDefault();
      alert("1")
      console.log(details.email)
      createUserWithEmailAndPassword(auth,details.email,details.password)
      .then((userCredentials)=>{
        console.log(userCredentials.user);
        navigate("/login");
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
      <form  className ='bg-gray-300 justify-center item-center mt-[10%] p-[2%] rounded-lg' onSubmit={handleSubmit}>
        <div className='p-3 m-2 ' >
            <input className = "p-2 rounded-lg" name = "email" type="text" required  onChange={handleChange} placeholder='Username/Email'/>
        </div>
        <div className='p-3 m-2' >
            <input className = "p-2 rounded-lg" name = "password" type="password" required onChange={handleChange} placeholder='Password'/>
        </div>
        <div className='p-3 m-2 flex items-center justify-center '>
        <button type="submit" className='bg-blue-400 rounded-lg p-2'>Submit</button>
        </div>
        {error !== ""?<div className='text-red-300'>{error}</div>:<div></div>}
      </form>
    </div>
    </>
  )
}
