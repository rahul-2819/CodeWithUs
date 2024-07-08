import React, { useEffect, useState } from "react";
import Wrapper from "./Wrapper";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/leetcode.svg";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase-config";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
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
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/profilePage");
  };

  return (
    <div className="bg-gray-100 shadow-md border-b border-gray-700">
      <Wrapper className="flex items-center justify-between py-4">
        <div>
          <img
            src={logo}
            alt="Logo"
            className="h-8 cursor-pointer"
            onClick={handleLogoClick}
          />
        </div>
        <div className="flex justify-center flex-grow space-x-6 text-gray-300 text-lg font-semibold">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/problems">Problems</NavLink>
          <NavLink to="/discuss">Discuss</NavLink>
          <NavLink to="/potd">Potd</NavLink>
        </div>
        <div>
          {user === null ? (
            <Link
              to="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Login
            </Link>
          ) : (
            <button
              className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
              onClick={handleProfileClick}
            >
              {user.email[0].toUpperCase()}
            </button>
          )}
        </div>
      </Wrapper>
    </div>
  );
};

const NavLink = ({ to, children }) => {
  return (
    <Link
      to={to}
      className="text-gray-300 transition duration-300 hover:text-blue-400 transform hover:scale-105"
    >
      <div className="ml-4">{children}</div>
    </Link>
  );
};

export default Header;
