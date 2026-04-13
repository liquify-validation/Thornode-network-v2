import { useQuery } from "@tanstack/react-query";
import {
  fetchRecentSwaps,
  fetchStreamingSwaps,
  fetchSwapHistory,
  fetchSwapStats,
} from "../services/apiService";

export function useSwapStats() {
  return useQuery({
    queryKey: ["swapStats"],
    queryFn: fetchSwapStats,
    staleTime: 30_000,
    refetchInterval: 30_000,
  });
}

export function useRecentSwaps(type) {
  return useQuery({
    queryKey: ["recentSwaps", type || "all"],
    queryFn: () => fetchRecentSwaps(type),
    staleTime: 30_000,
    refetchInterval: 30_000,
  });
}

export function useSwapHistory(params = {}) {
  return useQuery({
    queryKey: ["swapHistory", params],
    queryFn: () => fetchSwapHistory(params),
    staleTime: 30_000,
    refetchInterval: 30_000,
  });
}

export function useStreamingSwaps() {
  return useQuery({
    queryKey: ["streamingSwaps"],
    queryFn: fetchStreamingSwaps,
    staleTime: 15_000,
    refetchInterval: 15_000,
  });
}
