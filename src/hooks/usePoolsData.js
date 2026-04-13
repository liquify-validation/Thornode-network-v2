import { useQuery } from "@tanstack/react-query";
import { fetchPools, fetchPoolStats } from "../services/apiService";

export function usePoolsData(status) {
  return useQuery({
    queryKey: ["poolsData", status],
    queryFn: () => fetchPools(status),
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
}

export function usePoolStats() {
  return useQuery({
    queryKey: ["poolStats"],
    queryFn: fetchPoolStats,
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
}
