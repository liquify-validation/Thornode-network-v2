import React from "react";

const LeaderboardFilter = ({ churnCount, onChange }) => {
  return (
    <div className="flex">
      <button
        onClick={() => onChange(1)}
        className={`px-4 py-2 rounded-l-xl rounded-r-none ${
          churnCount === 1
            ? "bg-[#28f3b0] text-gray-800"
            : "inner-glass-effect text-gray-50"
        }`}
      >
        Last Churn
      </button>

      <button
        onClick={() => onChange(5)}
        className={`px-4 py-2 ${
          churnCount === 5
            ? "bg-[#28f3b0] text-gray-800"
            : "inner-glass-effect text-gray-50 rounded-none"
        }`}
      >
        Last 5 Churns
      </button>

      <button
        onClick={() => onChange(10)}
        className={`px-4 py-2 rounded-r-xl rounded-l-none ${
          churnCount === 10
            ? "bg-[#28f3b0] text-gray-800"
            : "inner-glass-effect text-gray-50"
        }`}
      >
        Last 10 Churns
      </button>
    </div>
  );
};

export default LeaderboardFilter;
