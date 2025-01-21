import { useQuery } from "@tanstack/react-query";
import { fetchChurnsForNode } from "../services/apiService";

export function useChurnsForNode(nodeAddress) {
  return useQuery({
    queryKey: ["churns", nodeAddress],
    queryFn: () => fetchChurnsForNode(nodeAddress),
    enabled: !!nodeAddress,
  });
}
