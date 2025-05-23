import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Nodes from "./pages/Nodes";
import Network from "./pages/Network";
import Analytics from "./pages/Analytics";
import Report from "./pages/Report";
import Contact from "./pages/Contact";
import Header from "./global/Header";
import Footer from "./global/Footer";
import Sidebar from "./global/Sidebar";
import MapBg from "./global/MapBg";
import ScrollToTop from "./global/ScrollToTop";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Config from "./pages/Config";
import Churns from "./pages/Churns";
import Vaults from "./pages/Vaults";
import Runepool from "./pages/Runepool";
import Stats from "./pages/Stats";
import Voting from "./pages/Voting";

function App() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const dark = !storedTheme || storedTheme === "dark";
    setIsDark(dark);

    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
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

  return (
    <Router>
      <ScrollToTop />

      <div className="flex relative">
        <Sidebar
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          isDark={isDark}
          onToggleTheme={handleToggleTheme}
        />
        <div
          className={`w-full transition-all duration-300 ${
            isExpanded ? "ml-60" : "ml-32"
          }`}
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
                <Route path="/analytics" element={<Analytics />} /> */}

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

      <ToastContainer />
    </Router>
  );
}

export default App;
