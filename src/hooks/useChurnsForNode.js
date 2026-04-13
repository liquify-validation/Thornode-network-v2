import { useQuery } from "@tanstack/react-query";
import { fetchChurnsForNode } from "../services/apiService";
import { normalizeNodeAddress } from "../utilities/commonFunctions";

export function useChurnsForNode(nodeAddress) {
  const normalizedNodeAddress = normalizeNodeAddress(nodeAddress);

  return useQuery({
    queryKey: ["churns", normalizedNodeAddress],
    queryFn: () => fetchChurnsForNode(normalizedNodeAddress),
    enabled: !!normalizedNodeAddress,
  });
}
