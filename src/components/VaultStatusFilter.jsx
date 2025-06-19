import React from "react";

const VaultStatusFilter = ({ statusFilter, onChange }) => {
  return (
    <div className="flex">
      <button
        onClick={() => onChange("all")}
        className={`px-4 py-2 rounded-l-xl rounded-r-none ${
          statusFilter === "all"
            ? "bg-gray-800 dark:bg-[#28f3b0] text-gray-50 dark:text-gray-800"
            : "inner-glass-effect text-gray-800 dark:text-gray-50"
        }`}
      >
        All
      </button>
      <button
        onClick={() => onChange("active")}
        className={`px-4 py-2 ${
          statusFilter === "active"
            ? "bg-gray-800 dark:bg-[#28f3b0] text-gray-50 dark:text-gray-800"
            : "inner-glass-effect text-gray-800 dark:text-gray-50 rounded-none"
        }`}
      >
        Active
      </button>
      <button
        onClick={() => onChange("retired")}
        className={`px-4 py-2 rounded-r-xl rounded-l-none ${
          statusFilter === "retired"
            ? "bg-gray-800 dark:bg-[#28f3b0] text-gray-50 dark:text-gray-800"
            : "inner-glass-effect text-gray-800 dark:text-gray-50"
        }`}
      >
        Retired
      </button>
    </div>
  );
};

export default VaultStatusFilter;
