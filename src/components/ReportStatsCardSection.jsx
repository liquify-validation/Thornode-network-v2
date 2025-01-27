import { StatsCard, InfoPopover } from "../components";

import {
  BondOverTimeIcon,
  StartBlockIcon,
  EndBlockIcon,
  StartBondIcon,
  EndBondIcon,
  MaxPositionIcon,
  ReportRewardsIcon,
  PositionAverageIcon,
} from "../assets";

const ReportStatsCardSection = ({ reportData }) => {
  if (!reportData) return null;

  const {
    startBlock,
    startBond,
    BondIncrease,
    endBlock,
    endBond,
    position,
    maxPosition,
    totalRewards,
    tableData,
  } = reportData;

  const totalRewardsRune = totalRewards / 1e8;
  let totalRewardsUsdFromTable = 0;
  if (tableData && Array.isArray(tableData.dollarValue)) {
    totalRewardsUsdFromTable = tableData.dollarValue.reduce(
      (acc, val) => acc + (val || 0),
      0
    );
  }

  const statsItems = [
    {
      icon: StartBlockIcon,
      title: "Start Block",
      stat: startBlock?.toLocaleString(),
    },
    {
      icon: StartBondIcon,
      title: "Start Bond",
      stat: `ᚱ${(startBond / 1e8).toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })}`,
    },
    {
      icon: BondOverTimeIcon,
      title: "Bond Change",
      stat: `ᚱ${(BondIncrease / 1e8).toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })}`,
    },
    {
      icon: EndBlockIcon,
      title: "End Block",
      stat: endBlock?.toLocaleString(),
    },
    {
      icon: EndBondIcon,
      title: "End Bond",
      stat: `ᚱ${(endBond / 1e8).toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })}`,
    },
    {
      icon: PositionAverageIcon,
      title: "Position (Average)",
      stat: position?.toLocaleString(),
    },
    {
      icon: MaxPositionIcon,
      title: "Max Position",
      stat: maxPosition?.toLocaleString(),
    },
    {
      icon: ReportRewardsIcon,
      title: "Total Rewards",
      stat: (
        <InfoPopover
          title="Total Rewards ($)"
          text={`$${totalRewardsUsdFromTable.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}`}
        >
          <span>
            ᚱ
            {totalRewardsRune.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </span>
        </InfoPopover>
      ),
    },
  ];

  return (
    <div className="w-full px-4 my-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

export default ReportStatsCardSection;
