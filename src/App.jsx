import { useEffect, useState, useCallback, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./global/Header";
import Footer from "./global/Footer";
import Sidebar from "./global/Sidebar";
import MapBg from "./global/MapBg";
import ScrollToTop from "./global/ScrollToTop";
import LoadingSpinner from "./components/LoadingSpinner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setCookie } from "./utilities/commonFunctions";

const Home = lazy(() => import("./pages/Home"));
const Nodes = lazy(() => import("./pages/Nodes"));
const Network = lazy(() => import("./pages/Network"));
const Report = lazy(() => import("./pages/Report"));
const Contact = lazy(() => import("./pages/Contact"));
const Vaults = lazy(() => import("./pages/Vaults"));
const Pools = lazy(() => import("./pages/Pools"));
const Queue = lazy(() => import("./pages/Queue"));
const BPReport = lazy(() => import("./pages/BPReport"));

function App() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let storedTheme = "dark";
    try {
      storedTheme = localStorage.getItem("theme") || "dark";
    } catch {
      storedTheme = "dark";
    }
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

  // Listen for mobile menu toggle from bottom nav "More" button
  useEffect(() => {
    const handler = () => setMobileOpen((prev) => !prev);
    document.addEventListener("toggleMobileMenu", handler);
    return () => document.removeEventListener("toggleMobileMenu", handler);
  }, []);

  const handleToggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    try {
      localStorage.setItem("theme", newIsDark ? "dark" : "light");
    } catch {
      // Ignore storage write failures and keep the in-memory theme state.
    }

    if (newIsDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleToggleSidebar = () => {
    setIsExpanded((prev) => {
      const newVal = !prev;
      setCookie("sidebarExpanded", String(newVal));

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
          <span className="text-white font-semibold text-sm">
            THORChain Explorer
          </span>
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
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<Home isDark={isDark} />} />
                  <Route
                    path="/nodes"
                    element={
                      <Nodes isDark={isDark} isSidebarExpanded={isExpanded} />
                    }
                  />
                  <Route
                    path="/nodes/:tab"
                    element={
                      <Nodes isDark={isDark} isSidebarExpanded={isExpanded} />
                    }
                  />
                  <Route path="/network/*" element={<Network />} />
                  {/* <Route path="/leaderboards" element={<Leaderboards />} /> */}

                  <Route path="/vaults" element={<Vaults isDark={isDark} />} />
                  <Route path="/pools" element={<Pools isDark={isDark} />} />
                  <Route path="/queue" element={<Queue isDark={isDark} />} />
                  <Route
                    path="/bp-report"
                    element={<BPReport isDark={isDark} />}
                  />
                  <Route path="/contact" element={<Contact />} />
                  <Route
                    path="/nodes/report/:thornodeAddress"
                    element={<Report isDark={isDark} />}
                  />
                </Routes>
              </Suspense>
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
