import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  autoPlacement,
} from "@floating-ui/react";

function InfoPopover({ title, text, children }) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setCoords({ x: e.clientX + 10, y: e.clientY + 10 });
  };

  return (
    <>
      <span
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onMouseMove={handleMouseMove}
        style={{ cursor: "pointer" }}
      >
        {children}
      </span>

      {visible &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: coords.y,
              left: coords.x,
            }}
            className="z-[9999] px-4 py-3 bg-gray-800 text-white text-sm rounded-xl shadow-lg text-center"
          >
            <div className="font-semibold">{title}</div>
            {text && <hr className="my-1 border-gray-600" />}
            <div>{text}</div>
          </div>,
          document.getElementById("popover-root")
        )}
    </>
  );
}

export default InfoPopover;
