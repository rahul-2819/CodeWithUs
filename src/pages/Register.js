import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { app, auth } from "../firebase-config";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';

export default function Register() {
  const [error, setErr] = useState("");
  const [details, setDetails] = useState({
    email: "",
    password: "",
    name: "",
    username: "",
    mobile: ""
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    createUserWithEmailAndPassword(auth, details.email, details.password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        const db = getDatabase(app);
        set(ref(db, 'users/' + user.uid), {
          email: details.email,
          name: details.name,
          username: details.username,
          mobile: details.mobile
        });
        console.log(userCredentials.user);
        navigate("/login");
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
        <h2 className="text-3xl font-semibold text-center mb-6 text-blue-500">Register</h2>
        <div className="mb-6">
          <input
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md outline-none focus:border-blue-500 placeholder-gray-400"
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-6">
          <input
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md outline-none focus:border-blue-500 placeholder-gray-400"
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-6">
          <input
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md outline-none focus:border-blue-500 placeholder-gray-400"
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-6">
          <input
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md outline-none focus:border-blue-500 placeholder-gray-400"
            type="text"
            name="email"
            placeholder="Email"
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
        {error && (
          <div className="text-red-500 text-sm text-center mb-4 bg-red-100 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}
        <div className="mb-6 flex justify-center">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white rounded-md py-3 hover:bg-blue-600 transition-colors duration-300"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
