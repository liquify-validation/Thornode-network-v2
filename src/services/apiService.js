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
  const res = await fetch(`${ApiUrl}/historic/network/maxEffectiveStake`);
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

// ── Bond Provider Report ────────────────────────────────
export async function generateBPReport(payload) {
  const url = `${ApiUrl}/historic/node/generateBPReport`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Failed to generate BP report for ${payload.node}`);
  }
  return await response.json();
}

export async function fetchBPsForNode(nodeAddress) {
  const res = await fetch(
    `${ApiUrl}/historic/node/grabBPsForNode/${nodeAddress}`
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch BPs for node ${nodeAddress}`);
  }
  return await res.json();
}

// ── Vaults ──────────────────────────────────────────────
export async function fetchAsgardVaults() {
  const res = await fetch(`${ApiUrl}/vaults/asgard`);
  if (!res.ok) throw new Error("Failed to fetch Asgard vaults");
  return await res.json();
}

export async function fetchActiveVaults() {
  const res = await fetch(`${ApiUrl}/vaults/asgard/active`);
  if (!res.ok) throw new Error("Failed to fetch active vaults");
  return await res.json();
}

export async function fetchPendingVaults() {
  const res = await fetch(`${ApiUrl}/vaults/pending`);
  if (!res.ok) throw new Error("Failed to fetch pending vaults");
  return await res.json();
}

export async function fetchTotalLocked() {
  const res = await fetch(`${ApiUrl}/vaults/totalLocked`);
  if (!res.ok) throw new Error("Failed to fetch total locked value");
  return await res.json();
}

// ── Mimir ───────────────────────────────────────────────
export async function fetchMimir() {
  const res = await fetch(`${ApiUrl}/mimir/`);
  if (!res.ok) throw new Error("Failed to fetch Mimir data");
  return await res.json();
}

export async function fetchMimirKey(key) {
  const res = await fetch(`${ApiUrl}/mimir/${key}`);
  if (!res.ok) throw new Error(`Failed to fetch Mimir key: ${key}`);
  return await res.json();
}

// ── Pools ───────────────────────────────────────────────
export async function fetchPools(status) {
  const url = status
    ? `${ApiUrl}/pools/?status=${status}`
    : `${ApiUrl}/pools/`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch pools");
  return await res.json();
}

export async function fetchPoolStats() {
  const res = await fetch(`${ApiUrl}/pools/stats`);
  if (!res.ok) throw new Error("Failed to fetch pool stats");
  return await res.json();
}

export async function fetchPool(asset) {
  const res = await fetch(`${ApiUrl}/pools/${encodeURIComponent(asset)}`);
  if (!res.ok) throw new Error(`Failed to fetch pool: ${asset}`);
  return await res.json();
}

// ── Queue ───────────────────────────────────────────────
export async function fetchQueue() {
  const res = await fetch(`${ApiUrl}/queue/`);
  if (!res.ok) throw new Error("Failed to fetch queue data");
  return await res.json();
}

export async function fetchQueueOutbound() {
  const res = await fetch(`${ApiUrl}/queue/outbound`);
  if (!res.ok) throw new Error("Failed to fetch outbound queue");
  return await res.json();
}

export async function fetchQueueScheduled() {
  const res = await fetch(`${ApiUrl}/queue/scheduled`);
  if (!res.ok) throw new Error("Failed to fetch scheduled queue");
  return await res.json();
}
