const ApiUrl = import.meta.env.VITE_API_URL;

export async function fetchNetworkInfo() {
  const response = await fetch(`${ApiUrl}/network/dumpNetworkInfo`);
  if (!response.ok) {
    throw new Error("Failed to fetch network info");
  }

  const net = await response.json();
  return net;
}

export async function fetchAllNodes() {
  const response = await fetch(`${ApiUrl}/nodes/getAllNodes`);
  if (!response.ok) {
    throw new Error("Failed to fetch node data");
  }
  const nodes = await response.json();
  return nodes;
}

export async function fetchTotalBondData() {
  const res = await fetch(`${ApiUrl}/historic/network/totalBond`);
  if (!res.ok) {
    throw new Error("Failed to fetch totalBond data");
  }
  return await res.json();
}

export async function fetchMaxEffectiveStakeData() {
  const res = await fetch(`${ApiUrl}/historic/network/totalBond`);
  if (!res.ok) {
    throw new Error("Failed to fetch maxEffectiveStake data");
  }
  return await res.json();
}

export async function fetchNodePositionData(address) {
  const res = await fetch(`${ApiUrl}/historic/node/grabPosition/${address}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch position data for ${address}`);
  }
  return await res.json();
}

export async function fetchNodeRewardsData(address) {
  const res = await fetch(`${ApiUrl}/historic/node/grab-rewards/${address}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch rewards data for ${address}`);
  }
  return await res.json();
}

export async function fetchNodeSlashesData(address) {
  const res = await fetch(`${ApiUrl}/historic/node/grab-slashes/${address}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch slashes data for ${address}`);
  }
  return await res.json();
}

export async function fetchNodeBondData(address) {
  const res = await fetch(`${ApiUrl}/historic/node/grab-bond/${address}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch bond data for ${address}`);
  }
  return await res.json();
}

export async function fetchHistoricPerformers(churnCount) {
  const res = await fetch(
    `${ApiUrl}/historic/node/historicPerformers/${churnCount}`
  );
  if (!res.ok) {
    throw new Error(
      `Failed to fetch historic performers for churnCount=${churnCount}`
    );
  }
  return await res.json();
}

export async function fetchChurnsForNode(nodeAddress) {
  const url = `${ApiUrl}/historic/node/grabChurnsForNode/${nodeAddress}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch churns for node ${nodeAddress}`);
  }
  return await response.json();
}

export async function generateReport(payload) {
  const url = `${ApiUrl}/historic/node/generateReport`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Failed to generate report for ${payload.node}`);
  }
  return await response.json();
}

export async function fetchPriceData() {
  const res = await fetch(`${ApiUrl}/historic/network/grabPrice`);
  if (!res.ok) {
    throw new Error("Failed to fetch price data");
  }
  return await res.json();
}
