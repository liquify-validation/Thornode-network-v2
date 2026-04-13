import { useMemo } from "react";
import { Helmet } from "react-helmet";
import { LoadingSpinner, NetworkStatsCard, NetworkTable } from "../components";
import { useNetworkData } from "../hooks/useNetworkData";
import { useNetworkChurns } from "../hooks/useNetworkChurns";

function formatNumber(value, digits = 0) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "â€”";
  return num.toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

function formatPercent(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "â€”";
  return `${num.toFixed(2)}%`;
}

function formatDuration(seconds) {
  const total = Math.max(0, Number(seconds) || 0);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function formatApproxDate(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "â€”";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function Churns() {
  const {
    data: networkData,
    isLoading: networkLoading,
    error: networkError,
  } = useNetworkData();
  const {
    data: churns,
    isLoading: churnsLoading,
    error: churnsError,
  } = useNetworkChurns();

  const chartData = useMemo(() => {
    if (!Array.isArray(churns)) return [];
    return [...churns]
      .sort((a, b) => a - b)
      .slice(-12)
      .map((height, index, ordered) => ({
        value: index === 0 ? 0 : height - ordered[index - 1],
      }));
  }, [churns]);

  const topCards = useMemo(() => {
    if (!networkData || !Array.isArray(churns)) return [];

    const ordered = [...churns].sort((a, b) => b - a);
    const currentHeight = Number(networkData.maxHeight || 0);
    const lastChurn = Number(networkData.lastChurn || 0);
    const interval = Number(networkData.churnInterval || 0);
    const nextChurn = lastChurn + interval;
    const secondsPerBlock = Number(networkData.secondsPerBlock || 0);
    const blocksSinceLastChurn = Number(
      networkData.blocksSinceLastChurn ?? Math.max(0, currentHeight - lastChurn),
    );
    const blocksUntilChurn = Number(
      networkData.blocksUntilChurn ?? nextChurn - currentHeight,
    );
    const completedCycleBlocks =
      interval > 0
        ? Math.max(0, Math.min(blocksSinceLastChurn, interval))
        : Math.max(0, blocksSinceLastChurn);
    const pendingBlocks = Math.max(0, blocksUntilChurn);
    const overdueBlocks = Math.max(0, -blocksUntilChurn);
    const progress = interval > 0 ? (completedCycleBlocks / interval) * 100 : 0;
    const elapsedSeconds = blocksSinceLastChurn * secondsPerBlock;
    const totalSeconds = interval * secondsPerBlock;
    const retrySeconds = Number(networkData.secondsUntilRetry || 0);
    const isCurrentlyChurning = networkData.retiring === "true";
    const isRetryWindow = Boolean(networkData.churnTry) && !isCurrentlyChurning;

    const approxStart = new Date(Date.now() - elapsedSeconds * 1000);
    const approxFinish = new Date(
      Date.now() + blocksUntilChurn * secondsPerBlock * 1000,
    );
    const statusValue = isCurrentlyChurning
      ? "Churning"
      : isRetryWindow
        ? "Awaiting Retry"
        : "On Schedule";

    return [
      {
        title: `Churn #${ordered.length}`,
        stats: [
          {
            subtitle: "Block",
            value: `${formatNumber(completedCycleBlocks)} / ${formatNumber(interval)}`,
          },
          {
            subtitle: "Progress",
            value: formatPercent(progress),
          },
          {
            subtitle: "Status",
            value: statusValue,
          },
        ],
        chartData,
      },
      {
        title: "Start",
        stats: [
          {
            subtitle: "Height",
            value: formatNumber(lastChurn),
          },
          {
            subtitle: "Approx Event",
            value: formatApproxDate(approxStart),
          },
          {
            subtitle: "Elapsed",
            value: formatDuration(elapsedSeconds),
          },
          {
            subtitle: "Blocks Since Last",
            value: formatNumber(blocksSinceLastChurn),
          },
        ],
        chartData,
      },
      {
        title: isRetryWindow ? "Retry" : isCurrentlyChurning ? "Churning" : "Finish",
        stats: isRetryWindow
          ? [
              {
                subtitle: "Scheduled Height",
                value: formatNumber(nextChurn),
              },
              {
                subtitle: "Scheduled Event",
                value: formatApproxDate(approxFinish),
              },
              {
                subtitle: "Overdue Blocks",
                value: formatNumber(overdueBlocks),
              },
              {
                subtitle: "Retry In",
                value: formatDuration(retrySeconds),
              },
            ]
          : [
              {
                subtitle: "Height",
                value: formatNumber(nextChurn),
              },
              {
                subtitle: "Approx Event",
                value: formatApproxDate(approxFinish),
              },
              {
                subtitle: "Cycle Duration",
                value: formatDuration(totalSeconds),
              },
              {
                subtitle: isCurrentlyChurning ? "Blocks Overdue" : "Pending Blocks",
                value: formatNumber(
                  isCurrentlyChurning ? overdueBlocks : pendingBlocks,
                ),
              },
            ],
        chartData,
      },
    ];
  }, [chartData, churns, networkData]);

  const tableRows = useMemo(() => {
    if (!Array.isArray(churns) || !networkData) return [];

    const ordered = [...churns].sort((a, b) => b - a);
    const secondsPerBlock = Number(networkData.secondsPerBlock || 0);

    return ordered.map((height, index) => {
      const previousHeight = ordered[index + 1];
      const deltaBlocks = previousHeight ? height - previousHeight : null;
      const blocksAgo = Number(networkData.maxHeight || 0) - height;
      const approxDaysAgo = (blocksAgo * secondsPerBlock) / 86400;

      return {
        height: formatNumber(height),
        type:
          height === Number(networkData.lastChurn)
            ? "Last Churn"
            : index === 0
              ? "Most Recent Indexed"
              : "Historical",
        cycleBlocks: deltaBlocks ? formatNumber(deltaBlocks) : "â€”",
        blocksAgo: formatNumber(blocksAgo),
        approxAge: Number.isFinite(approxDaysAgo)
          ? `${formatNumber(approxDaysAgo, 2)} d`
          : "â€”",
      };
    });
  }, [churns, networkData]);

  const columns = useMemo(
    () => [
      { Header: "Height", accessor: "height" },
      { Header: "Type", accessor: "type" },
      { Header: "Cycle Blocks", accessor: "cycleBlocks" },
      { Header: "Blocks Ago", accessor: "blocksAgo" },
      { Header: "Approx Age", accessor: "approxAge" },
    ],
    [],
  );

  if (networkLoading || churnsLoading) {
    return (
      <div className="p-2 mt-12 h-[55vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (networkError || churnsError) {
    return (
      <div className="p-4 text-red-500">
        Error: {(networkError || churnsError)?.message}
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>THORChain Network Explorer | Churns</title>
      </Helmet>
      <div className="p-2 mt-12">
        <div className="mb-8">
          <h1 className="text-2xl text-gray-800 dark:text-white font-bold mb-3">
            Churns
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-300 max-w-3xl">
            Live churn status and indexed churn history. Exact event timestamps
            and retry counts are not exposed by the current backend, so the
            start and finish timestamps shown here are approximate and derived
            from current height and average seconds per block.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
          {topCards.map((card) => (
            <NetworkStatsCard
              key={card.title}
              title={card.title}
              stats={card.stats}
              chartData={card.chartData}
            />
          ))}
        </div>

        <NetworkTable
          title="Indexed Churn History"
          columns={columns}
          data={tableRows}
        />
      </div>
    </>
  );
}

export default Churns;
