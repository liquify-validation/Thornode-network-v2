import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import { LoadingSpinner } from "../components";
import Box from "../ui/Box";
import StatsCard from "../components/StatsCard";
import {
  useSwapStats,
  useSwapHistory,
  useRecentSwaps,
  useStreamingSwaps,
} from "../hooks/useSwapsData";
import { BlockIcon, NodesIcon, BondIcon, PriceIcon, MarketCapIcon } from "../assets";

/* ── helpers ──────────────────────────────────────────── */

function formatUsd(val) {
  if (val == null) return "—";
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(1)}k`;
  return `$${val.toFixed(2)}`;
}

function formatAmount(raw, decimals = 4) {
  if (!raw) return "—";
  return (Number(raw) / 1e8).toLocaleString(undefined, {
    maximumFractionDigits: decimals,
  });
}

function shortAsset(asset) {
  if (!asset) return "—";
  // BTC.BTC → BTC, ETH.USDC-0xA0b... → ETH.USDC
  const parts = asset.split("-");
  return parts[0];
}

function pairLabel(src, tgt) {
  return `${shortAsset(src)} → ${shortAsset(tgt)}`;
}

function shortTx(txId) {
  if (!txId) return "—";
  return txId.slice(0, 8).toUpperCase();
}

function formatTimeSaved(secs) {
  if (secs == null) return "—";
  if (secs < 60) return `${secs}s`;
  if (secs < 3600) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
  }
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function formatDate(isoStr) {
  if (!isoStr) return "—";
  const d = new Date(isoStr);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDuration(secs) {
  if (secs == null || secs <= 0) return "—";
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  const parts = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  if (s > 0 || parts.length === 0) parts.push(`${s}s`);
  return parts.join(" ");
}

/* ── tab selector ─────────────────────────────────────── */

function SwapTab({ tabs, currentTab, onChange }) {
  return (
    <div className="flex flex-wrap gap-1">
      {tabs.map((tab, idx) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-4 py-2 text-sm font-semibold transition-colors ${
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

/* ── swap table ───────────────────────────────────────── */

function SwapTable({ swaps, showSavings }) {
  if (!swaps || swaps.length === 0) {
    return (
      <Box className="p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">No swaps found.</p>
      </Box>
    );
  }

  return (
    <Box className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left px-3 py-3 text-xs font-bold uppercase text-gray-700 dark:text-white">
              #
            </th>
            <th className="text-left px-3 py-3 text-xs font-bold uppercase text-gray-700 dark:text-white">
              Date
            </th>
            <th className="text-left px-3 py-3 text-xs font-bold uppercase text-gray-700 dark:text-white">
              Pair
            </th>
            <th className="text-left px-3 py-3 text-xs font-bold uppercase text-gray-700 dark:text-white">
              Type
            </th>
            <th className="text-left px-3 py-3 text-xs font-bold uppercase text-gray-700 dark:text-white">
              Input
            </th>
            <th className="text-right px-3 py-3 text-xs font-bold uppercase text-gray-700 dark:text-white">
              USD
            </th>
            <th className="text-right px-3 py-3 text-xs font-bold uppercase text-gray-700 dark:text-white">
              Slip (bps)
            </th>
            {showSavings && (
              <>
                <th className="text-right px-3 py-3 text-xs font-bold uppercase text-gray-700 dark:text-white">
                  Txns
                </th>
                <th className="text-right px-3 py-3 text-xs font-bold uppercase text-gray-700 dark:text-white">
                  Time
                </th>
                <th className="text-right px-3 py-3 text-xs font-bold uppercase text-gray-700 dark:text-white">
                  Saved
                </th>
              </>
            )}
            <th className="text-right px-3 py-3 text-xs font-bold uppercase text-gray-700 dark:text-white">
              TX
            </th>
          </tr>
        </thead>
        <tbody>
          {swaps.map((swap, idx) => {
            const isStreaming = swap.swap_type === "streaming";
            return (
              <tr
                key={swap.tx_id || idx}
                className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                <td className="px-3 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {idx + 1}
                </td>
                <td className="px-3 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {formatDate(swap.block_timestamp)}
                </td>
                <td className="px-3 py-3 text-sm font-semibold text-gray-800 dark:text-white whitespace-nowrap">
                  {pairLabel(swap.source_asset, swap.target_asset)}
                </td>
                <td className="px-3 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                      isStreaming
                        ? "bg-[#28f3b0]/20 text-[#28f3b0]"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {isStreaming ? "Streaming" : "Regular"}
                  </span>
                </td>
                <td className="px-3 py-3 text-sm text-left text-gray-700 dark:text-gray-300 whitespace-nowrap font-mono tabular-nums">
                  {formatAmount(swap.input_amount)}{" "}
                  <span className="text-xs text-gray-500">
                    {shortAsset(swap.source_asset)}
                  </span>
                </td>
                <td className="px-3 py-3 text-sm text-right font-semibold text-[#28f3b0]">
                  {formatUsd(swap.usd_value)}
                </td>
                <td className="px-3 py-3 text-sm text-right text-gray-600 dark:text-gray-300">
                  {swap.swap_slip ?? "—"}
                </td>
                {showSavings && (
                  <>
                    <td className="px-3 py-3 text-sm text-right text-gray-600 dark:text-gray-300">
                      {isStreaming && swap.streaming_count
                        ? `${swap.streaming_count}/${swap.streaming_quantity}`
                        : "—"}
                    </td>
                    <td className="px-3 py-3 text-sm text-right text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {isStreaming ? formatDuration(swap.time_seconds) : "—"}
                    </td>
                    <td className="px-3 py-3 text-sm text-right whitespace-nowrap">
                      {isStreaming && swap.slip_saved_percent != null ? (
                        <span
                          className={
                            swap.slip_saved_percent > 0
                              ? "text-[#28f3b0]"
                              : "text-red-400"
                          }
                        >
                          {formatTimeSaved(swap.time_seconds)}{" "}
                          <span className="text-xs">
                            ({swap.slip_saved_percent}%)
                          </span>
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                  </>
                )}
                <td className="px-3 py-3 text-sm text-right">
                  <a
                    href={`https://runescan.io/tx/${swap.tx_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {shortTx(swap.tx_id)}
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Box>
  );
}

