import { useQuery } from "@tanstack/react-query";
import {
  fetchStreamingSwaps,
  fetchSwapHistory,
  fetchRecentSwaps,
  fetchSwapStats,
} from "../services/apiService";

export function useStreamingSwaps() {
  return useQuery({
    queryKey: ["streamingSwaps"],
    queryFn: fetchStreamingSwaps,
    staleTime: 15_000,
    refetchInterval: 15_000,
  });
}

export function useSwapHistory(filters) {
  return useQuery({
    queryKey: ["swapHistory", filters],
    queryFn: () => fetchSwapHistory(filters),
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}

export function useRecentSwaps(type) {
  return useQuery({
    queryKey: ["recentSwaps", type],
    queryFn: () => fetchRecentSwaps(type),
    staleTime: 30_000,
    refetchInterval: 30_000,
  });
}

export function useSwapStats() {
  return useQuery({
    queryKey: ["swapStats"],
    queryFn: fetchSwapStats,
    staleTime: 30_000,
    refetchInterval: 30_000,
  });
}
