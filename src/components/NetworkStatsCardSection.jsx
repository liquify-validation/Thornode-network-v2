import { useMemo } from "react";
import PropTypes from "prop-types";
import LoadingSpinner from "./LoadingSpinner";
import { useNetworkData } from "../hooks/useNetworkData";
import { useMimirData } from "../hooks/useMimirData";
import { useNodeSummaryData } from "../hooks/useNodeData";
import { useBondData } from "../hooks/useBondData";
import { usePriceData } from "../hooks/usePriceData";
import { useMaxEffectiveStakeData } from "../hooks/useMaxEffectiveStakeData";
import { usePoolStats } from "../hooks/usePoolsData";
import { useSwapStats } from "../hooks/useSwapsData";
import NetworkStatsCard from "./NetworkStatsCard";

function formatNumber(value, digits = 0) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "--";
  return num.toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

function formatRune(value, digits = 0) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "--";
  return `R ${num.toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })}`;
}

function formatUsd(value, digits = 2) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "--";
  return `$ ${num.toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })}`;
}

function parseMimir(raw) {
  if (!raw) return {};
  if (raw.mimir_data) {
    return typeof raw.mimir_data === "string"
      ? JSON.parse(raw.mimir_data)
      : raw.mimir_data;
  }
  return raw;
}

function miniSeries(data = [], key) {
  return data.slice(-12).map((item) => ({
    value: Number(item[key] || 0),
  }));
}

function formatDurationObject(value) {
  if (!value) return "--";

  const days = Number(value.days || 0);
  const hours = Number(value.hours || 0);
  const minutes = Number(value.minutes || 0);

  if (![days, hours, minutes].every(Number.isFinite)) return "--";
  return `${days}d ${hours}h ${minutes}m`;
}

function getChurnSummary(networkData) {
  if (!networkData) return "--";
  if (networkData.retiring === true || networkData.retiring === "true") {
    return "Churning";
  }
  if (networkData.churnTry) {
    return `Retry in ${formatDurationObject(networkData.timeUntilRetry)}`;
  }
  return formatDurationObject(networkData.timeUntilChurn);
}

