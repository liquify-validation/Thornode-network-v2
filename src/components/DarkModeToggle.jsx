import React from "react";
import SunIcon from "../assets/sunicon.svg";
import MoonIcon from "../assets/moonicon.svg";

const DarkModeToggle = ({ isDark }) => {
  return (
    <img
      src={isDark ? SunIcon : MoonIcon}
      alt="Toggle Theme"
      className="w-6 h-6 transition-transform duration-300 transform hover:scale-110"
    />
  );
};

export default DarkModeToggle;
