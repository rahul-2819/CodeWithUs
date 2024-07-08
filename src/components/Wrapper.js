import React from "react";

const Wrapper = ({ children, className }) => {
  return (
    <div
      className={`w-full px-5 md:px-10 mx-auto ${className} bg-gray-900 text-white`}
    >
      {children}                 
    </div>
  );
};

export default Wrapper;
