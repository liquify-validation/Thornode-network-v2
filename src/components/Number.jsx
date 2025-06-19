import React from "react";

const Number = ({ number }) => {
  return (
    <div
      className="
        flex items-center justify-center
        w-8 h-8
        text-xl 
        sm:text-lg
        font-bold mr-5
        text-[#28f3b0] bg-slate-700 dark:bg-slate-600
        rounded-full
        overflow-hidden
      "
      style={{ minWidth: "2rem" }}
    >
      {number}
    </div>
  );
};

export default Number;
