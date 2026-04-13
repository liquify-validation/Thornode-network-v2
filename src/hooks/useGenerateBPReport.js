import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { generateBPReport, fetchBPsForNode } from "../services/apiService";
import { normalizeNodeAddress } from "../utilities/commonFunctions";

export function useGenerateBPReport() {
  return useMutation({
    mutationFn: async (payload) => {
      return await generateBPReport(payload);
    },
  });
}

export function useBPsForNode(nodeAddress) {
  const normalizedNodeAddress = normalizeNodeAddress(nodeAddress);

  return useQuery({
    queryKey: ["bpsForNode", normalizedNodeAddress],
    queryFn: () => fetchBPsForNode(normalizedNodeAddress),
    enabled: !!normalizedNodeAddress,
    staleTime: 60_000,
  });
}
