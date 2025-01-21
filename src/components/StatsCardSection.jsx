import StatsCard from "./StatsCard";
import {
  BlockIcon,
  BondIcon,
  BondOverTimeIcon,
  ChurnTimeUntilIcon,
  DayHighIcon,
  DayLowIcon,
  DayVolumeIcon,
  MarketCapIcon,
  MarketCapRankingIcon,
  MaxEffectiveBondIcon,
  PriceIcon,
  TotalSupplyIcon,
} from "../assets";
import {
  getChurnTitle,
  getTimeToDisplay,
  calculateTotalBondedValue,
} from "../utilities/commonFunctions";
import InfoPopover from "./InfoPopover";

const StatsCardSection = ({ netData, nodeData }) => {
  const totalBondedValueRune = nodeData.totalBondedValue || 0;

  const coingeckoData = netData.coingecko || {};
  const currentPrice = coingeckoData.current_price || 0;

  const totalBondedValueUsd = (totalBondedValueRune * currentPrice).toFixed(0);

  const maxEffectiveStakeRune = (netData.maxEffectiveStake || 0) / 1e8;
  const maxEffectiveStakeUsd = (maxEffectiveStakeRune * currentPrice).toFixed(
    0
  );

  const statsItems = [
    {
      icon: BlockIcon,
      title: "CURRENT BLOCK",
      stat: netData.maxHeight?.toLocaleString() || "N/A",
    },
    {
      icon: ChurnTimeUntilIcon,
      title: getChurnTitle(netData),
      stat: getTimeToDisplay(netData),
    },
    {
      icon: BondIcon,
      title: "TOTAL BONDED VALUE",
      stat: (
        <InfoPopover
          title="Dollar Value"
          text={`$${Number(totalBondedValueUsd).toLocaleString()}`}
        >
          <span>ᚱ{totalBondedValueRune.toLocaleString()}</span>
        </InfoPopover>
      ),
    },
    {
      icon: MarketCapIcon,
      title: "MARKET CAP",
      stat: `$${(coingeckoData.market_cap || 0).toLocaleString()}`,
    },
    {
      icon: DayVolumeIcon,
      title: "24 HR VOLUME",
      stat: `$${(coingeckoData.total_volume || 0).toLocaleString()}`,
    },
    {
      icon: MaxEffectiveBondIcon,
      title: "MAX EFFECTIVE BOND",
      stat: (
        <InfoPopover
          title="Dollar Value"
          text={`$${Number(maxEffectiveStakeUsd).toLocaleString()}`}
        >
          <span>ᚱ{Math.floor(maxEffectiveStakeRune).toLocaleString()}</span>
        </InfoPopover>
      ),
    },
    {
      icon: BondOverTimeIcon,
      title: "SECONDS PER BLOCK",
      stat: (Number(netData.secondsPerBlock) || 0).toLocaleString(),
    },
    {
      icon: PriceIcon,
      title: "PRICE",
      stat: `$${(coingeckoData.current_price || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
    },
    {
      icon: DayHighIcon,
      title: "24 HR HIGH",
      stat: `$${(coingeckoData.high_24h || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
    },
    {
      icon: DayLowIcon,
      title: "24 HR LOW",
      stat: `$${(coingeckoData.low_24h || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
    },
    {
      icon: MarketCapRankingIcon,
      title: "MARKET CAP RANK",
      stat: coingeckoData.market_cap_rank || "N/A",
    },
    {
      icon: TotalSupplyIcon,
      title: "TOTAL SUPPLY",
      stat: `ᚱ${(coingeckoData.total_supply || 0).toLocaleString()}`,
    },
  ];

  return (
    <div className="w-full px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statsItems.map((item, index) => (
          <StatsCard
            key={index}
            icon={item.icon}
            title={item.title}
            stat={item.stat}
          />
        ))}
      </div>
    </div>
  );
};

export default StatsCardSection;
