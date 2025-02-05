import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  NodesIcon,
  NetworkIcon,
  AnalyticsIcon,
  MailIcon,
  ArrowIcon,
  ThorIcon,
  LiquifyIcon,
} from "../assets";
import DarkModeToggle from "../components/DarkModeToggle";

const Sidebar = ({ isExpanded, setIsExpanded, isDark, onToggleTheme }) => {
  const location = useLocation();

  const menuItems = [
    { name: "Thornodes", icon: ThorIcon, path: "/" },
    { name: "Home", icon: HomeIcon, path: "/" },
    { name: "Nodes", icon: NodesIcon, path: "/nodes" },
    // { name: "Network", icon: NetworkIcon, path: "/network" },
    // { name: "Analytics", icon: AnalyticsIcon, path: "/analytics" },
  ];

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <nav
      className={`fixed top-[45%] left-6 transform -translate-y-1/2 z-20 flex flex-col justify-between
          rounded-[15px] bg-slate-700 text-white p-2.5 shadow-2xl
        ${isExpanded ? "w-48" : "w-16"} transition-all duration-300 h-[85%]`}
    >
      <div className="flex flex-col gap-4">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-2 p-2 rounded-md hover:bg-slate-600
              ${location.pathname === item.path ? "" : ""}`}
          >
            <img
              src={item.icon}
              alt={`${item.name} icon`}
              className="w-6 h-6 transition-transform duration-300 transform hover:scale-110"
            />
            {isExpanded && (
              <span className="text-sm font-semibold ml-2 text-gray-50">
                {item.name}
              </span>
            )}
          </Link>
        ))}
      </div>

      <div className="flex flex-col gap-4 mt-60">
        <Link
          to="mailto:contact@liquify.io"
          className={`flex items-center gap-2 p-2 rounded-md hover:bg-slate-600
            ${
              location.pathname === "mailto:contact@liquify.io"
                ? "bg-slate-600"
                : ""
            }`}
        >
          <img
            src={MailIcon}
            alt="Contact icon"
            className="w-6 h-6 transition-transform duration-300 transform hover:scale-110"
          />
          {isExpanded && (
            <span className="text-sm font-medium text-gray-50 ml-2">
              Contact
            </span>
          )}
        </Link>

        <div className="flex items-center gap-2">
          <DarkModeToggle isDark={isDark} onToggleTheme={onToggleTheme} />
          {isExpanded && <span className="text-sm font-medium"></span>}
        </div>

        <button
          onClick={toggleSidebar}
          className="flex items-center  gap-2 p-2 bg-transparent rounded-md hover:bg-slate-600 icon-button"
        >
          <img
            src={ArrowIcon}
            alt="Toggle sidebar"
            className={`w-6 h-6 transform ${
              isExpanded ? "rotate-180" : ""
            } transition-transform duration-300`}
          />
          {isExpanded && (
            <span className="text-sm font-medium">
              {isExpanded ? "Collapse" : "Expand"}
            </span>
          )}
        </button>
        <hr className="border-gray-50"></hr>

        <Link
          to="https://www.liquify.io"
          className={`flex items-center gap-2 p-2 rounded-md hover:bg-slate-600
            ${
              location.pathname === "https://www.liquify.io"
                ? "bg-slate-600"
                : ""
            }`}
        >
          <img
            src={LiquifyIcon}
            alt="Contact icon"
            className="w-6 h-6 transition-transform duration-300 transform hover:scale-110"
          />
          {isExpanded && (
            <span className="text-sm font-medium text-gray-50 ml-1">
              Built by Liquify
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
};

export default Sidebar;
