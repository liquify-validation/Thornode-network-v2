import React from "react";
import { CopyIcon } from "../assets";
import { copyToClipboard } from "../utilities/commonFunctions";
import Number from "./Number";
import InfoPopover from "./InfoPopover";
import useIsOverflowing from "../hooks/useIsOverflowing";

// This component is responsible for rendering a single row in the leaderboard
function LeaderboardRow({ address, index }) {
  const { ref, isOverflow } = useIsOverflowing(address);

  let AddressComponent;
  if (isOverflow) {
    // If the text is overflowing, we use InfoPopover + truncation
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
    // If not overflowing, show it normally
    AddressComponent = (
      <div ref={ref} className="max-w-[150px] overflow-hidden">
        {address}
      </div>
    );
  }

  return (
    <div
      key={address}
      className="
        flex items-center 
        inner-glass-effect 
        rounded-full 
        py-2 px-6 mx-8 mb-4
      "
    >
      <Number number={index + 1} />
      <div className="flex-grow text-base text-gray-50">{AddressComponent}</div>
      <button
        className="focus:outline-none ml-2 bg-transparent"
        onClick={() => copyToClipboard(address)}
        aria-label="Copy node address"
      >
        <img src={CopyIcon} alt="Copy" className="w-6 h-6" />
      </button>
    </div>
  );
}

export default LeaderboardRow;
