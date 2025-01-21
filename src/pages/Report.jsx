import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  ReportTable,
  BackButton,
  ReportFilter,
  ReportStatsCardSection,
  ModernLineChart,
  ExportButtons,
  ModernScatterChart,
} from "../components";
import { transformGraphData } from "../utilities/commonFunctions";

function Report() {
  const { thornodeAddress } = useParams();
  const [reportData, setReportData] = useState(null);

  function handleReportGenerated(data) {
    console.log("Report data from API:", data);
    setReportData(data);
  }

  function getTableRows() {
    if (!reportData || !reportData.tableData) return [];
    const { churnHeight, date, rewards, price, dollarValue } =
      reportData.tableData;
    return churnHeight.map((height, idx) => ({
      height,
      date: date[idx],
      price: parseFloat(price[idx]).toFixed(2),
      rewardRune: rewards[idx]?.toFixed(2),
      rewardUSD: dollarValue[idx]?.toFixed(2),
    }));
  }

  const chartData = reportData?.graphData
    ? transformGraphData(reportData.graphData)
    : [];

  return (
    <>
      <Helmet>
        <title>THORChain Network Explorer | Reports</title>
        <meta
          name="description"
          content="Generate detailed THORChain node reports, including bond over time, performance, and rewards."
        />
        <meta
          name="keywords"
          content="THORChain, node report, bond, performance, crypto analytics"
        />
      </Helmet>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl text-white font-bold">Report</h1>
          <BackButton />
        </div>

        <div className="flex items-center mt-8">
          <span className="bg-[#FFFFFC] text-black px-3 py-2 rounded-l-xl font-bold">
            Generate Report for Address:
          </span>
          <span className="inner-glass-effect px-3 py-2 text-white break-all rounded-r-xl">
            {thornodeAddress}
          </span>
        </div>

        <ReportFilter
          thornodeAddress={thornodeAddress}
          onReportGenerated={handleReportGenerated}
        />

        <div className="mx-24 mt-20">
          {reportData && (
            <>
              <ReportStatsCardSection reportData={reportData} />
              <ReportTable data={getTableRows()} />
              <div className="mt-10 mb-10">
                <ExportButtons
                  getTableRows={getTableRows}
                  fileName={`report_${thornodeAddress}`}
                />
              </div>
            </>
          )}

          {reportData?.graphData && (
            <div className="mt-8 space-y-6">
              <ModernLineChart
                data={chartData}
                title="Bond Over Time"
                lineColor="#3086F3"
                gradientStartColor="#3086F3"
                xAxisKey="blockHeight"
                yAxisKey="bond"
                xAxisLabel="Block Height"
                yAxisLabel="Bond"
              />

              {/* <ModernLineChart
                data={chartData}
                title="Performance Over Time"
                lineColor="#FFAE4C"
                gradientStartColor="#FFAE4C"
                xAxisKey="blockHeight"
                yAxisKey="position"
                xAxisLabel="Block Height"
                yAxisLabel="Position"
                lines={[
                  {
                    dataKey: "position",
                    name: "Position",
                    strokeColor: "#F2AA3B",
                    gradientStartColor: "#F2AA3B",
                  },
                  {
                    dataKey: "maxPosition",
                    name: "Max Position",
                    strokeColor: "#C45985",
                    gradientStartColor: "#C45985",
                  },
                ]}
              /> */}
              <ModernScatterChart
                data={chartData}
                title="Positions Over Time"
                xAxisKey="blockHeight"
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
              />

              <ModernLineChart
                data={chartData}
                title="Rewards Over Time"
                lineColor="#C45985"
                gradientStartColor="#C45985"
                xAxisKey="blockHeight"
                yAxisKey="rewards"
                xAxisLabel="Block Height"
                yAxisLabel="Rewards"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Report;
