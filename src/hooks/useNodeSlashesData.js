import { useQuery } from "@tanstack/react-query";
import { fetchNodeSlashesData } from "../services/apiService";

function processSlashesData(rawObject) {
  return Object.entries(rawObject)
    .map(([blockHeight, slashesValue]) => ({
      blockHeight: Number(blockHeight),
      slashesValue: Number(slashesValue),
    }))
    .sort((a, b) => a.blockHeight - b.blockHeight);
}

async function fetchAndProcessSlashesData(nodeAddress) {
  const raw = await fetchNodeSlashesData(nodeAddress);
  return processSlashesData(raw);
}

export function useNodeSlashesData(nodeAddress) {
  return useQuery({
    queryKey: ["slashesData", nodeAddress],
    queryFn: () => fetchAndProcessSlashesData(nodeAddress),
    enabled: !!nodeAddress,
    refetchInterval: 60_000,
    staleTime: 60_000,
  });
}
