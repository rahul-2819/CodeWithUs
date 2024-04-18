import React, { useEffect, useState } from "react";
import Wrapper from "./Wrapper";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/leetcode.svg";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase-config";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-100 to-blue-200 shadow-lg">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <div>
          <img src={logo} alt="Logo" className="h-8" />
        </div>
        <div className="flex justify-center flex-grow space-x-4 text-gray-300 text-lg font-semibold">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/problems">Problems</NavLink>
          <NavLink to="/discuss">Discuss</NavLink>
          <NavLink to="/potd">Potd</NavLink>
        </div>
        <div>
          {user === null ? (
            <Link to="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300">
              Login
            </Link>
          ) : (
            <button
              className="btn-logout px-4 py-2 rounded bg-red-500 text-white transition duration-300"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const NavLink = ({ to, children }) => {
  return (
    <Link
      to={to}
      className="text-gray-800  transition duration-300 hover:text-green-600 transform hover:scale-125"
    >
      <div className="ml-4">{children}</div>
    </Link>
  );
};

export default Header;
