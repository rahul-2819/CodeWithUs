import React from "react";
import Wrapper from "./Wrapper";

const Footer = () => {
  return (
    <>
      <Wrapper>
        <hr className="border-gray-600" />
        <div className="bg-gray-800 py-2 --flex-center flex items-center justify-center text-gray-400">
          <p>All Rights Reserved. &copy; 2024</p>
        </div>
      </Wrapper>
    </>
  );
};

export default Footer;
