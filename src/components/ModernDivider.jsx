import React from "react";

function ModernDivider({ mt = "mt-4", mb = "mb-12", ml = "ml-8" }) {
  return (
    <div className={`divider ${mt} ${mb} ${ml}`}>
      <div className="thick-line"></div>
      <div className="gap"></div>
      <div className="thin-line">
        <div className="straight-line left"></div>
        <div className="diagonal-line"></div>
        <div className="straight-line right"></div>
      </div>
    </div>
  );
}

export default ModernDivider;
