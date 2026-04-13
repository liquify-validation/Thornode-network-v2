/* eslint-disable react/prop-types */
import { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { LoadingSpinner, StatsCard, Tabs } from "../components";
import Box from "../ui/Box";
import {
  useStreamingSwaps,
  useSwapHistory,
  useSwapStats,
} from "../hooks/useSwapsData";
import {
  AnalyticsIcon,
  BlockIcon,
  NodesIcon,
  PriceIcon,
  UpArrow,
  DownArrow,
  ArrowIcon,
} from "../assets";
import { chainIcons } from "../utilities/commonFunctions";

const SWAP_TYPE_OPTIONS = [
  { value: "", label: "All" },
  { value: "regular", label: "Regular" },
  { value: "streaming", label: "Streaming" },
];

const SORT_OPTIONS = {
  time: "block_timestamp",
  input: "input_amount",
  output: "output_amount",
  usd: "usd_value",
  slip: "swap_slip",
};

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

function formatDateTime(value) {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function shortenHash(value) {
  if (!value) return "--";
  return value.length > 20
    ? `${value.slice(0, 10)}...${value.slice(-8)}`
    : value;
}

function normalizeSwapRows(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.swaps)) return data.swaps;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function normalizeAssetValue(value) {
  return String(value || "").trim();
}

function getAssetParts(asset) {
  const normalized = normalizeAssetValue(asset).replace("~", ".");
  const [chain = "", token = ""] = normalized.split(".");
  const ticker = token.split("-")[0] || chain;

  return {
    asset: normalizeAssetValue(asset),
    chain,
    ticker,
    icon: chainIcons[chain],
  };
}

function getSortableNumber(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : Number.NEGATIVE_INFINITY;
}

function sortRows(rows, sortBy, sortDirection) {
  const key = SORT_OPTIONS[sortBy] || SORT_OPTIONS.time;
  const direction = sortDirection === "asc" ? 1 : -1;

  return [...rows].sort((a, b) => {
    const left =
      key === SORT_OPTIONS.time
        ? new Date(a[key] || 0).getTime()
        : getSortableNumber(a[key]);
    const right =
      key === SORT_OPTIONS.time
        ? new Date(b[key] || 0).getTime()
        : getSortableNumber(b[key]);

    if (left === right) return 0;
    return left > right ? direction : -direction;
  });
}

function SortableHeader({ label, column, sortBy, sortDirection, onSort, align = "left" }) {
  const isActive = sortBy === column;

  return (
    <th
      className={`px-4 py-3 text-sm font-bold uppercase tracking-wide text-gray-700 dark:text-white ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      <button
        type="button"
        onClick={() => onSort(column)}
        className={`flex w-full items-center gap-1 rounded-none border-0 bg-transparent px-0 py-0 shadow-none hover:border-transparent focus:ring-0 focus-visible:ring-0 ${
          align === "right"
            ? "justify-end text-right whitespace-nowrap"
            : "justify-start text-left whitespace-nowrap"
        }`}
      >
        <span>{label}</span>
        {isActive && (
          <img
            src={sortDirection === "desc" ? UpArrow : DownArrow}
            alt=""
            className="w-4 h-4"
          />
        )}
      </button>
    </th>
  );
}

function SectionLoadingBox({ label }) {
  return (
    <Box className="p-8 min-h-[260px] flex flex-col items-center justify-center text-center">
      <div className="h-28 w-full">
        <LoadingSpinner />
      </div>
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Loading {label}...
      </p>
    </Box>
  );
}

function RouteCell({ sourceAsset, targetAsset, pools }) {
  const source = getAssetParts(sourceAsset);
  const target = getAssetParts(targetAsset);

  return (
    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
      <div className="flex items-center gap-2 font-semibold text-gray-800 dark:text-white">
        {source.icon && <img src={source.icon} alt={source.chain} className="w-4 h-4" />}
        <span>{sourceAsset || "--"}</span>
      </div>
      <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        {target.icon && <img src={target.icon} alt={target.chain} className="w-4 h-4" />}
        <span>to {targetAsset || "--"}</span>
      </div>
      {Array.isArray(pools) && pools.length > 0 && (
        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Pools: {pools.join(", ")}
        </div>
      )}
    </td>
  );
}

function SwapHistoryTable({ rows, sortBy, sortDirection, onSort }) {
  if (rows.length === 0) {
    return (
      <Box className="p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          No swap history matched this filter.
        </p>
      </Box>
    );
  }

  return (
    <Box className="overflow-x-auto">
      <table className="w-full min-w-[1160px] table-fixed">
        <colgroup>
          <col className="w-[190px]" />
          <col className="w-[300px]" />
          <col className="w-[100px]" />
          <col className="w-[105px]" />
          <col className="w-[105px]" />
          <col className="w-[105px]" />
          <col className="w-[90px]" />
          <col className="w-[165px]" />
        </colgroup>
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <SortableHeader
              label="Time"
              column="time"
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSort={onSort}
            />
            <th className="text-left px-4 py-3 text-sm font-bold uppercase tracking-wide text-gray-700 dark:text-white">
              Route
            </th>
            <th className="text-left px-4 py-3 text-sm font-bold uppercase tracking-wide text-gray-700 dark:text-white">
              Type
            </th>
            <SortableHeader
              label="Input"
              column="input"
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSort={onSort}
              align="right"
            />
            <SortableHeader
              label="Output"
              column="output"
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSort={onSort}
              align="right"
            />
            <SortableHeader
              label="USD"
              column="usd"
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSort={onSort}
              align="right"
            />
            <SortableHeader
              label="Slip"
              column="slip"
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSort={onSort}
              align="right"
            />
            <th className="text-left px-4 py-3 text-sm font-bold uppercase tracking-wide text-gray-700 dark:text-white">
              Tx
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((swap) => (
            <tr
              key={swap.tx_id}
              className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                {formatDateTime(swap.block_timestamp)}
              </td>
              <RouteCell
                sourceAsset={swap.source_asset}
                targetAsset={swap.target_asset}
                pools={swap.pools}
              />
              <td className="px-4 py-3 text-sm capitalize text-[#28f3b0] whitespace-nowrap">
                {swap.swap_type || "--"}
              </td>
              <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-300 whitespace-nowrap">
                {formatBaseAmount(swap.input_amount)}
              </td>
              <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-300 whitespace-nowrap">
                {formatBaseAmount(swap.output_amount)}
              </td>
              <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-300 whitespace-nowrap">
                {formatUsd(swap.usd_value)}
              </td>
              <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-300 whitespace-nowrap">
                {swap.swap_slip != null ? `${swap.swap_slip} bps` : "--"}
              </td>
              <td
                className="px-4 py-3 text-sm font-mono text-gray-600 dark:text-gray-300 whitespace-nowrap"
                title={swap.tx_id}
              >
                {shortenHash(swap.tx_id)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
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
      <div className="px-6 pt-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Live Streaming Swaps
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Updated {formatDateTime(data?.updated_at)}
        </p>
      </div>
      <table className="w-full min-w-[920px] mt-4">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left px-4 py-3 text-sm font-bold uppercase tracking-wide text-gray-700 dark:text-white">
              Route
            </th>
            <th className="text-left px-4 py-3 text-sm font-bold uppercase tracking-wide text-gray-700 dark:text-white">
              Destination
            </th>
            <th className="text-right px-4 py-3 text-sm font-bold uppercase tracking-wide text-gray-700 dark:text-white">
              Count
            </th>
            <th className="text-right px-4 py-3 text-sm font-bold uppercase tracking-wide text-gray-700 dark:text-white">
              Quantity
            </th>
            <th className="text-right px-4 py-3 text-sm font-bold uppercase tracking-wide text-gray-700 dark:text-white">
              Deposit
            </th>
            <th className="text-right px-4 py-3 text-sm font-bold uppercase tracking-wide text-gray-700 dark:text-white">
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
              <RouteCell
                sourceAsset={swap.source_asset}
                targetAsset={swap.target_asset}
                pools={swap.pools}
              />
              <td
                className="px-4 py-3 text-sm font-mono text-gray-600 dark:text-gray-300"
                title={swap.destination}
              >
                {shortenHash(swap.destination)}
              </td>
              <td className="px-4 py-3 text-sm text-right text-[#28f3b0] font-semibold">
                {swap.count != null ? Number(swap.count).toLocaleString() : "--"}
              </td>
              <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-300">
                {swap.quantity != null
                  ? Number(swap.quantity).toLocaleString()
                  : "--"}
              </td>
              <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-300">
                {formatBaseAmount(swap.deposit)}
              </td>
              <td className="px-4 py-3 text-sm text-right text-gray-600 dark:text-gray-300">
                {swap.interval != null ? Number(swap.interval).toLocaleString() : "--"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
}

function AssetFilterDropdown({ options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedOption =
    options.find((option) => option.value === value) || options[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (!dropdownRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative z-30 min-w-[320px] lg:min-w-[360px]">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={`flex w-full items-center justify-between rounded-xl border px-4 py-2 text-left text-sm transition-colors focus:outline-none focus:ring-0 focus-visible:ring-0 ${
          isOpen
            ? "border-[#28f3b0]/60 bg-[#173449] text-white"
            : "border-transparent inner-glass-effect bg-white text-gray-800 hover:border-[#28f3b0]/40 dark:bg-[#173449] dark:text-white"
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate">{selectedOption?.label || "All assets"}</span>
        <img
          src={ArrowIcon}
          alt=""
          className={`ml-3 h-4 w-4 flex-shrink-0 transform transition-transform duration-200 ${
            isOpen ? "rotate-[270deg] opacity-100 invert" : "rotate-90 opacity-70 dark:invert"
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full z-[70] mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-[#28f3b0]/20 bg-[#173449] p-2 shadow-2xl shadow-black/25"
          role="listbox"
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.value || "all-assets"}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-start rounded-none border-0 border-b border-white/10 bg-transparent px-3 py-2.5 text-left text-sm shadow-none transition-colors hover:border-b hover:border-white/10 focus:outline-none focus:ring-0 focus-visible:ring-0 last:border-b-0 ${
                  isSelected
                    ? "font-semibold text-[#28f3b0]"
                    : "text-gray-100 hover:bg-white/8"
                }`}
                role="option"
                aria-selected={isSelected}
              >
                <span className="truncate">{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Swaps() {
  const [typeFilter, setTypeFilter] = useState("");
  const [assetFilter, setAssetFilter] = useState("");
  const [sortBy, setSortBy] = useState("time");
  const [sortDirection, setSortDirection] = useState("desc");

  const {
    data: swapStats,
    isLoading: swapStatsLoading,
    error: swapStatsError,
  } = useSwapStats();
  const {
    data: historyData,
    isLoading: historyLoading,
    error: historyError,
  } = useSwapHistory({
    type: typeFilter || undefined,
    limit: 50,
    sort: "block_timestamp",
  });
  const {
    data: streamingData,
    isLoading: streamingLoading,
    error: streamingError,
  } = useStreamingSwaps();

  const historyRows = useMemo(
    () => normalizeSwapRows(historyData),
    [historyData],
  );

  const assetOptions = useMemo(() => {
    const uniqueAssets = new Set();

    historyRows.forEach((swap) => {
      if (swap.source_asset) uniqueAssets.add(normalizeAssetValue(swap.source_asset));
      if (swap.target_asset) uniqueAssets.add(normalizeAssetValue(swap.target_asset));
    });

    return [
      { value: "", label: "All assets" },
      ...Array.from(uniqueAssets)
        .sort((a, b) => a.localeCompare(b))
        .map((asset) => ({ value: asset, label: asset })),
    ];
  }, [historyRows]);

  const filteredAndSortedRows = useMemo(() => {
    const filtered = assetFilter
      ? historyRows.filter(
          (swap) =>
            normalizeAssetValue(swap.source_asset) === assetFilter ||
            normalizeAssetValue(swap.target_asset) === assetFilter,
        )
      : historyRows;

    return sortRows(filtered, sortBy, sortDirection);
  }, [assetFilter, historyRows, sortBy, sortDirection]);

  function handleSort(column) {
    if (sortBy === column) {
      setSortDirection((current) => (current === "desc" ? "asc" : "desc"));
      return;
    }

    setSortBy(column);
    setSortDirection(column === "time" ? "desc" : "desc");
  }

  return (
    <>
      <Helmet>
        <title>THORChain Network Explorer | Swaps</title>
        <meta
          name="description"
          content="Track THORChain swap activity, recent history, and live streaming swaps."
        />
      </Helmet>

      <div className="p-4">
        <div className="mb-8">
          <h1 className="text-2xl text-gray-800 dark:text-white font-bold mb-3">
            Swaps
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-300 max-w-4xl">
            Live network-wide swap activity from the new Liquify swaps
            endpoints, including recent completed swaps and in-progress
            streaming orders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <StatsCard
            icon={BlockIcon}
            title="Swaps 24h"
            stat={
              swapStatsLoading && !swapStats
                ? "--"
                : String(Number(swapStats?.count_24h || 0).toLocaleString())
            }
          />
          <StatsCard
            icon={PriceIcon}
            title="Volume 24h"
            stat={swapStatsLoading && !swapStats ? "--" : formatUsd(swapStats?.volume_24h_usd)}
          />
          <StatsCard
            icon={NodesIcon}
            title="Live Streaming"
            stat={
              streamingLoading && !streamingData && swapStatsLoading && !swapStats
                ? "--"
                : String(
                    Number(
                      streamingData?.count ?? swapStats?.live_streaming ?? 0,
                    ).toLocaleString(),
                  )
            }
          />
          <StatsCard
            icon={AnalyticsIcon}
            title="Largest Swap"
            stat={swapStatsLoading && !swapStats ? "--" : formatUsd(swapStats?.largest_swap_usd)}
          />
        </div>

        {swapStatsError && !swapStats ? (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            Unable to load swap summary: {swapStatsError.message}
          </div>
        ) : null}

        <Box className="p-5 mb-6 overflow-visible relative z-20">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 overflow-visible">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Completed Swaps
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Latest 50 completed swaps from the backend history endpoint.
              </p>
            </div>
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
              <Tabs
                items={SWAP_TYPE_OPTIONS}
                value={typeFilter}
                onChange={setTypeFilter}
              />
              <AssetFilterDropdown
                options={assetOptions}
                value={assetFilter}
                onChange={setAssetFilter}
              />
            </div>
          </div>
        </Box>

        <div className="mb-8">
          {historyError && !historyData ? (
            <Box className="p-8 text-center">
              <p className="text-red-400">
                Unable to load completed swaps: {historyError.message}
              </p>
            </Box>
          ) : historyLoading && filteredAndSortedRows.length === 0 ? (
            <SectionLoadingBox label="completed swaps" />
          ) : (
            <SwapHistoryTable
              rows={filteredAndSortedRows}
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
          )}
        </div>

        {streamingError && !streamingData ? (
          <Box className="p-8 text-center">
            <p className="text-red-400">
              Unable to load live streaming swaps: {streamingError.message}
            </p>
          </Box>
        ) : streamingLoading && !streamingData ? (
          <SectionLoadingBox label="live streaming swaps" />
        ) : (
          <StreamingSwapsTable data={streamingData} />
        )}
      </div>
    </>
  );
}

export default Swaps;
