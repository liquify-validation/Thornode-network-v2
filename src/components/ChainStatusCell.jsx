import React from "react";

// ChainStatusCell (optional approach)
const ChainStatusCell = ({ value }) => {
  if (value === Infinity) return <span>N/A</span>;
  if (value === 0) return <span>OK</span>;
  const isDelayed = value < -5;
  return <span style={{ color: isDelayed ? "red" : "inherit" }}>{value}</span>;
};

export default ChainStatusCell;
