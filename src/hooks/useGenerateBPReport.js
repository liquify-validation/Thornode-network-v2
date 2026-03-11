import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { generateBPReport, fetchBPsForNode } from "../services/apiService";

export function useGenerateBPReport() {
  return useMutation({
    mutationFn: async (payload) => {
      return await generateBPReport(payload);
    },
  });
}

export function useBPsForNode(nodeAddress) {
  return useQuery({
    queryKey: ["bpsForNode", nodeAddress],
    queryFn: () => fetchBPsForNode(nodeAddress),
    enabled: !!nodeAddress,
    staleTime: 60_000,
  });
}
