import { findChurnIns, findChurnOuts } from "./churnFunctions";

export const processData = (
  data,
  globalData,
  favoriteNodes = [],
  searchTerm = ""
) => {
  // Map data to include favorites
  const dataWithFavorites = data.map((node) => ({
    ...node,
    fave: favoriteNodes.includes(node.node_address) ? 1 : 0,
  }));

  // Filter nodes
  const activeNodes = dataWithFavorites.filter(
    (node) => node.status === "Active"
  );
  const standbyNodes = dataWithFavorites.filter(
    (node) =>
      (node.status === "Standby" || node.status === "Ready") &&
      node.version === globalData.maxVersion
  );

  const activeStandbyAddresses = [
    ...activeNodes.map((node) => node.node_address),
    ...standbyNodes.map((node) => node.node_address),
  ];

  const otherNodes = dataWithFavorites.filter(
    (node) => !activeStandbyAddresses.includes(node.node_address)
  );

  // Process ChurnIns and ChurnOuts
  const processedActiveNodes = findChurnOuts(activeNodes, globalData);
  const processedStandbyNodes = findChurnIns(standbyNodes);

  // Apply search term filtering
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

// Helper function to filter nodes based on search term
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
