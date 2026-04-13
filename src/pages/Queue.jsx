/* eslint-disable react/prop-types */
import { useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { LoadingSpinner, Tabs } from "../components";
import Box from "../ui/Box";
import StatsCard from "../components/StatsCard";
import {
  useQueueData,
  useQueueOutbound,
  useQueueScheduled,
} from "../hooks/useQueueData";
import { useStreamingSwaps, useSwapStats } from "../hooks/useSwapsData";
import { BlockIcon, BondIcon, NodesIcon } from "../assets";

const QUEUE_TABS = [
  { value: "summary", label: "Summary" },
  { value: "outbound", label: "Outbound" },
  { value: "scheduled", label: "Scheduled" },
  { value: "streaming", label: "Streaming" },
];

function TxTable({ transactions, type }) {
  const txList = useMemo(() => {
    if (!transactions) return [];
    if (Array.isArray(transactions)) return transactions;
    try {
      return JSON.parse(transactions);
    } catch {
      return [];
    }
  }, [transactions]);

  if (txList.length === 0) {
    return (
      <Box className="p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          No {type} transactions in queue.
        </p>
      </Box>
    );
  }

  return (
    <Box className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left px-4 py-3 text-sm font-bold uppercase text-gray-700 dark:text-white">
              To Address
            </th>
            <th className="text-left px-4 py-3 text-sm font-bold uppercase text-gray-700 dark:text-white">
              Coin
            </th>
            <th className="text-right px-4 py-3 text-sm font-bold uppercase text-gray-700 dark:text-white">
              Amount
            </th>
            <th className="text-right px-4 py-3 text-sm font-bold uppercase text-gray-700 dark:text-white">
              Max Gas
            </th>
            <th className="text-right px-4 py-3 text-sm font-bold uppercase text-gray-700 dark:text-white">
              Height
            </th>
          </tr>
        </thead>
        <tbody>
          {txList.map((tx, idx) => {
            const coin = tx.coin || {};
            const asset = coin.asset || "--";
            const chain = asset.split(".")[0] || asset;
            const amount = coin.amount
              ? (Number(coin.amount) / 1e8).toLocaleString(undefined, {
                  maximumFractionDigits: 4,
                })
              : "--";

            const maxGas = tx.max_gas?.[0];
            const gasAmount = maxGas?.amount
              ? (Number(maxGas.amount) / 1e8).toLocaleString(undefined, {
                  maximumFractionDigits: 6,
                })
              : "--";

            const toAddr = tx.to_address || "--";
            const shortAddr =
              toAddr.length > 20
                ? `${toAddr.slice(0, 10)}...${toAddr.slice(-8)}`
                : toAddr;

            return (
              <tr
                key={idx}
                className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                <td className="px-4 py-3 text-sm font-mono text-gray-700 dark:text-gray-300">
                  {shortAddr}
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white">
                  {chain}
                </td>
                <td className="px-4 py-3 text-sm text-right text-[#28f3b0]">
                  {amount}
                </td>
                <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-300">
                  {gasAmount}
                </td>
                <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-300">
                  {tx.height ? Number(tx.height).toLocaleString() : "--"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Box>
  );
}

function formatUsd(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "--";
  return `$${num.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  })}`;
}

function formatBaseAmount(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "--";
  return (num / 1e8).toLocaleString(undefined, {
    maximumFractionDigits: 4,
  });
}

function shortenAddress(value) {
  if (!value) return "--";
  return value.length > 20
    ? `${value.slice(0, 10)}...${value.slice(-8)}`
    : value;
}

function formatStreamingProgress(stream) {
  const completed = Number(stream.count || 0);
  const quantity = Number(stream.quantity || 0);

  if (!Number.isFinite(quantity) || quantity <= 0) {
    return Number.isFinite(completed) ? String(completed) : "--";
  }

  return `${completed}/${quantity}`;
}

function StreamingSwapsTable({ data }) {
  const swaps = Array.isArray(data?.swaps) ? data.swaps : [];

  if (swaps.length === 0) {
    return (
      <Box className="p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          No live streaming swaps right now.
        </p>
      </Box>
    );
  }

  return (
    <Box className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left px-4 py-3 text-sm font-bold uppercase text-gray-700 dark:text-white">
              Route
            </th>
            <th className="text-left px-4 py-3 text-sm font-bold uppercase text-gray-700 dark:text-white">
              Destination
            </th>
            <th className="text-right px-4 py-3 text-sm font-bold uppercase text-gray-700 dark:text-white">
              Progress
            </th>
            <th className="text-right px-4 py-3 text-sm font-bold uppercase text-gray-700 dark:text-white">
              Deposit
            </th>
            <th className="text-right px-4 py-3 text-sm font-bold uppercase text-gray-700 dark:text-white">
              Out
            </th>
            <th className="text-right px-4 py-3 text-sm font-bold uppercase text-gray-700 dark:text-white">
              Interval
            </th>
          </tr>
        </thead>
        <tbody>
          {swaps.map((swap) => (
            <tr
              key={swap.tx_id}
              className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                <div className="font-semibold text-gray-800 dark:text-white">
                  {swap.source_asset || "--"}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  to {swap.target_asset || "--"}
                </div>
              </td>
              <td
                className="px-4 py-3 text-sm font-mono text-gray-600 dark:text-gray-300"
                title={swap.destination}
              >
                {shortenAddress(swap.destination)}
              </td>
              <td className="px-4 py-3 text-sm text-right text-[#28f3b0] font-semibold">
                {formatStreamingProgress(swap)}
              </td>
              <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-300">
                {formatBaseAmount(swap.deposit)}
              </td>
              <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-300">
                {formatBaseAmount(swap.out)}
              </td>
              <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-300">
                {swap.interval != null
                  ? Number(swap.interval).toLocaleString()
                  : "--"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
}

function Queue() {
  const [currentTab, setCurrentTab] = useState("summary");

  const {
    data: queueData,
    isLoading: queueLoading,
    error: queueError,
  } = useQueueData();
  const {
    data: outbound,
    isLoading: outLoading,
    error: outError,
  } = useQueueOutbound();
  const {
    data: scheduled,
    isLoading: schedLoading,
    error: schedError,
  } = useQueueScheduled();
  const {
    data: swapStats,
    isLoading: swapStatsLoading,
    error: swapStatsError,
  } = useSwapStats();
  const {
    data: streaming,
    isLoading: streamingLoading,
    error: streamingError,
  } = useStreamingSwaps();

  const isLoading =
    queueLoading ||
    outLoading ||
    schedLoading ||
    swapStatsLoading ||
    streamingLoading;

  const error =
    queueError || outError || schedError || swapStatsError || streamingError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  }

  const queue = queueData || {};
  const liveStreamingCount = streaming?.count ?? swapStats?.live_streaming ?? 0;

  return (
    <>
      <Helmet>
        <title>THORChain Network Explorer | Queue</title>
        <meta
          name="description"
          content="Monitor THORChain outbound, scheduled, and live streaming swap activity."
        />
      </Helmet>
      <div className="p-4">
        <h1 className="text-2xl text-gray-800 dark:text-white font-bold mb-6">
          Transaction Queue
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <StatsCard
            icon={BlockIcon}
            title="Swap Queue"
            stat={String(queue.swap ?? "--")}
          />
          <StatsCard
            icon={NodesIcon}
            title="Outbound Queue"
            stat={String(queue.outbound ?? "--")}
          />
          <StatsCard
            icon={BondIcon}
            title="Scheduled Queue"
            stat={String(queue.scheduled_outbound_value ?? "--")}
          />
          <StatsCard
            icon={NodesIcon}
            title="Live Streaming"
            stat={String(liveStreamingCount)}
          />
        </div>

        <div className="mb-4">
          <Tabs items={QUEUE_TABS} value={currentTab} onChange={setCurrentTab} />
        </div>

        {currentTab === "summary" && (
          <Box className="p-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-bold uppercase text-gray-700 dark:text-white mb-3">
                  Queue Counts
                </h3>
                <div className="space-y-2">
                  {["swap", "outbound", "internal"].map((key) => (
                    <div
                      key={key}
                      className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700/50"
                    >
                      <span className="text-sm capitalize text-gray-600 dark:text-gray-300">
                        {key}
                      </span>
                      <span className="text-sm font-mono text-[#28f3b0]">
                        {queue[key] != null
                          ? Number(queue[key]).toLocaleString()
                          : "--"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase text-gray-700 dark:text-white mb-3">
                  Scheduled
                </h3>
                <div className="space-y-2">
                  {["scheduled_outbound_value", "scheduled_outbound_clout"].map(
                    (key) => (
                      <div
                        key={key}
                        className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700/50"
                      >
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {key.replace(/_/g, " ").replace("scheduled ", "")}
                        </span>
                        <span className="text-sm font-mono text-[#28f3b0]">
                          {queue[key] != null ? queue[key] : "--"}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase text-gray-700 dark:text-white mb-3">
                  Swap Flow
                </h3>
                <div className="space-y-2">
                  {[
                    ["24h swaps", swapStats?.count_24h],
                    ["24h volume", formatUsd(swapStats?.volume_24h_usd)],
                    ["streaming 24h", swapStats?.streaming_count_24h],
                    ["live streaming", liveStreamingCount],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700/50"
                    >
                      <span className="text-sm capitalize text-gray-600 dark:text-gray-300">
                        {label}
                      </span>
                      <span className="text-sm font-mono text-[#28f3b0]">
                        {value != null ? value : "--"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Box>
        )}

        {currentTab === "outbound" && (
          <TxTable
            transactions={
              Array.isArray(outbound) ? outbound : outbound?.outbound
            }
            type="outbound"
          />
        )}

        {currentTab === "scheduled" && (
          <TxTable
            transactions={
              Array.isArray(scheduled) ? scheduled : scheduled?.scheduled
            }
            type="scheduled"
          />
        )}

        {currentTab === "streaming" && <StreamingSwapsTable data={streaming} />}
      </div>
    </>
  );
}

export default Queue;
