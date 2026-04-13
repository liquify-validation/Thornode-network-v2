/* eslint-disable react/prop-types */
import { useMemo } from "react";
import { Helmet } from "react-helmet";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  LoadingSpinner,
  ModernDivider,
  NetworkStatsCard,
  NetworkTable,
} from "../components";
import Box from "../ui/Box";
import { useMimirData } from "../hooks/useMimirData";
import { useNetworkData } from "../hooks/useNetworkData";
import { usePoolsData, usePoolStats } from "../hooks/usePoolsData";
import {
  AaveIcon,
  AtomIcon,
  AvalancheIcon,
  BitcoinCashIcon,
  BitcoinIcon,
  BnbIcon,
  BUSDIcon,
  DAIIcon,
  DogeIcon,
  EthIcon,
  FOXIcon,
  GUSDIcon,
  LINKIcon,
  LitecoinLogo,
  LUSDIcon,
  PAXOSIcon,
  RUJIIcon,
  SolIcon,
  TetherIcon,
  ThorIcon,
  TronIcon,
  TrustWalletIcon,
  USDCIcon,
  VeniceAiIcon,
  XrpIcon,
  YIFIIcon,
} from "../assets";

const DONUT_COLORS = [
  "#3174C7",
  "#D3AE3F",
  "#488E7C",
  "#4968A4",
  "#1CBF8E",
  "#D24848",
  "#9A9A9A",
  "#E39B2E",
];

const assetIconEntries = [
  { ticker: "AAVE", icon: AaveIcon, label: "AAVE" },
  { ticker: "ATOM", icon: AtomIcon, label: "ATOM" },
  { ticker: "AVAX", icon: AvalancheIcon, label: "AVAX" },
  { ticker: "BCH", icon: BitcoinCashIcon, label: "BCH" },
  { ticker: "BNB", icon: BnbIcon, label: "BNB" },
  { ticker: "BTC", icon: BitcoinIcon, label: "BTC" },
  { ticker: "BTCB", icon: BitcoinIcon, label: "BTC reuse" },
  { ticker: "BUSD", icon: BUSDIcon, label: "BUSD" },
  { ticker: "DAI", icon: DAIIcon, label: "DAI" },
  { ticker: "DOGE", icon: DogeIcon, label: "DOGE" },
  { ticker: "ETH", icon: EthIcon, label: "ETH" },
  { ticker: "FOX", icon: FOXIcon, label: "FOX" },
  { ticker: "GUSD", icon: GUSDIcon, label: "GUSD" },
  { ticker: "LINK", icon: LINKIcon, label: "LINK" },
  { ticker: "LTC", icon: LitecoinLogo, label: "LTC" },
  { ticker: "LUSD", icon: LUSDIcon, label: "LUSD" },
  { ticker: "RUJI", icon: RUJIIcon, label: "RUJI" },
  { ticker: "RUNE", icon: ThorIcon, label: "THOR reuse" },
  { ticker: "SOL", icon: SolIcon, label: "SOL" },
  { ticker: "TCY", icon: ThorIcon, label: "THOR reuse" },
  { ticker: "TGT", icon: ThorIcon, label: "THOR reuse" },
  { ticker: "THOR", icon: ThorIcon, label: "THOR" },
  { ticker: "TRX", icon: TronIcon, label: "TRX" },
  { ticker: "TWT", icon: TrustWalletIcon, label: "Trust Wallet" },
  { ticker: "USDC", icon: USDCIcon, label: "USDC" },
  { ticker: "USDP", icon: PAXOSIcon, label: "Pax Dollar" },
  { ticker: "USDT", icon: TetherIcon, label: "USDT" },
  { ticker: "VTHOR", icon: ThorIcon, label: "THOR reuse" },
  { ticker: "VVV", icon: VeniceAiIcon, label: "Venice AI" },
  { ticker: "WBTC", icon: BitcoinIcon, label: "BTC reuse" },
  { ticker: "XRP", icon: XrpIcon, label: "XRP" },
  { ticker: "XRUNE", icon: ThorIcon, label: "THOR reuse" },
  { ticker: "YFI", icon: YIFIIcon, label: "YFI" },
];

const assetIconMap = Object.fromEntries(
  assetIconEntries.map((entry) => [entry.ticker, entry.icon]),
);

function fromBaseUnits(value) {
  const num = Number(value) / 1e8;
  return Number.isFinite(num) ? num : null;
}

function formatNumber(value, digits = 0) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "--";
  return num.toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

function formatUsd(value, digits = 2) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "--";
  return `$ ${num.toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })}`;
}

function formatRune(value, digits = 0) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "--";
  return `R ${num.toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })}`;
}

function formatPercent(value, digits = 2) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "--";
  return `${num.toFixed(digits)}%`;
}

function getTicker(asset) {
  const raw = String(asset || "");
  const [, symbolPart = raw] = raw.split(".");
  return symbolPart.split("-")[0].toUpperCase();
}

