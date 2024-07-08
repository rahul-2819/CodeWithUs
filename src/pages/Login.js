import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { auth } from '../firebase-config';

export default function Login() {
  const [error, setErr] = useState("");
  const navigate = useNavigate();
  const [details, setDetails] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    setErr("");
    e.preventDefault();
    signInWithEmailAndPassword(auth, details.email, details.password)
      .then((userCredentials) => {
        console.log(userCredentials.user);
        navigate("/");
      })
      .catch((err) => {
        setErr(err.message);
      });
  };

  const handleChange = (e) => {
    setDetails({
      ...details,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <form className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full " onSubmit={handleSubmit}>
        <h2 className="text-3xl font-semibold text-center mb-6 text-blue-500">Login</h2>
        <div className="mb-6">
          <input
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md outline-none focus:border-blue-500 placeholder-gray-400"
            type="text"
            name="email"
            placeholder="Username/Email"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-6">
          <input
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md outline-none focus:border-blue-500 placeholder-gray-400"
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-6">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white rounded-md py-3 hover:bg-blue-600 transition-colors duration-300 focus:outline-none"
          >
            Submit
          </button>
        </div>
        {error && (
          <div className="text-red-500 text-sm text-center mb-4 bg-red-100 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}
        <div className="text-center text-gray-400">
          <span>Don't have an account?</span>{" "}
          <button
            className="text-blue-500 font-semibold focus:outline-none"
            onClick={() => { navigate("/register") }}
          >
            Register
          </button>
        </div>
        <div className="mt-4 text-center text-sm text-gray-400">
          <span>Forgot your password?</span>{" "}
          <a href="#" className="text-blue-500 font-semibold">Reset here</a>
        </div>
      </form>
    </div>
  );
}
