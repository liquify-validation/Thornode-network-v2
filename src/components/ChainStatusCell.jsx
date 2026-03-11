import React from "react";

// ChainStatusCell (optional approach)
const ChainStatusCell = ({ value }) => {
  if (value === Infinity) return <span className="text-red-400 font-semibold">N/A</span>;
  if (value === 0) return <span className="text-green-400">OK</span>;
  const isDelayed = value < -5;
  return <span className={isDelayed ? "text-orange-400 font-semibold" : ""}>{value}</span>;
};

export default ChainStatusCell;
