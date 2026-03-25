import { useQuery } from "@tanstack/react-query";
import { fetchMimir } from "../services/apiService";

export function useMimirData() {
  return useQuery({
    queryKey: ["mimirData"],
    queryFn: fetchMimir,
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
}
