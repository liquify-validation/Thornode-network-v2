import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowIcon } from "../assets";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <header className="bg-transparent py-4 mt-6">
      <div className="flex items-center justify-between px-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
            Welcome to Thornodes
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Here are the latest stats for you!
          </p>
        </div>

        <div className="relative inline-block text-left">
          <button
            onClick={toggleDropdown}
            className="inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
            aria-haspopup="true"
            aria-expanded={isOpen}
          >
            <span className="inline-block w-2 h-2 mr-2 bg-green-500 rounded-full animate-pulse"></span>
            Version 2.0
            <img
              src={ArrowIcon}
              alt="Toggle Dropdown"
              className={`ml-2 h-4 w-4 transform transition-transform duration-200 ${
                isOpen ? "rotate-20" : "rotate-90"
              }`}
            />
          </button>

          {isOpen && (
            <div
              className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
            >
              <div className="py-1">
                <Link
                  to="https://www.v2.thornode.network/"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  role="menuitem"
                >
                  Version 1.8
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <hr className="mt-4 border-t-1  border-gray-500 dark:border-gray-50" />
    </header>
  );
};

export default Header;
