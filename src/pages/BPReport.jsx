import React, { useState, useMemo, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { useSearchParams } from "react-router-dom";
import {
  BackButton,
  LoadingSpinner,
  ModernLineChart,
  ExportButtons,
} from "../components";
import Box from "../ui/Box";
import StatsCard from "../components/StatsCard";
import {
  useGenerateBPReport,
  useBPsForNode,
} from "../hooks/useGenerateBPReport";
import { useChurnsForNode } from "../hooks/useChurnsForNode";
import {
  StartBlockIcon,
  EndBlockIcon,
  StartBondIcon,
  EndBondIcon,
  BondOverTimeIcon,
  ReportRewardsIcon,
  PositionAverageIcon,
  BlockIcon,
} from "../assets";

function BPReport({ isDark }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [nodeAddress, setNodeAddress] = useState(searchParams.get("node") || "");
  const [submittedNode, setSubmittedNode] = useState(searchParams.get("node") || "");
  const [selectedBP, setSelectedBP] = useState(searchParams.get("bp") || "");
  const [fromBlock, setFromBlock] = useState(searchParams.get("start") || "");
  const [toBlock, setToBlock] = useState(searchParams.get("end") || "");
  const [reportData, setReportData] = useState(null);

  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);
  const [isBPOpen, setIsBPOpen] = useState(false);

  const autoSubmitDone = useRef(false);

  const {
    data: bpList = [],
    isLoading: bpLoading,
    isError: bpError,
  } = useBPsForNode(submittedNode);

  const {
    data: churns = [],
    isLoading: churnsLoading,
  } = useChurnsForNode(submittedNode);

  const {
    mutate: generateReport,
    isLoading: generating,
  } = useGenerateBPReport();

  // Auto-generate report when loaded from URL params
  useEffect(() => {
    if (autoSubmitDone.current) return;
    const urlNode = searchParams.get("node");
    const urlBP = searchParams.get("bp");
    const urlStart = searchParams.get("start");
    const urlEnd = searchParams.get("end");

    if (urlNode && urlBP && urlStart && urlEnd && !bpLoading && !churnsLoading) {
      autoSubmitDone.current = true;
      generateReport(
        {
          start: Number(urlStart),
          end: Number(urlEnd),
          node: urlNode,
          bp: urlBP,
        },
        {
          onSuccess: (result) => setReportData(result),
          onError: (err) => alert(`Failed to generate report: ${err.message}`),
        }
      );
    }
  }, [searchParams, bpLoading, churnsLoading, generateReport]);

  const possibleToChurns = useMemo(() => {
    if (!churns.length || !fromBlock) return churns;
    return churns.filter((c) => Number(c.churnHeight) > Number(fromBlock));
  }, [churns, fromBlock]);

  function handleLookup() {
    if (!nodeAddress.trim()) return;
    setSubmittedNode(nodeAddress.trim());
    setSelectedBP("");
    setFromBlock("");
    setToBlock("");
    setReportData(null);
  }

  function handleSubmit() {
    if (!selectedBP || !fromBlock || !toBlock) {
      alert("Please select a bond provider and both block heights.");
      return;
    }

    setSearchParams({
      node: submittedNode,
      bp: selectedBP,
      start: fromBlock,
      end: toBlock,
    });

    generateReport(
      {
        start: Number(fromBlock),
        end: Number(toBlock),
        node: submittedNode,
        bp: selectedBP,
      },
      {
        onSuccess: (result) => setReportData(result),
        onError: (err) => alert(`Failed to generate report: ${err.message}`),
      }
    );
  }

  function getTableRows() {
    if (!reportData?.tableData) return [];
    const td = reportData.tableData;
    return td.churnHeight.map((height, idx) => ({
      height,
      date: td.date?.[idx] || "",
      bpBond: (td.bpBond?.[idx] || 0) / 1e8,
      bpRatio: td.bpRatio?.[idx] || 0,
      bpReward: (td.bpReward?.[idx] || 0) / 1e8,
      bpRewardDollar: td.bpRewardDollar?.[idx] || 0,
    }));
  }

  function transformBPGraphData() {
    if (!reportData?.graphData) return [];
    const gd = reportData.graphData;
    return gd.Xticks.map((block, idx) => ({
      blockHeight: block,
      bpBond: (gd.bpBond?.[idx] || 0) / 1e8,
      bpRatio: gd.bpRatio?.[idx] || 0,
      bpReward: (gd.bpReward?.[idx] || 0) / 1e8,
      nodeReward: (gd.nodeReward?.[idx] || 0) / 1e8,
      totalBond: (gd.totalBond?.[idx] || 0) / 1e8,
    }));
  }

  const chartData = transformBPGraphData();
  const tableRows = getTableRows();

  return (
    <>
      <Helmet>
        <title>THORChain Network Explorer | BP Report</title>
        <meta
          name="description"
          content="Generate bond provider earnings reports for any BP on any THORChain node."
        />
      </Helmet>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl text-gray-800 dark:text-white font-bold">
            Bond Provider Report
          </h1>
          <BackButton />
        </div>

        {/* Node Address Input */}
        <div className="flex items-center mt-8 gap-2">
          <div className="flex items-center flex-1">
            <span className="bg-gray-800 dark:bg-[#FFFFFC] text-gray-50 dark:text-black px-3 py-2 rounded-l-xl font-bold whitespace-nowrap">
              Node Address:
            </span>
            <input
              type="text"
              value={nodeAddress}
              onChange={(e) => setNodeAddress(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLookup()}
              placeholder="thor1..."
              className="inner-glass-effect px-3 py-2 text-gray-800 dark:text-white flex-1 outline-none
                placeholder-gray-400 focus:ring-2 focus:ring-[#28f3b0]/50"
            />
          </div>
          <button
            onClick={handleLookup}
            className="bg-gray-900 dark:bg-[#28f3b0] text-gray-50 dark:text-black px-4 py-2
              rounded-xl hover:shadow-md focus:outline-none font-semibold"
          >
            Lookup
          </button>
        </div>

        {/* BP + Churn selectors */}
        {submittedNode && (
          <div className="flex flex-wrap items-center gap-4 mt-6">
            {/* BP Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsBPOpen(!isBPOpen);
                  setIsFromOpen(false);
                  setIsToOpen(false);
                }}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-[#17364CCC] text-white hover:bg-[#17364ce0] focus:outline-none"
              >
                {selectedBP
                  ? `BP: ${selectedBP.slice(0, 10)}...${selectedBP.slice(-6)}`
                  : "Select Bond Provider"}
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M19 9l-7 7-7-7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {isBPOpen && (
                <div className="absolute z-10 mt-2 w-80 bg-[#17364CCC] text-white rounded-lg shadow-lg">
                  <ul className="scrollbar-custom max-h-64 overflow-auto">
                    {bpLoading && (
                      <li className="px-4 py-2 text-sm">Loading...</li>
                    )}
                    {bpError && (
                      <li className="px-4 py-2 text-sm text-red-400">
                        Error loading BPs
                      </li>
                    )}
                    {!bpLoading &&
                      bpList.map((bp) => (
                        <li key={bp.bond_address}>
                          <button
                            type="button"
                            className="block rounded-none w-full text-left px-4 py-2 text-sm hover:bg-[#1E4860]"
                            onClick={() => {
                              setSelectedBP(bp.bond_address);
                              setIsBPOpen(false);
                            }}
                          >
                            <span className="font-mono">
                              {bp.bond_address.slice(0, 12)}...
                              {bp.bond_address.slice(-8)}
                            </span>
                            <span className="ml-2 text-gray-400">
                              ({bp.churnsPresent} churns)
                            </span>
                          </button>
                        </li>
                      ))}
                    {!bpLoading && bpList.length === 0 && (
                      <li className="px-4 py-2 text-sm text-gray-400">
                        No bond providers found
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* From Block */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsFromOpen(!isFromOpen);
                  setIsToOpen(false);
                  setIsBPOpen(false);
                }}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-[#17364CCC] text-white hover:bg-[#17364ce0] focus:outline-none"
              >
                {fromBlock
                  ? `From: Block ${fromBlock}`
                  : "From (Start Block)"}
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M19 9l-7 7-7-7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {isFromOpen && (
                <div className="absolute z-10 mt-2 w-52 bg-[#17364CCC] text-white rounded-lg shadow-lg">
                  <ul className="scrollbar-custom max-h-64 overflow-auto">
                    {churnsLoading && (
                      <li className="px-4 py-2 text-sm">Loading...</li>
                    )}
                    {churns.map((c) => (
                      <li key={c.churnHeight}>
                        <button
                          type="button"
                          className="block rounded-none w-full text-left px-4 py-2 text-sm hover:bg-[#1E4860]"
                          onClick={() => {
                            setFromBlock(String(c.churnHeight));
                            setIsFromOpen(false);
                            if (Number(toBlock) <= Number(c.churnHeight)) {
                              setToBlock("");
                            }
                          }}
                        >
                          Block {c.churnHeight} ({c.date})
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* To Block */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsToOpen(!isToOpen);
                  setIsFromOpen(false);
                  setIsBPOpen(false);
                }}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-[#17364CCC] text-white hover:bg-[#17364ce0] focus:outline-none"
              >
                {toBlock ? `To: Block ${toBlock}` : "To (End Block)"}
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M19 9l-7 7-7-7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {isToOpen && (
                <div className="absolute z-10 mt-2 w-52 bg-[#17364CCC] text-white rounded-lg shadow-lg">
                  <ul className="scrollbar-custom max-h-64 overflow-auto">
                    {possibleToChurns.map((c) => (
                      <li key={c.churnHeight}>
                        <button
                          type="button"
                          className="block rounded-none w-full text-left px-4 py-2 text-sm hover:bg-[#1E4860]"
                          onClick={() => {
                            setToBlock(String(c.churnHeight));
                            setIsToOpen(false);
                          }}
                        >
                          Block {c.churnHeight} ({c.date})
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={generating}
              className="bg-gray-900 dark:bg-[#28f3b0] text-gray-50 dark:text-black px-4 py-2
                rounded hover:shadow-md focus:outline-none font-semibold"
            >
              {generating ? "Generating..." : "Generate BP Report"}
            </button>
          </div>
        )}

        {/* Loading */}
        {generating && (
          <div className="flex items-center justify-center h-48 mt-8">
            <LoadingSpinner />
          </div>
        )}

        {/* Results */}
        {reportData && !generating && (
          <div className="mx-0 lg:mx-12 mt-12">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatsCard
                icon={StartBlockIcon}
                title="Start Block"
                stat={reportData.startBlock?.toLocaleString() || "—"}
              />
              <StatsCard
                icon={EndBlockIcon}
                title="End Block"
                stat={reportData.endBlock?.toLocaleString() || "—"}
              />
              <StatsCard
                icon={StartBondIcon}
                title="Start BP Bond"
                stat={`${(
                  (reportData.startBPBond || 0) / 1e8
                ).toLocaleString(undefined, { maximumFractionDigits: 2 })} RUNE`}
              />
              <StatsCard
                icon={EndBondIcon}
                title="End BP Bond"
                stat={`${(
                  (reportData.endBPBond || 0) / 1e8
                ).toLocaleString(undefined, { maximumFractionDigits: 2 })} RUNE`}
              />
              <StatsCard
                icon={BondOverTimeIcon}
                title="BP Bond Change"
                stat={`${(
                  (reportData.bpBondChange || 0) / 1e8
                ).toLocaleString(undefined, { maximumFractionDigits: 2 })} RUNE`}
              />
              <StatsCard
                icon={PositionAverageIcon}
                title="Avg BP Ratio"
                stat={`${((reportData.avgBPRatio || 0) * 100).toFixed(2)}%`}
              />
              <StatsCard
                icon={BlockIcon}
                title="Churns Tracked"
                stat={String(reportData.churnsTracked || 0)}
              />
              <StatsCard
                icon={ReportRewardsIcon}
                title="Total BP Reward"
                stat={`${tableRows
                  .reduce((sum, r) => sum + r.bpReward, 0)
                  .toLocaleString(undefined, { maximumFractionDigits: 2 })} RUNE`}
              />
            </div>

            {/* Table */}
            <Box className="overflow-x-auto mb-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left px-4 py-3 text-sm font-bold uppercase text-gray-700 dark:text-white">
                      Date
                    </th>
                    <th className="text-right px-4 py-3 text-sm font-bold uppercase text-gray-700 dark:text-white">
                      Churn Height
                    </th>
                    <th className="text-right px-4 py-3 text-sm font-bold uppercase text-gray-700 dark:text-white">
                      BP Bond
                    </th>
                    <th className="text-right px-4 py-3 text-sm font-bold uppercase text-gray-700 dark:text-white">
                      BP Ratio (%)
                    </th>
                    <th className="text-right px-4 py-3 text-sm font-bold uppercase text-gray-700 dark:text-white">
                      BP Reward
                    </th>
                    <th className="text-right px-4 py-3 text-sm font-bold uppercase text-gray-700 dark:text-white">
                      Reward ($)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        {row.date}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-300">
                        {Number(row.height).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-300">
                        {Number(row.bpBond).toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-300">
                        {Number(row.bpRatio).toFixed(2)}%
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-[#28f3b0]">
                        {Number(row.bpReward).toLocaleString(undefined, {
                          maximumFractionDigits: 4,
                        })}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-300">
                        $
                        {Number(row.bpRewardDollar).toLocaleString(undefined, {
                          maximumFractionDigits: 4,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>

            {/* Export */}
            <div className="mb-10">
              <ExportButtons
                getTableRows={getTableRows}
                fileName={`bp_report_${submittedNode}_${selectedBP}`}
              />
            </div>

            {/* Charts */}
            {chartData.length > 0 && (
              <div className="space-y-6">
                <ModernLineChart
                  data={chartData}
                  title="BP Bond Over Time"
                  lineColor="#3086F3"
                  gradientStartColor="#3086F3"
                  xAxisKey="blockHeight"
                  yAxisKey="bpBond"
                  xAxisLabel="Block Height"
                  yAxisLabel="BP Bond"
                  isDark={isDark}
                />

                <ModernLineChart
                  data={chartData}
                  title="BP Ratio Over Time"
                  lineColor="#FFAE4C"
                  gradientStartColor="#FFAE4C"
                  xAxisKey="blockHeight"
                  yAxisKey="bpRatio"
                  xAxisLabel="Block Height"
                  yAxisLabel="BP Ratio"
                  isDark={isDark}
                />

                <ModernLineChart
                  data={chartData}
                  title="BP Reward Per Churn"
                  lineColor="#C45985"
                  gradientStartColor="#C45985"
                  xAxisKey="blockHeight"
                  yAxisKey="bpReward"
                  xAxisLabel="Block Height"
                  yAxisLabel="BP Reward"
                  isDark={isDark}
                />

                <ModernLineChart
                  data={chartData}
                  title="Node Reward vs BP Reward"
                  lines={[
                    {
                      dataKey: "nodeReward",
                      name: "Node Reward",
                      strokeColor: "#3086F3",
                      gradientStartColor: "#3086F3",
                    },
                    {
                      dataKey: "bpReward",
                      name: "BP Reward",
                      strokeColor: "#28f3b0",
                      gradientStartColor: "#28f3b0",
                    },
                  ]}
                  xAxisKey="blockHeight"
                  xAxisLabel="Block Height"
                  yAxisLabel="Reward"
                  isDark={isDark}
                />

                <ModernLineChart
                  data={chartData}
                  title="Total Bond Over Time"
                  lineColor="#8B5CF6"
                  gradientStartColor="#8B5CF6"
                  xAxisKey="blockHeight"
                  yAxisKey="totalBond"
                  xAxisLabel="Block Height"
                  yAxisLabel="Total Bond"
                  isDark={isDark}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default BPReport;
