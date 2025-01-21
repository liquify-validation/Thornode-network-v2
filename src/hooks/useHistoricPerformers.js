import { useQuery } from "@tanstack/react-query";
import { fetchHistoricPerformers } from "../services/apiService";

async function fetchAndTransform(churnCount) {
  const raw = await fetchHistoricPerformers(churnCount);
  console.log("Performer data", raw);
  return raw;
}

export function useHistoricPerformers(churnCount) {
  return useQuery({
    queryKey: ["historicPerformers", churnCount],
    queryFn: () => fetchAndTransform(churnCount),
  });
}
