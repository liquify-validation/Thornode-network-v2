import React from "react";
import { AnalyticsLeaderboardIcon, CopyIcon } from "../assets";
import { copyToClipboard } from "../utilities/commonFunctions";
import Number from "./Number";
import InfoPopover from "./InfoPopover";
import useIsOverflowing from "../hooks/useIsOverflowing";

function LeaderboardRow({ address, index, onAnalyticsClick }) {
  const { ref, isOverflow } = useIsOverflowing(address);

  let AddressComponent;
  if (isOverflow) {
    AddressComponent = (
      <InfoPopover title="Node Address" text={address}>
        <div
          ref={ref}
          className="
            max-w-[150px] 
            overflow-hidden 
            whitespace-nowrap 
            text-ellipsis 
            direction-rtl 
            text-left
          "
          style={{ direction: "rtl", textAlign: "left" }}
        >
          {address}
        </div>
      </InfoPopover>
    );
  } else {
    AddressComponent = (
      <div ref={ref} className="max-w-[150px] overflow-hidden">
        {address}
      </div>
    );
  }

  return (
    <div
      className="
        flex items-center
        shadow-lg
       bg-gray-100  
        dark:bg-slate-700
        rounded-full 
        py-2 px-6 mx-8 mb-4
      "
    >
      <Number number={index + 1} />
      <div className="flex-grow text-base text-gray-700 dark:text-gray-50">
        {AddressComponent}
      </div>

      <button
        className="focus:outline-none ml-2 bg-transparent"
        onClick={onAnalyticsClick}
        aria-label="Open chart for node performance"
      >
        <img
          src={AnalyticsLeaderboardIcon}
          alt="Analytics"
          className="w-6 h-6 invert dark:invert-0"
        />
      </button>

      <button
        className="focus:outline-none bg-transparent"
        onClick={() => copyToClipboard(address)}
        aria-label="Copy node address"
      >
        <img
          src={CopyIcon}
          alt="Copy"
          className="w-6 h-6 invert dark:invert-0"
        />
      </button>
    </div>
  );
}

export default LeaderboardRow;