function getAssetIcon(ticker) {
  return assetIconMap[ticker] || null;
}

function buildRunepoolAssets(pools) {
  const availablePools = Array.isArray(pools) ? pools : [];

  const rows = availablePools
    .map((pool) => {
      const ticker = getTicker(pool.asset);
      const balance = fromBaseUnits(pool.assetDepth);
      const price = Number(pool.assetPriceUSD || 0);
      const valuation =
        Number.isFinite(balance) && Number.isFinite(price)
          ? balance * price
          : 0;

      return {
        asset: ticker,
        price,
        balance,
        valuation,
        runeDepth: fromBaseUnits(pool.runeDepth) || 0,
      };
    })
    .filter((row) => row.valuation > 0)
    .sort((a, b) => b.valuation - a.valuation)
    .slice(0, 8);

  const totalValuation = rows.reduce((sum, row) => sum + row.valuation, 0);

  return rows.map((row) => ({
    ...row,
    tradePoolPct:
      totalValuation > 0 ? (row.valuation / totalValuation) * 100 : 0,
  }));
}

function buildChartData(rows) {
  return rows.map((row) => ({
    value: row.valuation || row.runeDepth || 0,
  }));
}

function DonutLegendItem({ item, index }) {
  const icon = getAssetIcon(item.asset);

  return (
    <div className="flex items-center gap-3">
      <span
        className="block h-3 w-3 rounded-full"
        style={{ backgroundColor: DONUT_COLORS[index % DONUT_COLORS.length] }}
      />
      {icon ? (
        <img src={icon} alt={item.asset} className="h-5 w-5 rounded-full" />
      ) : (
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px]">
          {item.asset.slice(0, 2)}
        </div>
      )}
      <span className="text-sm font-medium">{item.asset}</span>
    </div>
  );
}

function AssetsOverviewTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  const [{ name, value }] = payload;

  return (
    <div className="rounded-xl border border-white/10 bg-[#173449] px-3 py-2 text-sm text-white shadow-lg">
      <div className="font-semibold">{name}</div>
      <div className="text-white/80">{formatUsd(value)}</div>
    </div>
  );
}

function AssetsOverviewCard({ rows }) {
  const pieData = rows.map((row) => ({
    name: row.asset,
    value: row.valuation,
  }));

  return (
    <Box className="h-full overflow-hidden p-5 lg:p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Assets Overview</h2>
        <ModernDivider mt="mt-3" mb="mb-0" ml="ml-0" />
      </div>

      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div className="h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="50%"
                outerRadius="82%"
                paddingAngle={2}
                isAnimationActive={false}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`${entry.name}-${index}`}
                    fill={DONUT_COLORS[index % DONUT_COLORS.length]}
                    stroke="none"
                  />
                ))}
              </Pie>
              <Tooltip content={<AssetsOverviewTooltip />} cursor={false} />
              <text
                x="50%"
                y="48%"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                <tspan x="50%" className="fill-white text-[56px] font-bold">
                  {rows.length}
                </tspan>
                <tspan
                  x="50%"
                  dy="2.2em"
                  className="fill-white/80 text-sm font-semibold"
                >
                  ASSETS
                </tspan>
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-5">
          {rows.map((row, index) => (
            <DonutLegendItem key={row.asset} item={row} index={index} />
          ))}
        </div>
      </div>
    </Box>
  );
}

function AssetsTable({ rows }) {
  const columns = useMemo(
    () => [
      {
        Header: "Asset",
        accessor: "asset",
        Cell: ({ value }) => {
          const icon = getAssetIcon(value);

          return (
            <div className="flex items-center gap-3">
              {icon ? (
                <img src={icon} alt={value} className="h-7 w-7 rounded-full" />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-xs">
                  {value.slice(0, 2)}
                </div>
              )}
              <span className="font-medium">{value}</span>
            </div>
          );
        },
      },
      {
        Header: "Price",
        accessor: "price",
        Cell: ({ value }) => formatUsd(value),
      },
      {
        Header: "Balance",
        accessor: "balance",
        Cell: ({ value }) => formatNumber(value, 2),
      },
      {
        Header: "Valuation",
        accessor: "valuation",
        Cell: ({ value }) => formatUsd(value),
      },
      {
        Header: "Trade Pool",
        accessor: "tradePoolPct",
        Cell: ({ value }) => formatPercent(value),
      },
    ],
    [],
  );

  return (
    <NetworkTable
      title="Assets Overview"
      columns={columns}
      data={rows}
    />
  );
}

