import React from "react";
import StatsCard from "./StatsCard";
import {
  ChurnTimeUntilIcon,
  RewardsIcon,
  NodesIcon,
  BondOverTimeIcon,
  AverageSlashesIcon,
  BondDeltaIcon,
} from "../assets";
import { getChurnTitle, getTimeToDisplay } from "../utilities/commonFunctions";

const ScrollableStatsCardSection = () => {
  const statsItems = [
    {
      icon: ChurnTimeUntilIcon,
      title: "(Churn) Time Until",
      stat: "12h 34m",
    },
    {
      icon: RewardsIcon,
      title: "Total Rewards",
      stat: `ᚱ${(123456).toLocaleString()}`,
    },
    {
      icon: RewardsIcon,
      title: "AVG Reward",
      stat: `ᚱ${(1234).toLocaleString()}`,
    },
    {
      icon: NodesIcon,
      title: "AVG Number of Nodes",
      stat: (100).toLocaleString(),
    },
    {
      icon: BondOverTimeIcon,
      title: "Total Bond Over Time",
      stat: `ᚱ${(5000000).toLocaleString()}`,
    },
    {
      icon: AverageSlashesIcon,
      title: "AVG Slashes per 100 blocks",
      stat: (5).toLocaleString(),
    },
    {
      icon: BondDeltaIcon,
      title: "Bond Delta Start & End",
      stat: `ᚱ${(50000).toLocaleString()}`,
    },
  ];

  return (
    <div className="w-full px-4 overflow-x-auto">
      <div className="flex space-x-4">
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

export default ScrollableStatsCardSection;
