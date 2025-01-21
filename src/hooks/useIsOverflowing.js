import React, { useRef, useState, useEffect } from "react";

function useIsOverflowing(text) {
  const ref = useRef(null);
  const [isOverflow, setIsOverflow] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(() => checkOverflow());
    ro.observe(ref.current);
    checkOverflow();

    return () => {
      ro.disconnect();
    };
  }, [text]);

  function checkOverflow() {
    if (!ref.current) return;
    setIsOverflow(ref.current.scrollWidth > ref.current.clientWidth);
  }

  return { ref, isOverflow };
}

export default useIsOverflowing;
