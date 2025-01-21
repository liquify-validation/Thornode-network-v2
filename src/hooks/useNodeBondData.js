import { useQuery } from "@tanstack/react-query";
import { fetchNodeBondData } from "../services/apiService";

function processBondData(rawObject) {
  return Object.entries(rawObject)
    .map(([blockHeight, bondValue]) => ({
      blockHeight: Number(blockHeight),
      bondValue: Number(bondValue) / 1e8,
    }))
    .sort((a, b) => a.blockHeight - b.blockHeight);
}

async function fetchAndProcessBondData(nodeAddress) {
  const raw = await fetchNodeBondData(nodeAddress);
  return processBondData(raw);
}

export function useNodeBondData(nodeAddress) {
  return useQuery({
    queryKey: ["bondData", nodeAddress],
    queryFn: () => fetchAndProcessBondData(nodeAddress),
    enabled: !!nodeAddress,
    refetchInterval: 60_000,
    staleTime: 60_000,
  });
}
