import { useQuery } from "@tanstack/react-query";
import { fetchMaxEffectiveStakeData } from "../services/apiService";

function processMaxEffectiveStake(rawObject) {
  const parsedArray = Object.entries(rawObject).map(
    ([blockHeight, stakeValue]) => ({
      blockHeight: Number(blockHeight),
      bondValue: Number(stakeValue) / 1e8,
    })
  );
  parsedArray.sort((a, b) => a.blockHeight - b.blockHeight);

  return parsedArray;
}

async function fetchAndProcessStakeData() {
  const raw = await fetchMaxEffectiveStakeData();
  return processMaxEffectiveStake(raw);
}

export function useMaxEffectiveStakeData() {
  return useQuery({
    queryKey: ["maxStakeData"],
    queryFn: fetchAndProcessStakeData,
    refetchInterval: 60_000,
    staleTime: 60_000,
  });
}