/* ── live streaming panel ─────────────────────────────── */

function LiveStreamingPanel({ data }) {
  const swaps = data?.swaps || [];
  if (swaps.length === 0) {
    return (
      <Box className="p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          No streaming swaps in progress right now.
        </p>
      </Box>
    );
  }

  return (
    <Box className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left px-3 py-3 text-xs font-bold uppercase text-gray-700 dark:text-white">
              Pair
            </th>
            <th className="text-left px-3 py-3 text-xs font-bold uppercase text-gray-700 dark:text-white">
              Deposit
            </th>
            <th className="text-right px-3 py-3 text-xs font-bold uppercase text-gray-700 dark:text-white">
              Progress
            </th>
            <th className="text-right px-3 py-3 text-xs font-bold uppercase text-gray-700 dark:text-white">
              In
            </th>
            <th className="text-right px-3 py-3 text-xs font-bold uppercase text-gray-700 dark:text-white">
              Out
            </th>
            <th className="text-right px-3 py-3 text-xs font-bold uppercase text-gray-700 dark:text-white">
              Interval
            </th>
            <th className="text-right px-3 py-3 text-xs font-bold uppercase text-gray-700 dark:text-white">
              TX
            </th>
          </tr>
        </thead>
        <tbody>
          {swaps.map((s, idx) => {
            const count = s.count ?? 0;
            const quantity = s.quantity ?? 0;
            const progress =
              quantity > 0
                ? `${count}/${quantity}`
                : `${count}/?`;
            const pct =
              quantity > 0
                ? Math.min(Math.round((count / quantity) * 100), 100)
                : 0;
            return (
              <tr
                key={s.tx_id || idx}
                className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                <td className="px-3 py-3 text-sm font-semibold text-gray-800 dark:text-white whitespace-nowrap">
                  {shortAsset(s.source_asset)} → {shortAsset(s.target_asset)}
                </td>
                <td className="px-3 py-3 text-sm text-left text-gray-700 dark:text-gray-300 font-mono tabular-nums">
                  {formatAmount(s.deposit)}
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2 ml-auto w-[10rem]">
                    <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden shrink-0">
                      <div
                        className="h-full bg-[#28f3b0] rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap w-16 text-right">
                      {progress}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-3 text-sm text-right text-[#28f3b0]">
                  {formatAmount(s.in)}
                </td>
                <td className="px-3 py-3 text-sm text-right text-gray-600 dark:text-gray-300">
                  {formatAmount(s.out)}
                </td>
                <td className="px-3 py-3 text-sm text-right text-gray-600 dark:text-gray-300">
                  {s.interval} blk{s.interval !== 1 ? "s" : ""}
                </td>
                <td className="px-3 py-3 text-sm text-right">
                  <a
                    href={`https://runescan.io/tx/${s.tx_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-blue-400 hover:text-blue-300"
                  >
                    {shortTx(s.tx_id)}
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Box>
  );
}

/* ── main page ────────────────────────────────────────── */

function Swaps() {
  const [currentTab, setCurrentTab] = useState("top");
  const [typeFilter, setTypeFilter] = useState("");

  const { data: stats, isLoading: statsLoading } = useSwapStats();
  const { data: topSwaps, isLoading: topLoading } = useSwapHistory({
    type: typeFilter || undefined,
    limit: 50,
    sort: "usd_value",
  });
  const { data: recentSwaps, isLoading: recentLoading } =
    useRecentSwaps(typeFilter || undefined);
  const { data: liveData, isLoading: liveLoading } = useStreamingSwaps();

  const isLoading = statsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  const s = stats || {};

  return (
    <>
      <Helmet>
        <title>THORChain Network Explorer | Swaps</title>
        <meta
          name="description"
          content="Track THORChain swaps in real-time. Monitor streaming swaps, view savings, and explore swap history."
        />
      </Helmet>
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl text-gray-800 dark:text-white font-bold">
            Swap Tracker
          </h1>
          {liveData?.count > 0 && (
            <span className="flex items-center gap-2 text-sm text-[#28f3b0]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#28f3b0] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#28f3b0]" />
              </span>
              {liveData.count} streaming live
            </span>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <StatsCard
            icon={BlockIcon}
            title="24h Swaps"
            stat={String(s.count_24h ?? "—")}
          />
          <StatsCard
            icon={PriceIcon}
            title="24h Volume"
            stat={formatUsd(s.volume_24h_usd)}
          />
          <StatsCard
            icon={NodesIcon}
            title="Tracked Swaps"
            stat={String(s.total_swaps ?? "—")}
          />
          <StatsCard
            icon={MarketCapIcon}
            title="Tracked Volume"
            stat={formatUsd(s.total_volume_usd)}
          />
          <StatsCard
            icon={BondIcon}
            title="Largest Swap"
            stat={formatUsd(s.largest_swap_usd)}
          />
          <StatsCard
            icon={BlockIcon}
            title="Avg Fee Saved"
            stat={s.avg_fee_saved_pct ? `${s.avg_fee_saved_pct}%` : "—"}
          />
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <SwapTab
            tabs={[
              { value: "top", label: "Top Recorded" },
              { value: "recent", label: "Last 24 Hours" },
              { value: "live", label: `Live Streaming (${liveData?.count || 0})` },
            ]}
            currentTab={currentTab}
            onChange={setCurrentTab}
          />

          {currentTab !== "live" && (
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl text-sm inner-glass-effect text-gray-800 dark:text-gray-50 bg-transparent border-0 outline-none cursor-pointer"
            >
              <option value="">All Types</option>
              <option value="streaming">Streaming Only</option>
              <option value="regular">Regular Only</option>
            </select>
          )}
        </div>

        {/* Tab content */}
        {currentTab === "top" && (
          <SwapTable
            swaps={topSwaps}
            showSavings={true}
            isLoading={topLoading}
          />
        )}

        {currentTab === "recent" && (
          <SwapTable
            swaps={recentSwaps}
            showSavings={true}
            isLoading={recentLoading}
          />
        )}

        {currentTab === "live" && (
          <LiveStreamingPanel data={liveData} />
        )}
      </div>
    </>
  );
}

export default Swaps;
