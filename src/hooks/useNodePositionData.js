import { useQuery } from "@tanstack/react-query";
import { fetchNodePositionData } from "../services/apiService";

function processPositionData(rawObject) {
  return Object.entries(rawObject)
    .map(([blockHeight, data]) => ({
      blockHeight: Number(blockHeight),
      maxPosition: data.max,
      position: data.position,
    }))
    .sort((a, b) => a.blockHeight - b.blockHeight);
}

async function fetchAndProcessPositionData(nodeAddress) {
  const raw = await fetchNodePositionData(nodeAddress);
  return processPositionData(raw);
}

export function useNodePositionData(nodeAddress) {
  return useQuery({
    queryKey: ["positionData", nodeAddress],
    queryFn: () => fetchAndProcessPositionData(nodeAddress),
    enabled: !!nodeAddress,
    refetchInterval: 60_000,
    staleTime: 60_000,
  });
}
