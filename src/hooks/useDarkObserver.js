import { useEffect, useState } from "react";

export function useDarkObserver() {
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    console.log("HTML Classes:", document.documentElement.classList);
  }, []);

  console.log("is dark?", isDark);

  useEffect(() => {
    const htmlEl = document.documentElement;

    const observer = new MutationObserver(() => {
      setIsDark(htmlEl.classList.contains("dark"));
    });

    observer.observe(htmlEl, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return isDark;
}
