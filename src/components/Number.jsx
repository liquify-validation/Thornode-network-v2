import React from "react";

const Number = ({ number }) => {
  return (
    <div
      className="
        flex items-center justify-center
        w-10 h-10
        text-xl 
        sm:text-lg
        font-bold mr-5
        text-[#28f3b0] bg-slate-700
        rounded-full
        overflow-hidden
      "
      style={{ minWidth: "2.5rem" }} // ensures a minimum width for multiple digits
    >
      {number}
    </div>
  );
};

export default Number;
