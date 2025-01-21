import React from "react";
import { useNavigate } from "react-router-dom";
import { DoubleArrowLeftIcon } from "../assets";

const BackButton = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <button
      onClick={handleBackClick}
      className="flex items-center space-x-2  bg-transparent
                 px-0 py-2 rounded  cursor-pointer "
    >
      <img src={DoubleArrowLeftIcon} alt="Back Icon" className="w-5 h-5" />
      <span>Back</span>
    </button>
  );
};

export default BackButton;
