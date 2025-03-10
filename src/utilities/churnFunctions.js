export const findChurnIns = (standbyNodes) => {
  if (!standbyNodes.length) return [];

  const over300 = standbyNodes.filter((n) => n.bond >= 30000000000000);
  const over300Sorted = over300.sort((a, b) => b.bond - a.bond);

  const top5 = over300Sorted.slice(0, 5).map((node) => ({
    ...node,
    action: "Churn In",
  }));

  const restOver300 = over300Sorted.slice(5);

  const under300 = standbyNodes.filter((n) => n.bond < 30000000000000);

  return [...top5, ...restOver300, ...under300];
};

export const findChurnOuts = (activeNodes, globalData) => {
  if (!activeNodes.length) return [];

  const secondsPerBlock = parseFloat(globalData.secondsPerBlock);

  const nodesWithAge = activeNodes.map((node) => ({
    ...node,
    age:
      ((globalData.maxHeight - node.status_since) * secondsPerBlock) /
      (60 * 60 * 24),
  }));

  // Identify Oldest Node
  const oldestNode = [...nodesWithAge].sort((a, b) => b.age - a.age)[0];
  if (oldestNode) oldestNode.action = "Oldest";

  // Identify Node with Smallest Bond
  const smallestBondNode = [...nodesWithAge].sort((a, b) => a.bond - b.bond)[0];
  if (smallestBondNode) smallestBondNode.action = "Smallest Bond";

  // Identify Worst Performer (based on score)
  const worstPerformer = [...nodesWithAge].sort((a, b) => a.score - b.score)[0];
  if (worstPerformer) worstPerformer.action = "Worst Performer";

  // Calculate Bad Validator Redline
  const greater100Slashes = nodesWithAge.filter(
    (node) => node.slash_points > 100
  );
  const totalScore = greater100Slashes.reduce(
    (sum, node) => sum + parseFloat(node.score || 0),
    0
  );
  const averageScore = totalScore / (greater100Slashes.length || 1);
  const validatorLine = averageScore / globalData.BadValidatorRedline;

  const nodesWithBadRedline = nodesWithAge.map((node) => {
    if (parseFloat(node.score || 0) < validatorLine) {
      return { ...node, action: "Bad Redline" };
    }
    return node;
  });

  return nodesWithBadRedline;
};
