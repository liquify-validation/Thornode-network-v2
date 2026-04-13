import { useQuery } from "@tanstack/react-query";
import { fetchMimirVotes } from "../services/apiService";

export function useVotingData() {
  return useQuery({
    queryKey: ["mimirVotes"],
    queryFn: fetchMimirVotes,
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
}
