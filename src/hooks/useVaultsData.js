import { useQuery } from "@tanstack/react-query";
import {
  fetchAsgardVaults,
  fetchActiveVaults,
  fetchPendingVaults,
  fetchTotalLocked,
} from "../services/apiService";

export function useAsgardVaults() {
  return useQuery({
    queryKey: ["asgardVaults"],
    queryFn: fetchAsgardVaults,
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
}

export function useActiveVaults() {
  return useQuery({
    queryKey: ["activeVaults"],
    queryFn: fetchActiveVaults,
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
}

export function usePendingVaults() {
  return useQuery({
    queryKey: ["pendingVaults"],
    queryFn: fetchPendingVaults,
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
}

export function useTotalLocked() {
  return useQuery({
    queryKey: ["totalLocked"],
    queryFn: fetchTotalLocked,
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
}