function Runepool() {
  const {
    data: pools,
    isLoading: poolsLoading,
    error: poolsError,
  } = usePoolsData("available");
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = usePoolStats();
  const {
    data: networkData,
    isLoading: networkLoading,
    error: networkError,
  } = useNetworkData();
  const {
    data: mimir,
    isLoading: mimirLoading,
    error: mimirError,
  } = useMimirData();

  const isLoading =
    poolsLoading || statsLoading || networkLoading || mimirLoading;
  const error = poolsError || statsError || networkError || mimirError;

  const assetRows = useMemo(() => buildRunepoolAssets(pools), [pools]);
  const chartData = useMemo(() => buildChartData(assetRows), [assetRows]);

  const cards = useMemo(() => {
    const maxLiquidityRune = fromBaseUnits(mimir?.MAXIMUMLIQUIDITYRUNE);
    const currentRuneDepth = fromBaseUnits(stats?.runeDepth);
    const remainingCapacity =
      Number.isFinite(maxLiquidityRune) && Number.isFinite(currentRuneDepth)
        ? Math.max(0, maxLiquidityRune - currentRuneDepth)
        : null;
    const minRunePoolDepth = fromBaseUnits(mimir?.MINRUNEPOOLDEPTH);
    const maturityBlocks = Number(mimir?.RUNEPOOLDEPOSITMATURITYBLOCKS);
    const secondsPerBlock = Number(networkData?.secondsPerBlock || 0);
    const maturityDays =
      Number.isFinite(maturityBlocks) && Number.isFinite(secondsPerBlock)
        ? (maturityBlocks * secondsPerBlock) / 86400
        : null;
    const hasProviderMetrics =
      Number(stats?.dailyActiveUsers || 0) > 0 ||
      Number(stats?.monthlyActiveUsers || 0) > 0 ||
      Number(stats?.uniqueSwapperCount || 0) > 0;

    return [
      {
        title: "System",
        stats: [
          {
            subtitle: "Remaining Capacity",
            value:
              remainingCapacity != null ? formatRune(remainingCapacity) : "--",
          },
          {
            subtitle: "Min Depth",
            value:
              minRunePoolDepth != null ? formatRune(minRunePoolDepth) : "--",
          },
          {
            subtitle: "Enabled",
            value: Number(mimir?.RUNEPOOLENABLED || 0) > 0 ? "YES" : "NO",
          },
        ],
      },
      {
        title: "Reserved",
        stats: [
          {
            subtitle: "Max Backstop",
            value:
              maxLiquidityRune != null ? formatRune(maxLiquidityRune) : "--",
          },
          {
            subtitle: "Used Depth",
            value:
              currentRuneDepth != null ? formatRune(currentRuneDepth) : "--",
          },
          {
            subtitle: "Difference",
            value:
              remainingCapacity != null ? formatRune(remainingCapacity) : "--",
          },
        ],
      },
      {
        title: "Provider",
        stats: [
          {
            subtitle: "Swap Volume",
            value:
              stats?.swapVolume != null
                ? formatRune(fromBaseUnits(stats.swapVolume), 0)
                : "--",
          },
          {
            subtitle: "Users (24h / 30d)",
            value: hasProviderMetrics
              ? `${formatNumber(stats?.dailyActiveUsers || 0)} / ${formatNumber(
                  stats?.monthlyActiveUsers || 0,
                )}`
              : "Not Exposed",
          },
          {
            subtitle: "Unique Swappers",
            value: hasProviderMetrics
              ? formatNumber(stats?.uniqueSwapperCount || 0)
              : "Not Exposed",
          },
        ],
      },
      {
        title: "Maturity",
        stats: [
          {
            subtitle: "Days",
            value: maturityDays != null ? formatNumber(maturityDays, 2) : "--",
          },
          {
            subtitle: "Blocks",
            value: Number.isFinite(maturityBlocks)
              ? formatNumber(maturityBlocks)
              : "--",
          },
          {
            subtitle: "Blocktime",
            value: secondsPerBlock
              ? `${formatNumber(secondsPerBlock, 2)}s`
              : "--",
          },
        ],
      },
    ];
  }, [mimir, networkData, stats]);

  if (isLoading) {
    return (
      <div className="mt-12 h-[55vh] p-2">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  }

  return (
    <>
      <Helmet>
        <title>THORChain Network Explorer | Runepool</title>
      </Helmet>

      <div className="p-4">
        <div className="mb-8">
          <h1 className="mb-3 text-2xl font-bold text-gray-800 dark:text-white">
            Runepool
          </h1>
          <p className="max-w-4xl text-sm text-gray-500 dark:text-gray-300">
            Current Liquify endpoints do not expose a dedicated RunePool
            payload, so this page uses live pool, pool-stat, network, and Mimir
            data as the closest available backend fit. Provider user counts are
            also not exposed by the current `/pools/stats` payload.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="xl:col-span-6">
            <AssetsOverviewCard rows={assetRows} />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:col-span-6">
            {cards.map((card) => (
              <NetworkStatsCard
                key={card.title}
                title={card.title}
                stats={card.stats}
                chartData={chartData}
              />
            ))}
          </div>
        </div>

        <AssetsTable rows={assetRows} />
      </div>
    </>
  );
}

export default Runepool;
