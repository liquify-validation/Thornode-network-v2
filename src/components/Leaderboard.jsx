import React, { useState } from "react";
import Box from "../ui/Box";
import {
  LoadingSpinner,
  ModernDivider,
  Modal,
  ModernScatterChart,
} from "../components";
import LeaderboardFilter from "./LeaderboardFilter";
import { useHistoricPerformers } from "../hooks/useHistoricPerformers";
import LeaderboardRow from "./LeaderboardRow";
// Import the position data hook
import { useNodePositionData } from "../hooks/useNodePositionData";

const Leaderboard = ({ title, type = "top", isDark }) => {
  const [churnCount, setChurnCount] = useState(1);
  const [showChartModal, setShowChartModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const {
    data: performerData,
    isLoading,
    isError,
    error,
  } = useHistoricPerformers(churnCount);

  const {
    data: positionData,
    isLoading: chartLoading,
    isError: chartError,
  } = useNodePositionData(selectedAddress);

  let list = [];
  if (performerData) {
    list = type === "top" ? performerData.topFive : performerData.bottomFive;
  }

  const handleOpenChart = (address) => {
    setSelectedAddress(address);
    setShowChartModal(true);
  };

  const handleCloseChart = () => {
    setShowChartModal(false);
    setSelectedAddress(null);
  };

  const renderChartContent = () => {
    if (!selectedAddress) {
      return <div>No address selected</div>;
    }
    if (chartLoading) {
      return <LoadingSpinner />;
    }
    if (chartError) {
      return <div className="text-red-400">Error loading chart data</div>;
    }
    if (!positionData || positionData.length === 0) {
      return <div>No chart data available</div>;
    }

    return (
      <ModernScatterChart
        data={positionData}
        title={`Positions Over Time for ${selectedAddress}`}
        xAxisKey="blockHeight"
        yAxisKey="position"
        scatterPoints={[
          {
            dataKey: "position",
            name: "Position",
            fillColor: "#F2AA3B",
            shape: "circle",
          },
          {
            dataKey: "maxPosition",
            name: "Max Position",
            fillColor: "#C45985",
            shape: "circle",
          },
        ]}
        xAxisLabel="Block Height"
        yAxisLabel="Position"
        isDark={isDark}
      />
    );
  };

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
              onAnalyticsClick={() => handleOpenChart(address)}
            />
          ))
        )}
      </div>

      {showChartModal && (
        <Modal onClose={handleCloseChart}>{renderChartContent()}</Modal>
      )}
    </Box>
  );
};

export default Leaderboard;
