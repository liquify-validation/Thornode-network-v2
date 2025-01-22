import { findChurnIns, findChurnOuts } from "./churnFunctions";

export const processData = (
  data,
  globalData,
  maxVersion,
  favoriteNodes = [],
  searchTerm = ""
) => {
  const enhancedNodes = enhanceNodesWithAgeAndApy(data, globalData);
  const dataWithFavorites = enhancedNodes.map((node) => ({
    ...node,
    fave: favoriteNodes.includes(node.node_address) ? 1 : 0,
  }));

  const activeNodes = dataWithFavorites.filter(
    (node) => node.status === "Active"
  );
  const standbyNodes = dataWithFavorites.filter(
    (node) =>
      (node.status === "Standby" || node.status === "Ready") &&
      node.version === maxVersion
  );

  const activeStandbyAddresses = [
    ...activeNodes.map((node) => node.node_address),
    ...standbyNodes.map((node) => node.node_address),
  ];

  const otherNodes = dataWithFavorites.filter(
    (node) => !activeStandbyAddresses.includes(node.node_address)
  );

  const processedActiveNodes = findChurnOuts(activeNodes, globalData);
  const processedStandbyNodes = findChurnIns(standbyNodes);

  const filteredActiveNodes = returnSearchedData(
    processedActiveNodes,
    searchTerm
  );
  const filteredStandbyNodes = returnSearchedData(
    processedStandbyNodes,
    searchTerm
  );
  const filteredOtherNodes = returnSearchedData(otherNodes, searchTerm);

  const sortedActiveNodes = sortNodes(filteredActiveNodes);
  const sortedStandbyNodes = sortNodes(filteredStandbyNodes);
  const sortedOtherNodes = sortNodes(filteredOtherNodes);

  return {
    activeNodes: sortedActiveNodes,
    standbyNodes: sortedStandbyNodes,
    otherNodes: sortedOtherNodes,
  };
};

function enhanceNodesWithAgeAndApy(nodes, globalData) {
  const blockTime = parseFloat(globalData.secondsPerBlock || 6);
  const ratioRewardsAPY = globalData.ratioRewardsAPY ?? 1;
  const churnInterval = globalData.churnInterval ?? 43200;

  const churnsInYear = 365 / ((blockTime * churnInterval) / (60 * 60 * 24));

  return nodes.map((node) => {
    if (!node.status_since) {
      node.age = 0;
    } else {
      const blocksSinceStatus = globalData.maxHeight - node.status_since;
      node.age = (blocksSinceStatus * blockTime) / 3600 / 24;
    }

    const bondRune = node.bond / 1e8;
    if (!bondRune) {
      node.apy = "0.00%";
    } else {
      const currentAwardAnnualised =
        (node.current_award / ratioRewardsAPY / 1e8) * churnsInYear;
      const apyFloat = (currentAwardAnnualised / bondRune) * 100;
      node.apy = apyFloat.toFixed(2) + "%";
    }

    return node;
  });
}

const returnSearchedData = (data, searchTerm) => {
  if (!searchTerm) return data;

  return data.filter(
    (item) =>
      item.node_address.includes(searchTerm) ||
      (item.bondProvidersString &&
        item.bondProvidersString.includes(searchTerm))
  );
};

const sortNodes = (nodes, sortBy = "fave", sortDirection = "desc") => {
  return nodes.sort((a, b) => {
    if (a.fave !== b.fave) return b.fave - a.fave;
    return b.bond - a.bond;
  });
};
