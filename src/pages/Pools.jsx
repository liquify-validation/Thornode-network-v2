import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import { LoadingSpinner } from "../components";
import Box from "../ui/Box";
import StatsCard from "../components/StatsCard";
import { usePoolsData, usePoolStats } from "../hooks/usePoolsData";
import { BondIcon, PriceIcon, BlockIcon, NodesIcon, MagnifyingGlass } from "../assets";

const STATUS_OPTIONS = ["available", "staged", "suspended"];

function PoolStatusFilter({ statusFilter, onChange }) {
  return (
    <div className="flex">
      <button
        onClick={() => onChange("")}
        className={`px-4 py-2 rounded-l-xl rounded-r-none ${
          statusFilter === ""
            ? "bg-gray-800 dark:bg-[#28f3b0] text-gray-50 dark:text-gray-800"
            : "inner-glass-effect text-gray-800 dark:text-gray-50"
        }`}
      >
        All
      </button>
      {STATUS_OPTIONS.map((status, idx) => (
        <button
          key={status}
          onClick={() => onChange(status)}
          className={`px-4 py-2 capitalize ${
            idx === STATUS_OPTIONS.length - 1
              ? "rounded-r-xl rounded-l-none"
              : "rounded-none"
          } ${
            statusFilter === status
              ? "bg-gray-800 dark:bg-[#28f3b0] text-gray-50 dark:text-gray-800"
              : "inner-glass-effect text-gray-800 dark:text-gray-50"
          }`}
        >
          {status}
        </button>
      ))}
    </div>
  );
}

function Pools({ isDark }) {
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: pools, isLoading: poolsLoading } = usePoolsData(
    statusFilter || undefined
  );
  const { data: stats, isLoading: statsLoading } = usePoolStats();

  const isLoading = poolsLoading || statsLoading;

  const poolsList = useMemo(() => {
    const list = Array.isArray(pools) ? pools : [];
    if (!searchTerm) return list;
    const lower = searchTerm.toLowerCase();
    return list.filter((p) => (p.asset || "").toLowerCase().includes(lower));
  }, [pools, searchTerm]);

  function formatRune(val) {
    const num = Number(val) / 1e8;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toFixed(2);
  }

  function formatUsd(val) {
    const num = Number(val);
    if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
    if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}K`;
    return `$${num.toFixed(2)}`;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  const poolStats = stats || {};

  return (
    <>
      <Helmet>
        <title>THORChain Network Explorer | Pools</title>
        <meta
          name="description"
          content="View THORChain liquidity pools, status, depth, volume, and APY."
        />
      </Helmet>
      <div className="p-4">
        <h1 className="text-2xl text-gray-800 dark:text-white font-bold mb-6">
          Liquidity Pools
        </h1>

        {poolStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatsCard
              icon={BondIcon}
              title="Total RUNE Depth"
              stat={
                poolStats.runeDepth
                  ? `${formatRune(poolStats.runeDepth)}`
                  : "N/A"
              }
            />
            <StatsCard
              icon={PriceIcon}
              title="Total Swaps (30d)"
              stat={
                poolStats.swapCount30d
                  ? Number(poolStats.swapCount30d).toLocaleString()
                  : "N/A"
              }
            />
            <StatsCard
              icon={NodesIcon}
              title="Total Swaps (24h)"
              stat={
                poolStats.swapCount24h
                  ? Number(poolStats.swapCount24h).toLocaleString()
                  : "N/A"
              }
            />
            <StatsCard
              icon={BlockIcon}
              title="Total Pools"
              stat={String(Array.isArray(pools) ? pools.length : 0)}
            />
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <PoolStatusFilter
            statusFilter={statusFilter}
            onChange={setStatusFilter}
          />
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={MagnifyingGlass}
                alt="Search"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-50 invert dark:invert-0"
              />
              <input
                type="text"
                placeholder="Search pools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-xl inner-glass-effect text-gray-800 dark:text-white
                  placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#28f3b0]/50"
              />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {poolsList.length} pool{poolsList.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <Box className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-4 py-3 text-sm font-bold uppercase text-gray-700 dark:text-white">
                  Asset
                </th>
                <th className="text-left px-4 py-3 text-sm font-bold uppercase text-gray-700 dark:text-white">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-sm font-bold uppercase text-gray-700 dark:text-white">
                  RUNE Depth
                </th>
                <th className="text-right px-4 py-3 text-sm font-bold uppercase text-gray-700 dark:text-white">
                  Asset Depth
                </th>
                <th className="text-right px-4 py-3 text-sm font-bold uppercase text-gray-700 dark:text-white">
                  Price (USD)
                </th>
                <th className="text-right px-4 py-3 text-sm font-bold uppercase text-gray-700 dark:text-white">
                  APY
                </th>
              </tr>
            </thead>
            <tbody>
              {poolsList.map((pool) => {
                const statusColor =
                  pool.status === "available"
                    ? "text-green-400"
                    : pool.status === "staged"
                    ? "text-yellow-400"
                    : "text-red-400";

                return (
                  <tr
                    key={pool.asset}
                    className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white">
                      {pool.asset}
                    </td>
                    <td className={`px-4 py-3 text-sm capitalize ${statusColor}`}>
                      {pool.status}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-300">
                      {pool.runeDepth
                        ? `${formatRune(pool.runeDepth)}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-300">
                      {pool.assetDepth
                        ? `${formatRune(pool.assetDepth)}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-[#28f3b0]">
                      {pool.assetPriceUSD
                        ? `$${Number(pool.assetPriceUSD).toLocaleString(
                            undefined,
                            { maximumFractionDigits: 2 }
                          )}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-300">
                      {pool.poolAPY
                        ? `${(Number(pool.poolAPY) * 100).toFixed(2)}%`
                        : "—"}
                    </td>
                  </tr>
                );
              })}
              {poolsList.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No pools found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Box>
      </div>
    </>
  );
}

export default Pools;
