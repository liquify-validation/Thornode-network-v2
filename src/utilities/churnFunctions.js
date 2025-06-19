const DESIRED_VALIDATOR_SET = Number(
  import.meta.env.VITE_DESIRED_VALIDATOR_SET
);
const NUMBER_OF_NEW_NODES_PER_CHURN = Number(
  import.meta.env.VITE_NUMBER_OF_NEW_NODES_PER_CHURN
);

export const findChurnIns = (
  standbyNodes,
  currentActiveCount,
  churnOutCount
) => {
  if (!standbyNodes.length) return [];

  const hardCapNext = Math.min(
    DESIRED_VALIDATOR_SET,
    currentActiveCount + NUMBER_OF_NEW_NODES_PER_CHURN
  );

  const churnInLimit = Math.max(
    0,
    hardCapNext - (currentActiveCount - churnOutCount)
  );

  const overMinBond = standbyNodes
    .filter((n) => n.bond >= 30_000_000_000_000)
    .sort((a, b) => b.bond - a.bond);

  const churnIns = overMinBond.slice(0, churnInLimit).map((n) => ({
    ...n,
    action: "Churn In",
  }));

  const rest = standbyNodes
    .filter((n) => !churnIns.some((c) => c.node_address === n.node_address))
    .map((n) => ({ ...n, action: "—" }));

  return [...churnIns, ...rest];
};

export const findChurnOuts = (activeNodes, globalData) => {
  if (!activeNodes.length) return { nodes: [], churnOutCount: 0 };

  const secsPerBlock = parseFloat(globalData.secondsPerBlock);

  const nodesWithAge = activeNodes.map((n) => ({
    ...n,
    age: ((globalData.maxHeight - n.status_since) * secsPerBlock) / 86400,
  }));

  const oldest = [...nodesWithAge].sort((a, b) => b.age - a.age)[0];
  const smallestBond = [...nodesWithAge].sort((a, b) => a.bond - b.bond)[0];
  const worstPerformer = [...nodesWithAge].sort((a, b) => a.score - b.score)[0];

  const forced = [oldest, smallestBond, worstPerformer]
    .filter(Boolean)
    .reduce((acc, node, idx) => {
      const label = ["Oldest", "Smallest Bond", "Worst Performer"][idx];
      if (!acc.some((n) => n.node_address === node.node_address)) {
        acc.push({ ...node, action: label });
      }
      return acc;
    }, []);

  nodesWithAge
    .filter((n) => n.leave)
    .forEach((n) => {
      if (!forced.some((x) => x.node_address === n.node_address))
        forced.push({ ...n, action: "Requested Leave" });
    });

  const annotated = activeNodes.map((n) => {
    const flagged = forced.find((f) => f.node_address === n.node_address);
    return flagged ? flagged : { ...n, action: "—" };
  });

  return { nodes: annotated, churnOutCount: forced.length };
};
