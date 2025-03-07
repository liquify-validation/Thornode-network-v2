// components/VotingStatusFilter.js
import React from "react";

function VotingStatusFilter({ currentTab, onTabChange }) {
  // We'll pass `currentTab` as one of: "all" | "in_progress" | "passed".
  // Then use `onTabChange("in_progress")` etc. to notify the parent.

  const tabClasses = (tabName) => {
    // Reuse classes from your existing filter style
    const active =
      currentTab === tabName
        ? "bg-gray-800 dark:bg-[#28f3b0] text-gray-50 dark:text-gray-800"
        : "inner-glass-effect drop-shadow-none text-gray-800 dark:text-gray-50";

    return `px-4 py-2 ${active}`;
  };

  return (
    <div className="flex">
      <button
        onClick={() => onTabChange("all")}
        className={`rounded-l-xl ${tabClasses("all")}`}
      >
        All
      </button>
      <button
        onClick={() => onTabChange("in_progress")}
        className={tabClasses("in_progress")}
      >
        In Progress
      </button>
      <button
        onClick={() => onTabChange("passed")}
        className={`rounded-r-xl ${tabClasses("passed")}`}
      >
        Passed
      </button>
    </div>
  );
}

export default VotingStatusFilter;
