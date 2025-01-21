import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

const Popover = ({ children, content, trigger, className }) => {
  const [visible, setVisible] = useState(false);
  const popoverRef = useRef(null);

  const handleClickOutside = (event) => {
    if (popoverRef.current && !popoverRef.current.contains(event.target)) {
      setVisible(false);
    }
  };

  useEffect(() => {
    if (trigger === "click") {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      if (trigger === "click") {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    };
  }, [trigger]);

  const handleTrigger = () => {
    if (trigger === "hover") {
      setVisible(true);
    } else if (trigger === "click") {
      setVisible(!visible);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === "hover") {
      setVisible(false);
    }
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={trigger === "hover" ? handleTrigger : undefined}
      onMouseLeave={trigger === "hover" ? handleMouseLeave : undefined}
      onClick={trigger === "click" ? handleTrigger : undefined}
    >
      {children}
      {visible && (
        <div
          ref={popoverRef}
          className={`absolute z-10 ${className} p-4 rounded-md`}
          style={{
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            marginTop: "8px",
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};

Popover.propTypes = {
  children: PropTypes.node.isRequired,
  content: PropTypes.node.isRequired,
  trigger: PropTypes.oneOf(["hover", "click"]),
  className: PropTypes.string,
};

Popover.defaultProps = {
  trigger: "hover",
  className: "",
};

export default Popover;
