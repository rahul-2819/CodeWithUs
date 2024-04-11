import React from "react";
import Wrapper from "./Wrapper";

const Footer = () => {
  return (
    <>
      <Wrapper>
        <hr className="--color-dark" />
        <div className="--flex-center --py2 --bg-grey py-5 flex items-center justify-center">
          <p>All Rights Reserved. &copy; 2024</p>
        </div>
        
      </Wrapper>
    </>
  );
};

export default Footer;