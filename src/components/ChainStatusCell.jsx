import React from "react";
import InfoPopover from "./InfoPopover";

const ChainStatusCell = ({ value, chain }) => {
  let color;
  let label;
  let glow = true;

  if (value === Infinity || value == null || !isFinite(value)) {
    color = "#475569";
    label = "N/A";
    glow = false;
  } else {
    const offset = Math.abs(value);
    if (offset < 10) {
      color = "#4ade80";
      label = offset === 0 ? "In sync" : `${value > 0 ? "+" : ""}${value} blocks`;
    } else if (offset < 200) {
      color = "#fb923c";
      label = `${value > 0 ? "+" : ""}${value} blocks`;
    } else {
      color = "#f87171";
      label = `${value > 0 ? "+" : ""}${value} blocks`;
    }
  }

  return (
    <div className="flex items-center justify-center">
      <InfoPopover title={`${chain || "Chain"} status`} text={label}>
        <span
          className="inline-block w-2 h-2 rounded-full ring-2 ring-[#17364c] dark:ring-[#17364c]"
          style={{
            backgroundColor: color,
            boxShadow: glow ? `0 0 6px ${color}` : "none",
            opacity: glow ? 1 : 0.5,
          }}
        />
      </InfoPopover>
    </div>
  );
};

export default ChainStatusCell;
