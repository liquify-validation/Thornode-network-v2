import { useQuery } from "@tanstack/react-query";
import { fetchNetworkInfo } from "../services/apiService";
import { secondsToTimeObject } from "../utilities/commonFunctions";

function computeNetworkData(raw) {
  const coingeckoArray = JSON.parse(raw.coingecko || "[]");
  const coingecko = coingeckoArray[0] || {};

  const churnAtBlock = raw.lastChurn + raw.churnInterval;
  const blocksUntilChurn = churnAtBlock - raw.maxHeight;
  const secondsUntilChurn = blocksUntilChurn * parseFloat(raw.secondsPerBlock);
  const timeUntilChurn = secondsToTimeObject(secondsUntilChurn);

  const modChurn = blocksUntilChurn % 720;
  const blocksUntilRetry = 720 + modChurn;
  const secondsUntilRetry = blocksUntilRetry * parseFloat(raw.secondsPerBlock);
  const timeUntilRetry = secondsToTimeObject(secondsUntilRetry);

  const ratioRewardsAPY =
    (raw.churnInterval - blocksUntilChurn) / raw.churnInterval;

  const churnsInYear =
    365 /
    ((parseFloat(raw.secondsPerBlock) * raw.churnInterval) / (60 * 60 * 24));

  return {
    ...raw,
    coingecko,
    blocksUntilChurn,
    secondsUntilChurn,
    timeUntilChurn,
    blocksUntilRetry,
    secondsUntilRetry,
    timeUntilRetry,
    churnTry: secondsUntilChurn < 0,
    ratioRewardsAPY,
    churnsInYear,
    blocksSinceLastChurn: raw.maxHeight - raw.lastChurn,
  };
}

async function fetchAndComputeNetworkData() {
  const raw = await fetchNetworkInfo();
  return computeNetworkData(raw);
}

export function useNetworkData() {
  return useQuery({
    queryKey: ["networkData"],
    queryFn: fetchAndComputeNetworkData,
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
}
