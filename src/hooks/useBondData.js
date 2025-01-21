import { useQuery } from "@tanstack/react-query";
import { fetchTotalBondData } from "../services/apiService";

function processTotalBondData(rawObject) {
  const parsedArray = Object.entries(rawObject).map(
    ([blockHeight, bondValue]) => ({
      blockHeight: Number(blockHeight),
      bondValue: Number(bondValue) / 1e8,
    })
  );
  parsedArray.sort((a, b) => a.blockHeight - b.blockHeight);

  return parsedArray;
}

async function fetchAndProcessBondData() {
  const raw = await fetchTotalBondData();
  return processTotalBondData(raw);
}

export function useBondData() {
  return useQuery({
    queryKey: ["bondData"],
    queryFn: fetchAndProcessBondData,
    refetchInterval: 60_000,
    staleTime: 60_000,
  });
}
