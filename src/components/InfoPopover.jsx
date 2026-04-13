/* eslint-disable react/prop-types */
import { useState } from "react";
import { createPortal } from "react-dom";

function InfoPopover({
  title,
  text,
  children,
  as: Wrapper = "span",
  wrapperClassName = "",
  wrapperStyle,
}) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setCoords({ x: e.clientX + 10, y: e.clientY + 10 });
  };

  return (
    <>
      <Wrapper
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onMouseMove={handleMouseMove}
        className={wrapperClassName}
        style={{ cursor: "pointer", ...wrapperStyle }}
      >
        {children}
      </Wrapper>

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
