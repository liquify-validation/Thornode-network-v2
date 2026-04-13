import { useNodeBondData } from "./useNodeBondData";
import { useNodeRewardsData } from "./useNodeRewardsData";
import { useNodePositionData } from "./useNodePositionData";
import { useNodeSlashesData } from "./useNodeSlashesData";

const useNodeChartQueries = (address) => ({
  bond: useNodeBondData(address),
  rewards: useNodeRewardsData(address),
  position: useNodePositionData(address),
  slashes: useNodeSlashesData(address),
});

export default useNodeChartQueries;
