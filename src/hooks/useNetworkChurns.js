import { useQuery } from "@tanstack/react-query";
import { fetchNetworkChurns } from "../services/apiService";

export function useNetworkChurns() {
  return useQuery({
    queryKey: ["networkChurns"],
    queryFn: fetchNetworkChurns,
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
}
