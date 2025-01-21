import { useEffect, useState } from "react";
import SunIcon from "../assets/sunicon.svg";
import MoonIcon from "../assets/moonicon.svg";

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const storedPreference = localStorage.getItem("theme");
    if (storedPreference) {
      const dark = storedPreference === "dark";
      setIsDark(dark);
      document.documentElement.classList.toggle("dark", dark);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setIsDark(prefersDark);
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  const toggleDarkMode = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem("theme", newIsDark ? "dark" : "light");

    if (newIsDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <button
      onClick={toggleDarkMode}
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
