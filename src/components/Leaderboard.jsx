import React, { useState } from "react";
import Box from "../ui/Box";
import {
  LoadingSpinner,
  ModernDivider,
  LeaderboardFilter,
  LeaderboardRow,
} from "../components";
import { useHistoricPerformers } from "../hooks/useHistoricPerformers";

const Leaderboard = ({ title, type = "top", isDark, onAnalyticsClick }) => {
  const [churnCount, setChurnCount] = useState(1);

  const {
    data: performerData,
    isLoading,
    isError,
    error,
  } = useHistoricPerformers(churnCount);

  let list = [];
  if (performerData) {
    list = type === "top" ? performerData.topFive : performerData.bottomFive;
  }

  return (
    <Box className="chart-card pt-8 pb-16">
      <div className="m-5">
        <h2 className="font-semibold text-md ml-8">{title}</h2>
        <ModernDivider />

        <div className="flex justify-end mr-8 mb-6">
          <LeaderboardFilter churnCount={churnCount} onChange={setChurnCount} />
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : isError ? (
          <div className="text-red-500 mb-4">Error: {error?.message}</div>
        ) : (
          list.map((address, index) => (
            <LeaderboardRow
              key={address}
              address={address}
              index={index}
              onAnalyticsClick={() => onAnalyticsClick(address)}
            />
          ))
        )}
      </div>
    </Box>
  );
};

export default Leaderboard;
