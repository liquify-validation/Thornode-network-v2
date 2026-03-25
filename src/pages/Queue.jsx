import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import { LoadingSpinner } from "../components";
import Box from "../ui/Box";
import StatsCard from "../components/StatsCard";
import { useQueueData, useQueueOutbound, useQueueScheduled } from "../hooks/useQueueData";
import { BlockIcon, NodesIcon, BondIcon } from "../assets";

function QueueTab({ tabs, currentTab, onChange }) {
  return (
    <div className="flex">
      {tabs.map((tab, idx) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-4 py-2 ${
            idx === 0
              ? "rounded-l-xl rounded-r-none"
              : idx === tabs.length - 1
              ? "rounded-r-xl rounded-l-none"
              : "rounded-none"
          } ${
            currentTab === tab.value
              ? "bg-gray-800 dark:bg-[#28f3b0] text-gray-50 dark:text-gray-800"
              : "inner-glass-effect text-gray-800 dark:text-gray-50"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

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
            const asset = coin.asset || "—";
            const chain = asset.split(".")[0] || asset;
            const amount = coin.amount
              ? (Number(coin.amount) / 1e8).toLocaleString(undefined, {
                  maximumFractionDigits: 4,
                })
              : "—";

            const maxGas = tx.max_gas?.[0];
            const gasAmount = maxGas?.amount
              ? (Number(maxGas.amount) / 1e8).toLocaleString(undefined, {
                  maximumFractionDigits: 6,
                })
              : "—";

            const toAddr = tx.to_address || "—";
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
                  {tx.height ? Number(tx.height).toLocaleString() : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Box>
  );
}

function Queue({ isDark }) {
  const [currentTab, setCurrentTab] = useState("summary");

  const { data: queueData, isLoading: queueLoading } = useQueueData();
  const { data: outbound, isLoading: outLoading } = useQueueOutbound();
  const { data: scheduled, isLoading: schedLoading } = useQueueScheduled();

  const isLoading = queueLoading || outLoading || schedLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  const queue = queueData || {};

  return (
    <>
      <Helmet>
        <title>THORChain Network Explorer | Queue</title>
        <meta
          name="description"
          content="Monitor THORChain outbound and scheduled transaction queues."
        />
      </Helmet>
      <div className="p-4">
        <h1 className="text-2xl text-gray-800 dark:text-white font-bold mb-6">
          Transaction Queue
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatsCard
            icon={BlockIcon}
            title="Swap Queue"
            stat={String(queue.swap ?? "—")}
          />
          <StatsCard
            icon={NodesIcon}
            title="Outbound Queue"
            stat={String(queue.outbound ?? "—")}
          />
          <StatsCard
            icon={BondIcon}
            title="Scheduled Queue"
            stat={String(queue.scheduled_outbound_value ?? "—")}
          />
        </div>

        <div className="mb-4">
          <QueueTab
            tabs={[
              { value: "summary", label: "Summary" },
              { value: "outbound", label: "Outbound" },
              { value: "scheduled", label: "Scheduled" },
            ]}
            currentTab={currentTab}
            onChange={setCurrentTab}
          />
        </div>

        {currentTab === "summary" && (
          <Box className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        {queue[key] != null ? Number(queue[key]).toLocaleString() : "—"}
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
                  {[
                    "scheduled_outbound_value",
                    "scheduled_outbound_clout",
                  ].map((key) => (
                    <div
                      key={key}
                      className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700/50"
                    >
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {key.replace(/_/g, " ").replace("scheduled ", "")}
                      </span>
                      <span className="text-sm font-mono text-[#28f3b0]">
                        {queue[key] != null ? queue[key] : "—"}
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
      </div>
    </>
  );
}

export default Queue;
