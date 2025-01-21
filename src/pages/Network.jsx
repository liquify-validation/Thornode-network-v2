import React from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import NetworkTabs from "../components/NetworkTabs.jsx";
import Stats from "./Stats";
import Config from "./Config";
import Churns from "./Churns";
import Vaults from "./Vaults";
import Runepool from "./Runepool";
import Voting from "./Voting";

const Network = () => {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (location.pathname === "/network") {
      navigate("/network/stats");
    }
  }, [location, navigate]);

  return (
    <div>
      <NetworkTabs />
      <Routes>
        <Route path="stats" element={<Stats />} />
        <Route path="config" element={<Config />} />
        <Route path="churns" element={<Churns />} />
        <Route path="vaults" element={<Vaults />} />
        <Route path="runepool" element={<Runepool />} />
        <Route path="voting" element={<Voting />} />
      </Routes>
    </div>
  );
};

export default Network;
