import { useEffect, useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Nodes from "./pages/Nodes";
import Network from "./pages/Network";
import Analytics from "./pages/Analytics";
import Report from "./pages/Report";
import Contact from "./pages/Contact";
import Vaults from "./pages/Vaults";
import Mimir from "./pages/Mimir";
import Pools from "./pages/Pools";
import Queue from "./pages/Queue";
import BPReport from "./pages/BPReport";
import Header from "./global/Header";
import Footer from "./global/Footer";
import Sidebar from "./global/Sidebar";
import MapBg from "./global/MapBg";
import ScrollToTop from "./global/ScrollToTop";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Leaderboards from "./pages/Leaderboards";

function App() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const dark = !storedTheme || storedTheme === "dark";
    setIsDark(dark);

    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    const match = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("sidebarExpanded="));

    if (match) {
      const cookieValue = match.split("=")[1];
      setIsExpanded(cookieValue === "true");
    }
  }, []);

  // Expose sidebar width as CSS variable so portals (e.g. NodeDrawer) can use it
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-w",
      isExpanded ? "14.5rem" : "6.5rem"
    );
  }, [isExpanded]);

  // Listen for mobile menu toggle from bottom nav "More" button
  useEffect(() => {
    const handler = () => setMobileOpen((prev) => !prev);
    document.addEventListener("toggleMobileMenu", handler);
    return () => document.removeEventListener("toggleMobileMenu", handler);
  }, []);

  const handleToggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem("theme", newIsDark ? "dark" : "light");

    if (newIsDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleToggleSidebar = () => {
    setIsExpanded((prev) => {
      const newVal = !prev;
      document.cookie = `sidebarExpanded=${newVal}; path=/; max-age=31536000`;

      return newVal;
    });
  };

  const handleCloseMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <Router>
      <ScrollToTop />

      <div className="flex relative">
        <Sidebar
          isExpanded={isExpanded}
          onToggleSidebar={handleToggleSidebar}
          isDark={isDark}
          onToggleTheme={handleToggleTheme}
          mobileOpen={mobileOpen}
          onCloseMobile={handleCloseMobile}
        />

        {/* Mobile top bar with hamburger */}
        <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3 bg-slate-700 shadow-md lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="icon-button text-white text-2xl p-1"
            aria-label="Open menu"
          >
            &#9776;
          </button>
          <span className="text-white font-semibold text-sm">THORChain Explorer</span>
          <button
            onClick={handleToggleTheme}
            className="icon-button text-white text-xl p-1"
            aria-label="Toggle theme"
          >
            {isDark ? "☀" : "☾"}
          </button>
        </div>

        <div
          className={`w-full transition-all duration-300
            ml-0 pt-14 pb-16
            lg:pt-0 lg:pb-0
            ${isExpanded ? "lg:ml-60" : "lg:ml-32"}`}
        >
          <div className="flex flex-col min-h-screen relative">
            {isDark && <MapBg />}

            <Header />

            <main className="flex-grow p-4 relative">
              <Routes>
                <Route path="/" element={<Home isDark={isDark} />} />
                <Route path="/nodes" element={<Nodes isDark={isDark} />} />
                <Route path="/nodes/:tab" element={<Nodes />} />
                {/* <Route path="/network/*" element={<Network />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/leaderboards" element={<Leaderboards />} /> */}

                <Route path="/vaults" element={<Vaults isDark={isDark} />} />
                <Route path="/mimir" element={<Mimir isDark={isDark} />} />
                <Route path="/pools" element={<Pools isDark={isDark} />} />
                <Route path="/queue" element={<Queue isDark={isDark} />} />
                <Route path="/bp-report" element={<BPReport isDark={isDark} />} />
                <Route path="/contact" element={<Contact />} />
                <Route
                  path="/nodes/report/:thornodeAddress"
                  element={<Report isDark={isDark} />}
                />
              </Routes>
            </main>
          </div>
        </div>
      </div>

      <Footer />

      <ToastContainer position="top-center" />
    </Router>
  );
}

export default App;
