import React, { useContext } from "react";
import {
  ScrollableStatsCardsSection,
  ModernLineChart,
  ModernPieChart,
  Leaderboard,
} from "../components";
import { Helmet } from "react-helmet";
import {
  maxEffectiveBondData,
  totalBondOverTimeData,
  priceChartData,
  ispData,
  topNodes,
  bottomNodes,
} from "../constants/data";
import { GlobalDataContext } from "../context/GlobalDataContext";
import { getCountriesData } from "../services/dataService";

// TO DO Add filter nodes with popover date section

function Analytics() {
  const { nodesData } = useContext(GlobalDataContext);

  const locationData = getCountriesData(nodesData);

  return (
    <>
      <Helmet>
        <title>THORChain Network Explorer | Analytics</title>
        <meta
          name="description"
          content="Dive into analytics for THORChain node bonding, location distribution, ISP usage, and more."
        />
        <meta
          name="keywords"
          content="THORChain, analytics, bonding, crypto, location stats"
        />
      </Helmet>
      <div className="p-4">
        <ScrollableStatsCardsSection />
        <div className="mt-20 mb-4">
          <h2 className="font-bold text-2xl mx-3">Analytics</h2>
        </div>
        <div className="mt-8 mb-8"></div>

        <div className="flex flex-wrap mt-6 mb-4">
          <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
            <ModernPieChart
              data={locationData}
              title="User Locations"
              subtitle="Total Users"
              centerValueMode="sum"
            />
          </div>
          <div className="w-full md:w-1/2 px-2">
            <ModernPieChart
              data={ispData}
              title="Internet Service Providers"
              subtitle="ISP's"
              centerValueMode="sum"
            />
          </div>
        </div>

        <div className="flex flex-wrap mb-4">
          <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
            <ModernLineChart
              data={maxEffectiveBondData}
              title="Max Effective Bond"
              lineColor="#3086F3"
              gradientStartColor="#3086F3"
              xAxisKey="blockHeight"
              yAxisKey="bondValue"
              yAxisMax={200}
              xAxisLabel="Block Height"
              yAxisLabel="Bond Value"
            />
          </div>
          <div className="w-full md:w-1/2 px-2">
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

        <div className="flex flex-wrap mb-4">
          <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
            <ModernLineChart
              data={maxEffectiveBondData}
              title="Reward Amount Over Time"
              lineColor="#FFAE4C"
              gradientStartColor="#FFAE4C"
              xAxisKey="blockHeight"
              yAxisKey="bondValue"
              yAxisMax={200}
              xAxisLabel="Block Height"
              yAxisLabel="Reward Value"
            />
          </div>
          <div className="w-full md:w-1/2 px-2">
            <ModernLineChart
              data={totalBondOverTimeData}
              title="Slashes Amount Over Time"
              lineColor="#C45985"
              gradientStartColor="#C45985"
              xAxisKey="blockHeight"
              yAxisKey="bondValue"
              yAxisMax={200}
              xAxisLabel="Block Height"
              yAxisLabel="Slashes Value"
            />
          </div>
        </div>

        <div className="w-full px-2">
          <ModernLineChart
            data={priceChartData}
            title="Price Chart"
            lineColor="#FF5733"
            gradientStartColor="#FF5733"
            xAxisKey="blockHeight"
            yAxisKey="bondValue"
            yAxisMax={200}
            xAxisLabel="Block Height"
            yAxisLabel="Price"
          />
        </div>
        <div className="flex flex-wrap mt-6 mb-4">
          <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
            <Leaderboard title="Top 5 Performing Nodes" data={topNodes} />
          </div>
          <div className="w-full md:w-1/2 px-2">
            <Leaderboard title="Bottom 5 Performing Nodes" data={bottomNodes} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Analytics;
