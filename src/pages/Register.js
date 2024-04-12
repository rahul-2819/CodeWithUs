import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase-config";
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function Register() {
  const [error, setErr] = useState("");
  const details = {
    email: "",
    password: ""
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    createUserWithEmailAndPassword(auth, details.email, details.password)
      .then((userCredentials) => {
        console.log(userCredentials.user);
        navigate("/login");
      })
      .catch((err) => {
        setErr(err.message);
      });
  };

  const handleChange = (e) => {
    details[e.target.name] = e.target.value;
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-100 to-blue-200'>
      <form className='bg-white p-8 rounded-lg shadow-lg max-w-md w-full transform transition-transform duration-500 hover:scale-105' onSubmit={handleSubmit}>
        <h2 className='text-3xl font-semibold text-center mb-6 text-blue-500'>Register</h2>
        <div className='mb-6'>
          <input className='w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-blue-500 placeholder-gray-500' type="text" name="email" placeholder='Email' onChange={handleChange} required />
        </div>
        <div className='mb-6'>
          <input className='w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:border-blue-500 placeholder-gray-500' type="password" name="password" placeholder='Password' onChange={handleChange} required />
        </div>
        {error &&
          <div className='text-red-500 text-sm text-center mb-4 bg-red-100 px-4 py-2 rounded-lg'>
            {error}
          </div>
        }
        <div className='mb-6 flex justify-center'>
          <button type="submit" className='w-full bg-blue-500 text-white rounded-md py-3 hover:bg-blue-600 transition-colors duration-300'>Submit</button>
        </div>
      </form>
    </div>
  );
}
