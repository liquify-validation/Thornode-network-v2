import React, { useState } from "react";
import { Helmet } from "react-helmet";
import {
  StatsCardSection,
  ModernLineChart,
  ModernPieChart,
  Leaderboard,
  LoadingSpinner,
} from "../components";

import { useHistoricPerformers } from "../hooks/useHistoricPerformers";
import { useNetworkData } from "../hooks/useNetworkData";
import { useNodeData } from "../hooks/useNodeData";
import { useBondData } from "../hooks/useBondData";
import { useMaxEffectiveStakeData } from "../hooks/useMaxEffectiveStakeData";
import { usePriceData } from "../hooks/usePriceData";

import {
  getISPsDataWithTotal,
  shortenIspData,
} from "../utilities/commonFunctions";

function Home() {
  const [churnCount, setChurnCount] = useState(1);

  const {
    data: netData,
    isLoading: netLoading,
    isError: netError,
    error: netErrObj,
  } = useNetworkData();

  const {
    data: nodeData,
    isLoading: nodeLoading,
    isError: nodeError,
    error: nodeErrObj,
  } = useNodeData();

  const {
    data: totalBondOverTimeData = [],
    isLoading: totalBondLoading,
    isError: totalBondError,
  } = useBondData();

  const {
    data: maxEffectiveStakeData = [],
    isLoading: maxStakeLoading,
    isError: maxStakeError,
  } = useMaxEffectiveStakeData();

  const {
    data: performerData,
    isLoading,
    isError,
    error,
  } = useHistoricPerformers(churnCount);

  const {
    data: priceData = [],
    isLoading: priceLoading,
    isError: priceError,
    error: priceErrObj,
  } = usePriceData();

  if (netLoading || nodeLoading) return <LoadingSpinner />;
  if (netError)
    return <div className="text-red-500">Error: {netErrObj.message}</div>;
  if (nodeError)
    return <div className="text-red-500">Error: {nodeErrObj.message}</div>;
  if (priceError)
    return <div className="text-red-500">Error: {priceErrObj.message}</div>;

  if (!netData || !nodeData) {
    return <div>No data returned yet.</div>;
  }

  const { processedNodes, countriesData } = nodeData;
  const locationData = countriesData;

  const { isps: rawIspData, total: totalISPs } =
    getISPsDataWithTotal(processedNodes);
  const ispData = shortenIspData(rawIspData);

  console.log("isp data", ispData);

  return (
    <>
      <Helmet>
        <title>THORChain Network Explorer | Home</title>
        <meta
          name="description"
          content="Explore THORChain analytics, charts, and node performance data on our Home page."
        />
        <meta
          name="keywords"
          content="THORChain, analytics, node data, crypto, DeFi"
        />
      </Helmet>

      <div className="p-4">
        <StatsCardSection netData={netData} nodeData={nodeData} />

        <div className="mt-20 mb-4">
          <h2 className="font-bold text-2xl mx-3">Analytics Overview</h2>
        </div>
        <div className="mt-8 mb-8"></div>

        {/* Pie Charts */}
        <div className="flex flex-wrap mt-6 mb-4 items-stretch">
          <div className="w-full lg:w-1/2 px-2 mb-4 flex flex-col">
            <ModernPieChart
              data={locationData}
              title="User Locations"
              subtitle="Total Users"
              centerValueMode="sum"
              legendPosition="right"
              showValueInLegend
              disclaimerText="Based on public IP address"
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

        {/* Max Effective Stake & Total Bond Over Time */}
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
              yAxisLabel="Stake Amount"
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
              yAxisLabel="Bond Value"
            />
          </div>
        </div>

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
            yAxisLabel="Price"
          />
        </div>

        {/* Leaderboard */}
        <div className="flex flex-wrap mt-6 mb-4">
          <div className="w-full lg:w-1/2 px-2 mb-4">
            <Leaderboard type="top" title="Top 5 Performing Nodes" />
          </div>
          <div className="w-full lg:w-1/2 px-2 mb-4">
            <Leaderboard type="bottom" title="Bottom 5 Performing Nodes" />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
