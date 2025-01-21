import { useQuery } from "@tanstack/react-query";
import { getData } from "../services/dataService";

async function fetchRawThorData() {
  const results = await getData();
  if (!results) throw new Error("No data returned");

  return results;
}

export function useThorChainData() {
  return useQuery({
    queryKey: ["thorData"],
    queryFn: fetchRawThorData,
    refetchInterval: 60_000,
    staleTime: 60_000,
  });
}
