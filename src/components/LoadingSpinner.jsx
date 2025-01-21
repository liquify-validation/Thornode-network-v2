import React from "react";
import { ThorIcon } from "../assets";

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="relative">
        <svg
          className="animate-spin"
          width="100"
          height="100"
          viewBox="0 0 48 48"
          fill="none"
        >
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="#28F3B0"
            strokeWidth="4"
            fill="none"
            strokeDasharray="2 2"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <img src={ThorIcon} className="w-12 h-12 " />
        </div>
      </div>
    </div>
  );
}

export default LoadingSpinner;
