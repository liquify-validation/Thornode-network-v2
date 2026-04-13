/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import useNodeChartQueries from "../hooks/useNodeChartQueries";
import NodeBondProvidersList from "./NodeBondProvidersList";
import NodeDrawerActions from "./NodeDrawerActions";
import NodeDrawerCharts from "./NodeDrawerCharts";
import NodeDrawerHeader from "./NodeDrawerHeader";
import NodeStatsGrid from "./NodeStatsGrid";

const EMPTY_NODE = {
  node_address: "",
  bond: 0,
  current_award: 0,
  bond_providers: { providers: [] },
};

const NodeDrawer = ({
  node,
  onClose,
  isDark,
  isSidebarExpanded = true,
  runePrice = 0,
}) => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const safeNode = node || EMPTY_NODE;
  const address = safeNode.node_address;
  const chartQueries = useNodeChartQueries(address);

  useEffect(() => {
    if (node) {
      requestAnimationFrame(() => setVisible(true));
    }
  }, [node]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  if (!node) {
    return null;
  }

  const providers = node.bond_providers?.providers || [];
  const desktopOffsetClass = isSidebarExpanded ? "lg:left-60" : "lg:left-32";
  const portalRoot = document.getElementById("popover-root");

  if (!portalRoot) {
    return null;
  }

  const drawer = (
    <>
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${visible ? "bg-black/50" : "bg-black/0"}`}
        onClick={handleClose}
      />
      <div
        className={`node-drawer-scroll fixed top-0 left-0 z-50 h-full w-full transform overflow-y-auto scrollbar-custom bg-gray-100 shadow-2xl transition-transform duration-300 dark:bg-[#132a3c] sm:w-[620px] xl:w-[700px] ${desktopOffsetClass} ${visible ? "translate-x-0" : "-translate-x-full"}`}
      >
        <NodeDrawerHeader address={address} onClose={handleClose} />

        <div className="space-y-5 p-5">
          <NodeDrawerActions
            address={address}
            ipAddress={node.ip_address}
            onOpenNodeReport={() => {
              handleClose();
              navigate(`/nodes/report/${address}`);
            }}
          />

          <NodeStatsGrid node={node} runePrice={runePrice} />

          <NodeBondProvidersList
            address={address}
            providers={providers}
            onOpenBondProviderReport={(nodeAddress, providerAddress) => {
              handleClose();
              navigate(`/bp-report?node=${nodeAddress}&bp=${providerAddress}`);
            }}
          />

          <NodeDrawerCharts
            address={address}
            chartQueries={chartQueries}
            isDark={isDark}
          />
        </div>
      </div>
    </>
  );

  return createPortal(drawer, portalRoot);
};

export default NodeDrawer;
