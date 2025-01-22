import semver from "semver";
import {
  secondsToTimeObject,
  parseObserveChains,
  calculateApy,
  getMaxHeightForChain,
} from "../utilities/commonFunctions";

// TO DO CHECK NOT IN USE AND DELETE

export const getData = async () => {
  try {
    const response = await fetch("https://api.liquify.com/thor/api/grabData");
    const val = await response.json();

    let { globalData, data } = val;

    // Find the maximum version using semver
    const maxVersion = data
      .map((item) => item.version)
      .filter(Boolean)
      .sort(semver.rcompare)[0];

    // Calculate time until next churn
    const churnAtBlock = globalData.lastChurn + globalData.churnInterval;
    const blocksUntilChurn = churnAtBlock - globalData.maxHeight;
    const secondsUntilChurn =
      blocksUntilChurn * parseFloat(globalData.secondsPerBlock);
    const timeUntilChurn = secondsToTimeObject(secondsUntilChurn);

    // Calculate time until next retry
    const modChurn = blocksUntilChurn % 720;
    const blocksUntilRetry = 720 + modChurn;
    const secondsUntilRetry =
      blocksUntilRetry * parseFloat(globalData.secondsPerBlock);
    const timeUntilRetry = secondsToTimeObject(secondsUntilRetry);

    // Calculate APY ratio and churns per year
    const ratioRewardsAPY =
      (globalData.churnInterval - blocksUntilChurn) / globalData.churnInterval;
    const churnDurationInSeconds =
      globalData.churnInterval * parseFloat(globalData.secondsPerBlock);
    const churnsInYear = Math.floor((365 * 24 * 3600) / churnDurationInSeconds);

    globalData = {
      ...globalData,
      timeUntilChurn,
      timeUntilRetry,
      churnTry: secondsUntilChurn < 0,
      ratioRewardsAPY,
      maxVersion,
      blocksSinceLastChurn: globalData.maxHeight - globalData.lastChurn,
      coingecko: globalData.coingecko || {},
    };

    const processedData = data.map((item) => {
      const age =
        ((globalData.maxHeight - item.status_since) *
          parseFloat(globalData.secondsPerBlock)) /
        (60 * 60 * 24);

      let score = (globalData.blocksSinceLastChurn / item.slash_points).toFixed(
        1
      );
      score = score === "Infinity" ? "-" : score;

      const bond_providers = JSON.parse(item.bond_providers);
      const jail = JSON.parse(item.jail);
      const observe_chains = JSON.parse(item.observe_chains);
      const preflight_status = JSON.parse(item.preflight_status);

      const obchains = parseObserveChains(observe_chains);

      const apy = calculateApy(item, ratioRewardsAPY, churnsInYear);

      return {
        ...item,
        age,
        score,
        action: "-",
        bond_providers,
        jail,
        observe_chains,
        preflight_status,
        obchains,
        apy,
      };
    });

    const observeChainsData = processedData
      .map((item) => item.observe_chains)
      .filter(Boolean);
    const chains = [
      "BTC",
      "DOGE",
      "ETH",
      "LTC",
      "GAIA",
      "BCH",
      "AVAX",
      "BSC",
      "BASE",
    ];
    const maxChainHeights = chains.reduce((acc, chain) => {
      acc[chain] = getMaxHeightForChain(observeChainsData, chain);
      return acc;
    }, {});

    const totalBondedValue =
      processedData.reduce((sum, item) => sum + (item.bond || 0), 0) / 1e8;
    globalData.totalBondedValue = totalBondedValue;

    return {
      data: processedData,
      globalData,
      maxChainHeights,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export function getCountriesData(nodes) {
  const countryMap = {};

  nodes.forEach((node) => {
    const country = node.country?.trim() || "Unknown";
    countryMap[country] = (countryMap[country] || 0) + 1;
  });

  return Object.keys(countryMap).map((country) => ({
    name: country,
    value: countryMap[country],
  }));
}

export function getVersionData(nodes) {
  const versionMap = {};

  nodes.forEach((node) => {
    const version = node.version?.trim() || "Unknown";
    versionMap[version] = (versionMap[version] || 0) + 1;
  });

  return Object.keys(versionMap).map((version) => ({
    name: version,
    value: versionMap[version],
  }));
}

export async function getTotalBondData() {
  const response = await fetch("https://api.liquify.com/thor/api/totalBond");
  if (!response.ok) {
    throw new Error("Failed to fetch totalBond data");
  }
  const data = await response.json();

  const parsedArray = Object.entries(data).map(([blockHeight, bondValue]) => ({
    blockHeight: Number(blockHeight),
    bondValue: Number(bondValue),
  }));

  parsedArray.sort((a, b) => a.blockHeight - b.blockHeight);

  return parsedArray;
}

export async function getMaxEffectiveStakeData() {
  const response = await fetch(
    "https://api.liquify.com/thor/api/maxEffectiveStake"
  );
  if (!response.ok) {
    throw new Error("Failed to fetch maxEffectiveStake data");
  }

  const data = await response.json();

  const parsedArray = Object.entries(data).map(([blockHeight, stakeValue]) => ({
    blockHeight: Number(blockHeight),
    bondValue: Number(stakeValue),
  }));

  parsedArray.sort((a, b) => a.blockHeight - b.blockHeight);

  return parsedArray;
}
