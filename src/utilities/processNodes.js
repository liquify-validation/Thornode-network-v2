import semver from "semver";
import {
  parseObserveChains,
  calculateApy,
  secondsToTimeObject,
  getMaxHeightForChain,
} from "../utilities/commonFunctions";

export function processNodes(rawNodes, globalData) {
  if (!Array.isArray(rawNodes)) {
    return {
      processed: [],
      maxVersion: "",
      countriesData: [],
      totalBondedValue: 0,
    };
  }

  const {
    maxHeight = globalData.maxHeight,
    secondsPerBlock = globalData.secondsPerBlock,
    blocksSinceLastChurn = globalData.maxHeight - globalData.lastChurn,
  } = globalData || {};

  const versions = rawNodes
    .map((n) => n.version)
    .filter(Boolean)
    .sort(semver.rcompare);
  const maxVersion = versions[0] || "";

  const processed = rawNodes.map((node) => {
    let age = 0;
    if (maxHeight && node.status_since) {
      age =
        ((maxHeight - node.status_since) * parseFloat(secondsPerBlock)) /
        (60 * 60 * 24);
    }

    let score = "-";
    if (node.slash_points && node.slash_points > 0) {
      const rawScore = (blocksSinceLastChurn / node.slash_points).toFixed(1);
      score = rawScore === "Infinity" ? "-" : rawScore;
    }

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

    const { ratioRewardsAPY = 1, churnsInYear = 1 } = globalData;
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

  const activeNodes = processed.filter((n) => n.status === "Active");

  const unformattedTotalBondedValue =
    activeNodes.reduce((sum, n) => sum + (n.bond || 0), 0) / 1e8;

  const totalBondedValue =
    unformattedTotalBondedValue > 0
      ? parseInt(unformattedTotalBondedValue).toLocaleString()
      : "0";

  const countryMap = {};
  processed.forEach((node) => {
    const country = node.country?.trim() || "Unknown";
    countryMap[country] = (countryMap[country] || 0) + 1;
  });
  const countriesData = Object.keys(countryMap).map((country) => ({
    name: country,
    value: countryMap[country],
  }));

  return {
    processed,
    maxVersion,
    countriesData,
    totalBondedValue,
  };
}

export function computeMaxChainHeights(nodes) {
  const chains = ["BTC", "ETH", "LTC", "BCH", "DOGE", "AVAX", "BSC", "BASE"];
  const observeChainsData = nodes.map((n) => n.observe_chains).filter(Boolean);

  const acc = {};
  chains.forEach((chain) => {
    acc[chain] = getMaxHeightForChain(observeChainsData, chain);
  });

  return acc;
}
