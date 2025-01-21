import React from "react";
import NetworkStatsCard from "./NetworkStatsCard";

const ChurnStatsCardSection = () => {
  const mockChartData = [
    { value: 100 },
    { value: 200 },
    { value: 150 },
    { value: 250 },
    { value: 300 },
  ];

  const cardsData = [
    {
      title: "Churn #255",
      stats: [
        { subtitle: "Block", value: "5277/43,200" },
        { subtitle: "Progress", value: "12%" },
        { subtitle: "Retries", value: "0" },
      ],
      chartData: mockChartData,
    },
    {
      title: "Start",
      stats: [
        { subtitle: "Height", value: "17,571,578" },
        { subtitle: "Event", value: "Thu, Sep 05, 2024, 09:03 PM" },
        { subtitle: "Duration", value: "8 hours, 52 minutes, 33 seconds" },
        { subtitle: "Validated Blocks", value: "5315" },
      ],
      chartData: mockChartData,
    },
    {
      title: "Finish",
      stats: [
        { subtitle: "Height", value: "17,614,778" },
        { subtitle: "Event", value: "Sun, Sep 08, 2024, 10:36 PM" },
        { subtitle: "Duration", value: "2 days, 16 hours, 39 minute" },
        { subtitle: "Pending Blocks", value: "37,869" },
      ],
      chartData: mockChartData,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-24">
      {cardsData.map((card, index) => (
        <NetworkStatsCard
          key={index}
          title={card.title}
          stats={card.stats}
          chartData={card.chartData}
        />
      ))}
    </div>
  );
};

export default ChurnStatsCardSection;
