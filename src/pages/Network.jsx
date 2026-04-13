import React, { Suspense, lazy } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import NetworkTabs from "../components/NetworkTabs.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

const Churns = lazy(() => import("./Churns"));
const Config = lazy(() => import("./Config"));
const Vaults = lazy(() => import("./Vaults"));
const Runepool = lazy(() => import("./Runepool"));
const Swaps = lazy(() => import("./Swaps"));
const Voting = lazy(() => import("./Voting"));
const VaultDetail = lazy(() => import("./VaultDetail"));
const NetworkOverview = lazy(() => import("./NetworkOverview"));

const Network = () => {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (location.pathname === "/network") {
      navigate("/network/overview", { replace: true });
    }
  }, [location, navigate]);

  return (
    <div>
      <NetworkTabs />
      <Suspense
        fallback={
          <div className="p-2 mt-12 h-[55vh]">
            <LoadingSpinner />
          </div>
        }
      >
        <Routes>
          <Route path="overview" element={<NetworkOverview />} />
          <Route path="config" element={<Config />} />
          <Route path="churns" element={<Churns />} />
          <Route path="vaults" element={<Vaults />} />
          <Route path="vaults/:vaultId" element={<VaultDetail />} />
          <Route path="runepool" element={<Runepool />} />
          <Route path="swaps" element={<Swaps />} />
          <Route path="voting" element={<Voting />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default Network;
