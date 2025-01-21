import React from "react";

const Box = ({ children, className }) => {
  return <div className={`glass-effect ${className}`}>{children}</div>;
};

export default Box;
