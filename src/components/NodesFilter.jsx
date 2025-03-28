import React from "react";
import { Link } from "react-router-dom";

const NodesFilter = ({ currentTab }) => {
  return (
    <div className="flex">
      <Link
        to={`/nodes/active`}
        className={`px-4 py-2 rounded-l-xl ${
          currentTab === "active"
            ? "bg-gray-800 dark:bg-[#28f3b0] text-gray-50 dark:text-gray-800"
            : "inner-glass-effect drop-shadow-none text-gray-800 dark:text-gray-50"
        }`}
      >
        Active
      </Link>
      <Link
        to={`/nodes/standby`}
        className={`px-4 py-2 ${
          currentTab === "standby"
            ? "bg-gray-800 dark:bg-[#28f3b0] text-gray-50 dark:text-gray-800"
            : "inner-glass-effect drop-shadow-none text-gray-800 dark:text-gray-50"
        }`}
      >
        Standby
      </Link>
      <Link
        to={`/nodes/other`}
        className={`px-4 py-2 rounded-r-xl ${
          currentTab === "other"
            ? "bg-gray-800 dark:bg-[#28f3b0] text-gray-50 dark:text-gray-800"
            : "inner-glass-effect drop-shadow-none text-gray-800 dark:text-gray-50"
        }`}
      >
        Other
      </Link>
    </div>
  );
};

export default NodesFilter;
