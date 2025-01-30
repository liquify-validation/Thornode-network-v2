import React from "react";
import SunIcon from "../assets/sunicon.svg";
import MoonIcon from "../assets/moonicon.svg";

const DarkModeToggle = ({ isDark, onToggleTheme }) => {
  return (
    <button
      onClick={onToggleTheme}
      className="p-2 bg-transparent icon-button"
      aria-label="Toggle Dark Mode"
    >
      {isDark ? (
        <img src={SunIcon} className="w-6 h-6" alt="Light Mode Icon" />
      ) : (
        <img src={MoonIcon} className="w-6 h-6" alt="Dark Mode Icon" />
      )}
    </button>
  );
};

export default DarkModeToggle;