const NetworkStatsCardSection = ({ className = "" }) => {
  const networkQuery = useNetworkData();
  const mimirQuery = useMimirData();
  const bondQuery = useBondData();
  const priceQuery = usePriceData();
  const maxStakeQuery = useMaxEffectiveStakeData();
  const poolStatsQuery = usePoolStats();
  const swapStatsQuery = useSwapStats();
  const nodeSummaryQuery = useNodeSummaryData();

  const networkData = networkQuery.data;
  const nodeSummary = nodeSummaryQuery.data;

  const mimir = useMemo(() => {
    try {
      return parseMimir(mimirQuery.data);
    } catch {
      return {};
    }
  }, [mimirQuery.data]);

  const haltSummary = useMemo(() => {
    try {
      const halts = networkData?.halts ? JSON.parse(networkData.halts) : {};
      const activeHalts = Object.entries(halts).flatMap(([chain, states]) =>
        Object.entries(states || {})
          .filter(([, value]) => Number(value) !== 0)
          .map(([state]) => `${chain} ${state}`),
      );
      return activeHalts.length ? activeHalts.join(", ") : "None";
    } catch {
      return "Unknown";
    }
  }, [networkData]);

  const cards = useMemo(() => {
    const poolStats = poolStatsQuery.data || {};
    const swapStats = swapStatsQuery.data || {};
    const coingecko = networkData?.coingecko || {};
    const blocksUntilChurn = Number(networkData?.blocksUntilChurn || 0);
    const churnInterval = Number(networkData?.churnInterval || 0);
    const churnNumber =
      churnInterval > 0
        ? Math.max(0, Math.floor(Number(networkData?.lastChurn || 0) / churnInterval))
        : 0;
    const activeNodeCount = Number(nodeSummary?.activeNodeCount || 0);
    const standbyNodeCount = Number(nodeSummary?.standbyNodeCount || 0);
    const totalBondedRune = Number(nodeSummary?.totalBondedRune || 0);
    const networkVersion = nodeSummary?.maxVersion || "Unknown";

    return [
      {
        title: `Mainnet ${networkVersion}`,
        stats: [
          {
            subtitle: "Current Block",
            value: formatNumber(networkData?.maxHeight),
          },
          {
            subtitle: "Blocktime",
            value: `${formatNumber(networkData?.secondsPerBlock, 2)} s`,
          },
          {
            subtitle: "Time Until Churn",
            value: getChurnSummary(networkData),
          },
        ],
        chartData: miniSeries(priceQuery.data, "price"),
      },
      {
        title: "Bonds",
        stats: [
          {
            subtitle: "Total Bonded",
            value: formatRune(totalBondedRune, 0),
          },
          {
            subtitle: "Max Effective",
            value: formatRune(Number(networkData?.maxEffectiveStake) / 1e8, 0),
          },
          {
            subtitle: "Desired Set",
            value: formatNumber(mimir.DESIREDVALIDATORSET),
          },
          {
            subtitle: "New / Churn",
            value: formatNumber(mimir.NUMBEROFNEWNODESPERCHURN),
          },
        ],
        chartData: miniSeries(bondQuery.data, "bondValue"),
      },
      {
        title: `Validators #${activeNodeCount || "--"}`,
        stats: [
          {
            subtitle: "Active",
            value: formatNumber(activeNodeCount),
          },
          {
            subtitle: "Standby",
            value: formatNumber(standbyNodeCount),
          },
          {
            subtitle: "Optimal Threshold",
            value: formatRune(Number(networkData?.maxEffectiveStake) / 1e8, 0),
          },
          {
            subtitle: "Version",
            value: networkVersion,
          },
        ],
        chartData: miniSeries(maxStakeQuery.data, "bondValue"),
      },
      {
        title: `Churn #${churnNumber}`,
        stats: [
          {
            subtitle: "Last",
            value: formatNumber(networkData?.lastChurn),
          },
          {
            subtitle: "Next",
            value: formatNumber(
              Number(networkData?.lastChurn || 0) + churnInterval,
            ),
          },
          {
            subtitle: networkData.churnTry ? "Overdue By" : "Blocks Left",
            value: formatNumber(
              networkData.churnTry
                ? Math.max(0, -blocksUntilChurn)
                : blocksUntilChurn,
            ),
          },
          {
            subtitle: "Retry",
            value: formatNumber(networkData?.blocksUntilRetry),
          },
        ],
        chartData: miniSeries(bondQuery.data, "bondValue"),
      },
      {
        title: "Liquidity & Swaps",
        stats: [
          {
            subtitle: "RUNE Depth",
            value: formatRune(Number(poolStats.runeDepth) / 1e8, 0),
          },
          {
            subtitle: "Swaps 24h",
            value: formatNumber(swapStats.count_24h ?? poolStats.swapCount24h),
          },
          {
            subtitle: "Volume 24h",
            value: formatUsd(swapStats.volume_24h_usd, 0),
          },
          {
            subtitle: "Live Streaming",
            value: formatNumber(swapStats.live_streaming),
          },
        ],
        chartData: miniSeries(bondQuery.data, "bondValue"),
      },
      {
        title: "Price",
        stats: [
          {
            subtitle: "Current",
            value: formatUsd(coingecko.current_price, 4),
          },
          {
            subtitle: "24h High",
            value: formatUsd(coingecko.high_24h, 4),
          },
          {
            subtitle: "24h Low",
            value: formatUsd(coingecko.low_24h, 4),
          },
          {
            subtitle: "24h Change",
            value: `${formatNumber(coingecko.price_change_percentage_24h, 2)}%`,
          },
        ],
        chartData: miniSeries(priceQuery.data, "price"),
      },
      {
        title: "External (CoinGecko)",
        stats: [
          {
            subtitle: "Market Cap",
            value: formatUsd(coingecko.market_cap, 0),
          },
          {
            subtitle: "Volume 24h",
            value: formatUsd(coingecko.total_volume, 0),
          },
          {
            subtitle: "Market Rank",
            value: formatNumber(coingecko.market_cap_rank),
          },
          {
            subtitle: "Supply",
            value: formatRune(coingecko.circulating_supply, 0),
          },
        ],
        chartData: miniSeries(priceQuery.data, "price"),
      },
      {
        title: "Limits",
        stats: [
          {
            subtitle: "Max Liquidity",
            value: formatRune(Number(mimir.MAXIMUMLIQUIDITYRUNE) / 1e8, 0),
          },
          {
            subtitle: "Min RunePool",
            value: formatRune(Number(mimir.MINRUNEPOOLDEPTH) / 1e8, 0),
          },
          {
            subtitle: "Min Bond",
            value: formatRune(Number(mimir.MINIMUMBONDINRUNE) / 1e8, 0),
          },
          {
            subtitle: "Halt Flags",
            value: haltSummary,
          },
        ],
        chartData: miniSeries(maxStakeQuery.data, "bondValue"),
      },
    ];
  }, [
    bondQuery.data,
    haltSummary,
    maxStakeQuery.data,
    mimir,
    nodeSummary,
    networkData,
    poolStatsQuery.data,
    swapStatsQuery.data,
    priceQuery.data,
  ]);

  if (!networkData && networkQuery.isLoading) {
    return (
      <div className="p-2 mt-12 h-[55vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (networkQuery.error && !networkData) {
    return <div className="p-4 text-red-500">Error: {networkQuery.error.message}</div>;
  }

  return (
    <div className={`grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 ${className}`.trim()}>
      {cards.map((card) => (
        <NetworkStatsCard
          key={card.title}
          title={card.title}
          stats={card.stats}
          chartData={card.chartData}
        />
      ))}
    </div>
  );
};

export default NetworkStatsCardSection;

NetworkStatsCardSection.propTypes = {
  className: PropTypes.string,
};
