import React, { useContext } from "react";
import { StatsCard, InfoPopover } from "../components";
import { GlobalDataContext } from "../context/GlobalDataContext";

import { BlockIcon, BondIcon, BondOverTimeIcon } from "../assets";

const ReportStatsCardSection = ({ reportData }) => {
  const { globalData } = useContext(GlobalDataContext);

  if (!reportData) return null;

  const {
    startBlock,
    startBond,
    BondIncrease,
    endBlock,
    endBond,
    position,
    totalRewards,
  } = reportData;

  let coingeckoData = {};
  try {
    const arr = JSON.parse(globalData?.coingecko || "[]");
    coingeckoData = arr[0] || {};
  } catch (err) {
    console.error("Error parsing coingecko data:", err);
    coingeckoData = {};
  }

  const currentPrice = coingeckoData.current_price || 0;

  const totalRewardsRune = totalRewards / 1e8;
  const totalRewardsUsd = totalRewardsRune * currentPrice;

  const statsItems = [
    {
      icon: BlockIcon,
      title: "Start Block",
      stat: startBlock?.toLocaleString(),
    },
    {
      icon: BondIcon,
      title: "Start Bond",
      stat: `ᚱ${(startBond / 1e8).toLocaleString()}`,
    },
    {
      icon: BondOverTimeIcon,
      title: "Bond Change",
      stat: `ᚱ${(BondIncrease / 1e8).toLocaleString()}`,
    },
    {
      icon: BondIcon,
      title: "End Block",
      stat: endBlock?.toLocaleString(),
    },
    {
      icon: BondIcon,
      title: "End Bond",
      stat: `ᚱ${(endBond / 1e8).toLocaleString()}`,
    },
    {
      icon: BondIcon,
      title: "Position (Average)",
      stat: position?.toLocaleString(),
    },
    {
      icon: BondIcon,
      title: "Total Rewards",
      stat: (
        <InfoPopover
          title="Dollar Value"
          text={`$${totalRewardsUsd.toLocaleString()}`}
        >
          <span>ᚱ{totalRewardsRune.toLocaleString()}</span>
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
