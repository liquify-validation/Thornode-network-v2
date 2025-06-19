import { Helmet } from "react-helmet";
import {
  StatsCardSection,
  ModernLineChart,
  ModernPieChart,
  Leaderboard,
  LoadingSpinner,
  Modal,
  ModernScatterChart,
} from "../components";

import { useNetworkData } from "../hooks/useNetworkData";
import { useNodeData } from "../hooks/useNodeData";
import { useBondData } from "../hooks/useBondData";
import { useMaxEffectiveStakeData } from "../hooks/useMaxEffectiveStakeData";
import { usePriceData } from "../hooks/usePriceData";

import {
  getISPsDataWithTotal,
  shortenIspData,
} from "../utilities/commonFunctions";
import { useState } from "react";
import { useNodePositionData } from "../hooks/useNodePositionData";

function Home({ isDark }) {
  const [showChartModal, setShowChartModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const {
    data: positionData,
    isLoading: chartLoading,
    error: chartError,
  } = useNodePositionData(selectedAddress);
  const {
    data: netData,
    isLoading: netLoading,
    isError: netError,
    error: netErrObj,
  } = useNetworkData();

  const {
    data: nodeDataResult,
    isLoading: nodeLoading,
    isError: nodeError,
  } = useNodeData(netData);

  const { data: totalBondOverTimeData = [], isLoading: totalBondLoading } =
    useBondData();

  const { data: maxEffectiveStakeData = [], isLoading: maxStakeLoading } =
    useMaxEffectiveStakeData();

  const handleOpenChart = (address) => {
    setSelectedAddress(address);
    setShowChartModal(true);
  };

  const handleCloseChart = () => {
    setShowChartModal(false);
    setSelectedAddress(null);
  };

  const {
    data: priceData = [],
    isLoading: priceLoading,
    isError: priceError,
  } = usePriceData();

  if (netLoading || nodeLoading || priceLoading) {
    return <LoadingSpinner />;
  }
  if (netError) {
    return <div className="text-red-500">Error: {netErrObj.message}</div>;
  }
  if (nodeError) {
    return <div className="text-red-500">Error: {nodeError.message}</div>;
  }
  if (priceError) {
    return <div className="text-red-500">Error: {priceError.message}</div>;
  }

  if (!netData || !nodeDataResult) {
    return <div>No data returned yet.</div>;
  }

  const {
    processedNodes = [],
    countriesData = [],
    maxChainHeights = {},
  } = nodeDataResult;

  const { isps: rawIspData, total: totalISPs } =
    getISPsDataWithTotal(processedNodes);
  const ispData = shortenIspData(rawIspData);

  const renderScatterChart = () => {
    if (!selectedAddress) return <div>No address selected</div>;
    if (chartLoading) return <div>Loading chart...</div>;
    if (chartError)
      return <div className="text-red-400">Error loading chart</div>;
    if (!positionData || positionData.length === 0)
      return <div>No chart data available</div>;

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
    <>
      <Helmet>
        <title>THORChain Network Explorer | Home</title>
        <meta name="description" content="Explore THORChain analytics..." />
      </Helmet>

      <div className="p-4">
        <StatsCardSection netData={netData} nodeData={nodeDataResult} />

        <div className="mt-20 mb-4">
          <h2 className="font-bold text-2xl mx-3">Analytics Overview</h2>
        </div>

        <div className="flex flex-wrap mb-4">
          <div className="w-full lg:w-1/2 px-2 mb-4">
            <ModernLineChart
              data={maxEffectiveStakeData}
              title="Max Effective Stake"
              lineColor="#3086F3"
              gradientStartColor="#3086F3"
              xAxisKey="blockHeight"
              yAxisKey="bondValue"
              yAxisMax={200}
              xAxisLabel="Block Height"
              yAxisLabel="Bond Amount (ᚱ) (Millions)"
              convertToMillions
              isDark={isDark}
            />
          </div>
          <div className="w-full lg:w-1/2 px-2 mb-4">
            <ModernLineChart
              data={totalBondOverTimeData}
              title="Total Bond Over Time"
              lineColor="#28F3B0"
              gradientStartColor="#28F3B0"
              xAxisKey="blockHeight"
              yAxisKey="bondValue"
              yAxisMax={200}
              xAxisLabel="Block Height"
              yAxisLabel="Bond Value (ᚱ) (Millions)"
              convertToMillions
              isDark={isDark}
            />
          </div>
        </div>

        <div className="flex flex-wrap mt-6 mb-4">
          <div className="w-full lg:w-1/2 px-2 mb-4">
            <Leaderboard
              type="top"
              title="Top 5 Performing Nodes"
              isDark={isDark}
              onAnalyticsClick={handleOpenChart}
            />
          </div>
          <div className="w-full lg:w-1/2 px-2 mb-4">
            <Leaderboard
              type="bottom"
              title="Bottom 5 Performing Nodes"
              isDark={isDark}
              onAnalyticsClick={handleOpenChart}
            />
          </div>
        </div>

        {showChartModal && (
          <Modal onClose={handleCloseChart}>{renderScatterChart()}</Modal>
        )}

        {/* Price Chart */}
        <div className="w-full px-2 mb-4">
          <ModernLineChart
            data={priceData}
            title="Price Chart"
            lineColor="#FF5733"
            gradientStartColor="#FF5733"
            xAxisKey="date"
            yAxisKey="price"
            yAxisMax={200}
            xAxisLabel="Date"
            yAxisLabel="Price ($)"
            isDark={isDark}
          />
        </div>

        {/* Leaderboard */}

        <div className="flex flex-wrap mt-6 mb-4 items-stretch">
          <div className="w-full lg:w-1/2 px-2 mb-4 flex flex-col">
            <ModernPieChart
              data={countriesData}
              title="User Locations"
              subtitle="Total Users"
              centerValueMode="sum"
              legendPosition="right"
              showValueInLegend
              disclaimerText="Based on public IP address"
              isDark={isDark}
            />
          </div>

          <div className="w-full lg:w-1/2 px-2 mb-4 flex flex-col">
            <ModernPieChart
              data={ispData}
              title="Internet Service Providers"
              subtitle="ISP's"
              centerValueMode="count"
              legendPosition="right"
              showValueInLegend
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
