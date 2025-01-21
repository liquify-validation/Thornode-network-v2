import { useQuery } from "@tanstack/react-query";
import { fetchNodeRewardsData } from "../services/apiService";

function processRewardsData(rawObject) {
  return Object.entries(rawObject)
    .map(([blockHeight, rewardsValue]) => ({
      blockHeight: Number(blockHeight),
      rewardsValue: Number(rewardsValue) / 1e8,
    }))
    .sort((a, b) => a.blockHeight - b.blockHeight);
}

async function fetchAndProcessRewardsData(nodeAddress) {
  const raw = await fetchNodeRewardsData(nodeAddress);
  return processRewardsData(raw);
}

export function useNodeRewardsData(nodeAddress) {
  return useQuery({
    queryKey: ["rewardsData", nodeAddress],
    queryFn: () => fetchAndProcessRewardsData(nodeAddress),
    enabled: !!nodeAddress,
    refetchInterval: 60_000,
    staleTime: 60_000,
  });
}
