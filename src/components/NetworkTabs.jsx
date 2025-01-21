import React from "react";
import { NavLink } from "react-router-dom";

const tabs = [
  { name: "STATS", path: "/network/stats" },
  { name: "CONFIG", path: "/network/config" },
  { name: "CHURNS", path: "/network/churns" },
  { name: "VAULTS", path: "/network/vaults" },
  { name: "RUNEPOOL", path: "/network/runepool" },
  { name: "VOTING", path: "/network/voting" },
];

const NetworkTabs = () => {
  return (
    <div className="flex items-center justify-between mt-4">
      <h1 className="text-2xl ml-2 font-bold">Network Statistics</h1>

      <div className="flex space-x-4">
        {tabs.map((tab) => (
          <NavLink
            key={tab.name}
            to={tab.path}
            className={({ isActive }) =>
              `px-8 py-2 border-4 border-gray-400 rounded-full font-bold ${
                isActive
                  ? "bg-[#28f3b0] text-gray-800"
                  : "inner-glass-effect text-gray-50"
              }`
            }
          >
            {tab.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default NetworkTabs;
