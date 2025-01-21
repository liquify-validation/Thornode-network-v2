import { useQuery } from "@tanstack/react-query";
import { fetchAllNodes } from "../services/apiService";
import {
  parseObserveChains,
  calculateApy,
  secondsToTimeObject,
} from "../utilities/commonFunctions";
import { useNetworkData } from "./useNetworkData";

function processNodes(rawNodes, netData) {
  if (!rawNodes)
    return { processedNodes: [], countriesData: [], totalBondedValue: 0 };

  const {
    maxHeight,
    secondsPerBlock,
    ratioRewardsAPY,
    blocksSinceLastChurn,
    churnsInYear,
  } = netData;

  const processedNodes = rawNodes.map((node) => {
    const age = maxHeight
      ? ((maxHeight - node.status_since) * parseFloat(secondsPerBlock)) /
        (60 * 60 * 24)
      : 0;

    let score = node.slash_points
      ? (blocksSinceLastChurn / node.slash_points).toFixed(1)
      : "0";
    if (score === "Infinity") score = "-";

    const bond_providers = node.bond_providers
      ? JSON.parse(node.bond_providers)
      : null;
    const jail = node.jail ? JSON.parse(node.jail) : null;
    const observe_chains = node.observe_chains
      ? JSON.parse(node.observe_chains)
      : [];
    const preflight_status = node.preflight_status
      ? JSON.parse(node.preflight_status)
      : null;
    const obchains = parseObserveChains(observe_chains);

    const apy = calculateApy(node, ratioRewardsAPY, churnsInYear);

    return {
      ...node,
      age,
      score,
      bond_providers,
      jail,
      observe_chains,
      preflight_status,
      obchains,
      apy,
      action: "-",
    };
  });

  const totalBondedValue =
    processedNodes.reduce((sum, n) => sum + (n.bond || 0), 0) / 1e8;

  const countryMap = {};
  processedNodes.forEach((node) => {
    const country = node.country?.trim() || "Unknown";
    countryMap[country] = (countryMap[country] || 0) + 1;
  });
  const countriesData = Object.keys(countryMap).map((country) => ({
    name: country,
    value: countryMap[country],
  }));

  return {
    processedNodes,
    totalBondedValue,
    countriesData,
  };
}

async function fetchAndProcessNodes(netData) {
  const rawNodes = await fetchAllNodes();
  return processNodes(rawNodes, netData);
}

export function useNodeData() {
  const { data: netData } = useNetworkData();

  return useQuery({
    queryKey: ["nodeData"],
    queryFn: () => fetchAndProcessNodes(netData),
    enabled: !!netData,
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
}
