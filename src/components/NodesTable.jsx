/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext, useRef } from "react";
import { createPortal } from "react-dom";
import { useTable, useSortBy, usePagination } from "react-table";
import {
  TableIcons,
  ChainStatusCell,
  Pagination,
  InfoPopover,
  LoadingSpinner,
  BondProvidersTable,
  NodeDrawer,
} from "../components";

import {
  chainIcons,
  copyToClipboard,
  getNodeEndpointUrl,
  ispLogos,
  ispLogoClasses,
  defaultIspLogo,
  cityToCountryMap,
  useViewport,
} from "../utilities/commonFunctions";
import { getHaltWarning, getHaltsData } from "../utilities/getHaltWarning";
import { getNodeChartConfig } from "../utilities/nodeChartConfig";
import {
  baseUnitsToWholeRune,
  parseFiniteNumber,
} from "../utilities/nodeFormatters";

import useNodeChartQueries from "../hooks/useNodeChartQueries";
import NodeChartModal from "./NodeChartModal";
import NodeChartRenderer from "./NodeChartRenderer";

import {
  DownArrow,
  JailIcon,
  LeaveIcon,
  UpArrow,
} from "../assets";

import { GlobalDataContext } from "../context/GlobalDataContext";
import { FavouriteIcon, UnfavouriteIcon } from "../assets";

const RESPONSIVE_HIDDEN_COLUMNS = ["health"];

function NodeAddressCell({ value, last4, node, copyToClipboard, onOpenChart }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (hovered && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, left: rect.left });
    }
  }, [hovered]);

  return (
    <>
      <span
        ref={ref}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => copyToClipboard(value)}
        style={{ cursor: "pointer", textDecoration: "underline" }}
        title="Click to copy"
      >
        {last4}
      </span>
      {hovered &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: pos.top,
              left: pos.left,
            }}
            className="z-[9999] flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-xl shadow-lg whitespace-nowrap"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <TableIcons node={node} onOpenChart={onOpenChart} />
          </div>,
          document.getElementById("popover-root")
        )}
    </>
  );
}

const NodesTable = ({
  data,
  setAllColumns,
  maxChainHeights,
  globalData,
  isDark,
  isSidebarExpanded,
  currentTab,
  isFiltering,
  hiddenColumns,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedNodeAddress, setSelectedNodeAddress] = useState(null);
  const [selectedChartType, setSelectedChartType] = useState(null);
  const [showProvidersModal, setShowProvidersModal] = useState(false);
  const [providersData, setProvidersData] = useState([]);
  const [drawerNode, setDrawerNode] = useState(null);
  const width = useViewport();
  const isSmall = width < 1300;

  const { isFavorite, addToFavorites, removeFromFavorites } =
    useContext(GlobalDataContext);

  const coingeckoData = React.useMemo(() => {
    if (!globalData || !globalData.coingecko) return {};
    return globalData.coingecko;
  }, [globalData]);

  const runeCurrentPrice = parseFiniteNumber(coingeckoData.current_price);

  const chartQueries = useNodeChartQueries(selectedNodeAddress);

  const handleOpenChart = (nodeAddress, chartType) => {
    setSelectedNodeAddress(nodeAddress);
    setSelectedChartType(chartType);
    setShowModal(true);
  };

  const favouriteAwareSort = React.useCallback(
    (rowA, rowB, columnId, desc) => {
      const favA = isFavorite(rowA.original.node_address);
      const favB = isFavorite(rowB.original.node_address);

      if (favA !== favB) {
        return favA ? (desc ? +1 : -1) : desc ? -1 : +1;
      }

      const a = rowA.values[columnId];
      const b = rowB.values[columnId];
      if (a === b) return 0;
      return a > b ? 1 : -1;
    },
    [isFavorite]
  );
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedNodeAddress(null);
    setSelectedChartType(null);
  };

  const renderChartContent = () => {
    const currentQuery = chartQueries[selectedChartType];
    const chartConfig = getNodeChartConfig(selectedChartType);

    if (!currentQuery) return <div>No data available</div>;
    const { data, isLoading, isFetching, isFetched, error } = currentQuery;
    const hasData = Boolean(data?.length);
    const isWaitingForInitialData =
      !error && (isLoading || (isFetching && !hasData));

    if (isWaitingForInitialData) return <LoadingSpinner />;
    if (error) return <div className="text-red-400">{error.message}</div>;
    if (isFetched && !isFetching && !hasData) return <div>No data</div>;
    if (!chartConfig) return <div>No data available</div>;

    return (
      <NodeChartRenderer
        chartType={selectedChartType}
        data={data}
        isDark={isDark}
        title={chartConfig.title}
        showHeader={false}
      />
    );
  };

  function getRowHighlightClass(action) {
    switch (action) {
      case "Oldest":
      case "Smallest Bond":
        return "bg-orange-400 dark:bg-blue-600";
      case "Worst Performer":
        return "bg-red-400 dark:bg-orange-400";
      default:
        return "";
    }
  }

  const handleProvidersClick = (providers) => {
    setProvidersData(providers);
    setShowProvidersModal(true);
  };

  const maxScore = React.useMemo(() => {
    let max = 0;
    for (const n of data || []) {
      const v = parseFloat(n?.score);
      if (isFinite(v) && v > max) max = v;
    }
    return max;
  }, [data]);

  const scoreColor = React.useCallback(
    (score) => {
      if (!isFinite(score) || maxScore <= 0) return "#9ca3af";
      const ratio = Math.max(0, Math.min(1, score / maxScore));
      const hue = Math.round(ratio * 140);
      return `hsl(${hue}, 72%, 55%)`;
    },
    [maxScore]
  );

  const maxSlashes = React.useMemo(() => {
    let max = 0;
    for (const n of data || []) {
      const v = parseFloat(n?.slash_points);
      if (isFinite(v) && v > max) max = v;
    }
    return max;
  }, [data]);

  const slashColor = React.useCallback(
    (slashes) => {
      if (!isFinite(slashes) || maxSlashes <= 0) return "#4ade80";
      const ratio = Math.max(0, Math.min(1, slashes / maxSlashes));
      const hue = Math.round((1 - ratio) * 140);
      return `hsl(${hue}, 72%, 55%)`;
    },
    [maxSlashes]
  );

  const columns = React.useMemo(() => {
    let newCols = [
      {
        Header: () => (
          <span role="img" aria-label="Favourite">
            ❤️
          </span>
        ),
        id: "favourite",
        accessor: "favorite",
        disableSortBy: true,
        Cell: ({ row }) => {
          const node = row.original;
          const favorite = isFavorite(node.node_address);

          const handleFavoriteClick = () => {
            if (favorite) {
              removeFromFavorites(node.node_address);
            } else {
              addToFavorites(node.node_address);
            }
          };

          return (
            <img
              src={favorite ? FavouriteIcon : UnfavouriteIcon}
              alt="Favorite"
              className="w-5 h-5 cursor-pointer invert dark:invert-0 mx-auto"
              onClick={handleFavoriteClick}
            />
          );
        },
      },
      {
        Header: "Nodes",
        id: "nodes",
        accessor: "node_address",
        disableSortBy: true,
        Cell: ({ value, row }) => {
          const last4 = value.slice(-4);
          return (
            <NodeAddressCell
              value={value}
              last4={last4}
              node={row.original}
              copyToClipboard={copyToClipboard}
              onOpenChart={handleOpenChart}
            />
          );
        },
      },
      {
        Header: (
          <InfoPopover title="Age" text="Measured in days">
            <span>Age</span>
          </InfoPopover>
        ),
        id: "age",
        accessor: "age",
        Cell: ({ value }) => {
          const numeric = parseFloat(value);
          if (!isFinite(numeric)) return "-";
          return (
            <span
              className={`tabular-nums ${
                numeric >= 180 ? "text-orange-400 font-semibold" : ""
              }`}
            >
              {numeric.toFixed(2)}
            </span>
          );
        },
      },
      {
        Header: "Info",
        id: "info",
        accessor: "action",
        Cell: ({ row }) => {
          const { action, forced_to_leave, requested_to_leave, is_jailed, jail } = row.original;
          const isForcedToLeave =
            forced_to_leave === 1 || forced_to_leave === "1" || forced_to_leave === true;
          const hasRequestedToLeave =
            requested_to_leave === 1 || requested_to_leave === "1" || requested_to_leave === true;
          const isLeaving = isForcedToLeave || hasRequestedToLeave;
          const isJailed =
            is_jailed === 1 || is_jailed === "1" || is_jailed === true;
          const normalizedAction =
            typeof action === "string" ? action.trim() : "";
          const hasActionLabel =
            normalizedAction && normalizedAction !== "-";

          if (hasActionLabel) {
            return (
              <div className="flex items-center justify-center gap-1">
                <span>{normalizedAction}</span>
              </div>
            );
          }

          if (isLeaving) {
            return (
              <div className="flex items-center justify-center gap-1">
                <InfoPopover
                  title="Leaving"
                  text={isForcedToLeave ? "Forced to leave" : "Requested to leave"}
                >
                  <img
                    src={LeaveIcon}
                    alt="Leave"
                    className="w-4 h-4 inline invert dark:invert-0"
                  />
                </InfoPopover>
              </div>
            );
          }

          if (isJailed) {
            const jailText = jail ? (
              <>
                Release Height: {jail.release_height ?? "-"}
                <br />
                Reason: {jail.reason || "-"}
              </>
            ) : (
              "Node is jailed"
            );

            return (
              <div className="flex items-center justify-center gap-1">
                <InfoPopover title="Jailed Information" text={jailText}>
                  <img
                    src={JailIcon}
                    alt="Jailed"
                    className="w-4 h-4 inline invert dark:invert-0"
                  />
                </InfoPopover>
              </div>
            );
          }

          return (
            <div className="flex items-center justify-center gap-1">
              <span>-</span>
            </div>
          );
        },
      },
      {
        Header: (
          <InfoPopover
            title="Leave"
            text="Forced or requested to leave the active set"
          >
            <span>Leave</span>
          </InfoPopover>
        ),
        id: "leave",
        accessor: (row) => {
          const f = row.forced_to_leave;
          const r = row.requested_to_leave;
          const forced = f === 1 || f === "1" || f === true;
          const requested = r === 1 || r === "1" || r === true;
          return forced ? 2 : requested ? 1 : 0;
        },
        Cell: ({ row }) => {
          const { forced_to_leave, requested_to_leave } = row.original;
          const forced =
            forced_to_leave === 1 || forced_to_leave === "1" || forced_to_leave === true;
          const requested =
            requested_to_leave === 1 ||
            requested_to_leave === "1" ||
            requested_to_leave === true;
          const leaving = forced || requested;

          const color = leaving ? "#4ade80" : "#475569";
          const label = forced
            ? "Forced to leave"
            : requested
              ? "Requested to leave"
              : "Staying";

          return (
            <div className="flex items-center justify-center">
              <InfoPopover title="Leave" text={label}>
                <span
                  className="inline-block w-2 h-2 rounded-full ring-2 ring-[#17364c] dark:ring-[#17364c]"
                  style={{
                    backgroundColor: color,
                    boxShadow: leaving ? `0 0 6px ${color}` : "none",
                    opacity: leaving ? 1 : 0.5,
                  }}
                />
              </InfoPopover>
            </div>
          );
        },
      },
      {
        Header: (
          <InfoPopover title="ISP" text="Internet Service Provider">
            <span>ISP</span>
          </InfoPopover>
        ),
        id: "isp",
        accessor: "isp",
        width: 90,
        maxWidth: 120,
        Cell: ({ value }) => {
          const ispName = value || "-";
          const mappedLogo = ispLogos[ispName];
          const shouldUseDefaultLogo = ispName !== "-" && !mappedLogo;
          const logo = mappedLogo || (shouldUseDefaultLogo ? defaultIspLogo : null);
          const logoClassName =
            ispLogoClasses[ispName] || ispLogoClasses.default;

          if (logo) {
            return (
              <div className="flex items-center justify-center px-1 bg-transparent">
                <InfoPopover
                  title={shouldUseDefaultLogo ? "Provider (Default Icon)" : "Provider"}
                  text={ispName}
                >
                  <img
                    src={logo}
                    alt={ispName}
                    className={logoClassName}
                  />
                </InfoPopover>
              </div>
            );
          } else {
            return ispName;
          }
        },
      },
      {
        Header: "Location",
        id: "location",
        accessor: (row) => row.location || row.country_code,
        Cell: ({ row }) => {
          const { location, country_code } = row.original;
          const city = location || "";
          const codeFromMap = cityToCountryMap[city] || null;
          const finalCode = codeFromMap || country_code;

          if (!finalCode) {
            return location || "-";
          }
          return (
            <InfoPopover title="City" text={city}>
              <span>{finalCode}</span>
            </InfoPopover>
          );
        },
      },
      {
        Header: (
          <InfoPopover
            title="Bonders Info"
            text="Number of addresses whitelisted to a node."
          >
            <span>Bonders</span>
          </InfoPopover>
        ),
        id: "bonders",
        accessor: (row) => row.bond_providers?.providers?.length || 0,
        Cell: ({ row }) => {
          const bondProvidersData = row.original.bond_providers;
          if (!bondProvidersData || !bondProvidersData.providers) return "-";

          const providers = bondProvidersData.providers;
          if (!Array.isArray(providers) || providers.length === 0) return "0";

          return (
            <span
              className="underline cursor-pointer"
              onClick={() => handleProvidersClick(providers)}
            >
              {providers.length}
            </span>
          );
        },
      },
      {
        Header: "Fee",
        id: "fee",
        accessor: (row) => {
          const bp = row.bond_providers;
          if (!bp || !bp.node_operator_fee) return null;
          return parseFloat(bp.node_operator_fee) / 100;
        },
        Cell: ({ row }) => {
          const bp = row.original.bond_providers;
          if (!bp || !bp.node_operator_fee) return "-";
          const feeValue = parseFloat(bp.node_operator_fee);
          const percentage = (feeValue / 100).toFixed(2);
          return `${percentage}%`;
        },
      },
      {
        Header: "Bond",
        id: "bond",
        accessor: "bond",
        Cell: ({ row }) => {
          const nodeAddress = row.original.node_address;
          const latestBondBaseUnits = parseFiniteNumber(row.original.bond);

          if (latestBondBaseUnits <= 0) return "-";

          const latestBond = baseUnitsToWholeRune(latestBondBaseUnits);
          const latestDollarBond = (latestBond * runeCurrentPrice).toLocaleString(
            undefined,
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          );

          return (
            <InfoPopover
              title="Bond Value in $"
              text={`$${latestDollarBond}`}
            >
              <span
                className="cursor-pointer underline tabular-nums font-medium text-gray-700 dark:text-[#A9F3DB]"
                onClick={() => handleOpenChart(nodeAddress, "bond")}
              >
                ᚱ{latestBond.toLocaleString()}
              </span>
            </InfoPopover>
          );
        },
      },
      {
        Header: "Rewards",
        id: "rewards",
        accessor: "current_award",
        Cell: ({ row }) => {
          const nodeAddress = row.original.node_address;
          const latestRewardBaseUnits = parseFiniteNumber(
            row.original.current_award
          );

          if (latestRewardBaseUnits <= 0) return "-";
          const latestReward = baseUnitsToWholeRune(latestRewardBaseUnits);
          const latestDollarReward = (
            latestReward * runeCurrentPrice
          ).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });

          return (
            <InfoPopover
              title="Rewards in ($) Value"
              text={`$${latestDollarReward}`}
            >
              <span
                className="cursor-pointer underline tabular-nums font-medium text-gray-700 dark:text-[#A9F3DB]"
                onClick={() => handleOpenChart(nodeAddress, "rewards")}
              >
                ᚱ{latestReward.toLocaleString()}
              </span>
            </InfoPopover>
          );
        },
      },
      {
        Header: "Slashes",
        id: "slashes",
        accessor: (row) => row.slash_points,
        Cell: ({ row }) => {
          const nodeAddress = row.original.node_address;
          const slashes = row.original.slash_points;
          const slashCount = parseFiniteNumber(slashes);
          const color = slashColor(slashCount);
          return (
            <span
              className="cursor-pointer underline tabular-nums font-semibold"
              style={{ color }}
              onClick={() => handleOpenChart(nodeAddress, "slashes")}
            >
              {slashes}
            </span>
          );
        },
      },
      {
        Header: (
          <InfoPopover
            title="APY Info"
            text="We take the node’s current RUNE reward (adjusted by a ratio), multiply by expected yearly churn cycles, then divide by the node’s bond to estimate annual yield as a percentage. It’s only an approximation and may vary with real-world conditions."
          >
            <span>APY</span>
          </InfoPopover>
        ),
        id: "apy",
        accessor: "apy",
      },
      {
        Header: (
          <InfoPopover
            title="Score Info"
            text="The score is calculated by dividing the total blocks since last churn by the node’s slash points. Fewer slash points leads to a higher score."
          >
            <span>Score</span>
          </InfoPopover>
        ),
        accessor: "score",
        Cell: ({ value }) => {
          if (value === "-" || value == null) return "-";
          const numeric = parseFloat(value);
          if (!isFinite(numeric)) {
            return <span className="tabular-nums">{value}</span>;
          }
          const color = scoreColor(numeric);
          return (
            <span
              className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold tabular-nums"
              style={{
                color,
                backgroundColor: `${color}33`,
              }}
            >
              {value}
            </span>
          );
        },
      },
      {
        Header: "Version",
        id: "version",
        accessor: "version",
        Cell: ({ value }) => (
          <span className="font-mono text-xs">{value}</span>
        ),
      },
      {
        Header: (
          <InfoPopover title="Health" text="RPC & Bifrost status">
            <span>Health</span>
          </InfoPopover>
        ),
        id: "health",
        accessor: "rpc",
        disableSortBy: true,
        Cell: ({ row }) => {
          const { ip_address, rpc, bifrost } = row.original;
          const rpcOk = rpc !== "null";
          const bfrOk = bifrost !== "null";
          const rpcUrl = getNodeEndpointUrl(ip_address, 27147, "/health");
          const bifrostUrl = getNodeEndpointUrl(ip_address, 6040, "/p2pid");
          const linkClass =
            "inline-flex items-center gap-1 font-bold text-[11px] text-gray-700 dark:text-white visited:text-gray-700 dark:visited:text-white hover:underline focus:outline-none";
          const dotClass = (ok) =>
            `inline-block w-[7px] h-[7px] rounded-full ${
              ok ? "bg-green-400" : "bg-red-400"
            }`;
          return (
            <div className="flex items-center justify-center gap-2">
              <InfoPopover title="RPC" text={rpcOk ? "Healthy" : "Unhealthy"}>
                <a
                  href={rpcUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                  aria-disabled={!rpcUrl}
                  onClick={(event) => {
                    if (!rpcUrl) event.preventDefault();
                  }}
                >
                  <span className={dotClass(rpcOk)} />R
                </a>
              </InfoPopover>
              <InfoPopover title="Bifrost" text={bfrOk ? "Healthy" : "Unhealthy"}>
                <a
                  href={bifrostUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                  aria-disabled={!bifrostUrl}
                  onClick={(event) => {
                    if (!bifrostUrl) event.preventDefault();
                  }}
                >
                  <span className={dotClass(bfrOk)} />B
                </a>
              </InfoPopover>
            </div>
          );
        },
      },
    ];
    if (currentTab === "standby" || currentTab === "other") {
      newCols = newCols.filter(
        (col) => !["current_award", "apy", "score"].includes(col.accessor)
      );
    }

    return newCols;
  }, [
    currentTab,
    runeCurrentPrice,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    scoreColor,
    slashColor,
  ]);

  const chainColumns = React.useMemo(() => {
    if (currentTab !== "active") return [];
    const chains = [
      "BTC",
      "ETH",
      "LTC",
      "BCH",
      "DOGE",
      "AVAX",
      "BSC",
      "BASE",
      "XRP",
      "TRON",
      "SOL",
      "GAIA",
    ];
    const haltsData = getHaltsData(globalData);

    return chains.map((chain) => ({
      id: chain,
      Header: (
        <div className="flex justify-center">
          <InfoPopover title="Chain" text={chain}>
            <img
              src={chainIcons[chain]}
              alt={chain}
              style={{ width: 20, height: 20 }}
            />
          </InfoPopover>
          {getHaltWarning(chain, haltsData)}
        </div>
      ),
      accessor: (row) => {
        const nodeChainHeight = row.obchains[chain];
        const maxChainHeight = maxChainHeights[chain];
        if (nodeChainHeight === undefined || maxChainHeight === undefined) {
          return Infinity;
        }
        return nodeChainHeight - maxChainHeight;
      },
      sortType: "basic",
      Cell: ({ value }) => <ChainStatusCell value={value} chain={chain} />,
    }));
  }, [maxChainHeights, currentTab, globalData]);

  const allColumnsDef = React.useMemo(
    () => [...columns, ...chainColumns],
    [columns, chainColumns]
  );

  const tableInstance = useTable(
    {
      columns: allColumnsDef,
      data,
      initialState: {
        pageSize: 10,
        hiddenColumns: [
          ...(isSmall ? RESPONSIVE_HIDDEN_COLUMNS : []),
          ...hiddenColumns,
        ],
      },
      autoResetSortBy: false,
      defaultColumn: { sortType: "favouriteAware" },
      sortTypes: { favouriteAware: favouriteAwareSort },
    },
    useSortBy,
    usePagination
  );

  useEffect(() => {
    tableInstance.setHiddenColumns([
      ...(isSmall ? RESPONSIVE_HIDDEN_COLUMNS : []),
      ...hiddenColumns,
    ]);
  }, [hiddenColumns, isSmall, tableInstance]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    allColumns,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = tableInstance;

  useEffect(() => {
    if (setAllColumns) {
      setAllColumns(allColumns);
    }
  }, [allColumns, setAllColumns]);

  return (
    <>
      <div
        key={`table-${currentTab}`}
        className="rounded-[15px] mt-8 w-full bg-white dark:bg-[#17364c] shadow-md dark:shadow-[0_5px_20px_rgba(0,0,0,0.5)]"
      >
        <table
          {...getTableProps()}
          className="min-w-full table-auto border-separate border-spacing-0"
        >
          <thead className="sticky top-0 z-20">
            {headerGroups.map((headerGroup) => {
              const headerGroupProps = headerGroup.getHeaderGroupProps();
              const { key: headerGroupKey, ...restHeaderGroupProps } =
                headerGroupProps;

              return (
                <tr key={headerGroupKey} {...restHeaderGroupProps}>
                  <th
                    className="
                      px-3 py-2.5 text-[10px] font-bold uppercase tracking-[0.06em] whitespace-nowrap
                      text-gray-700 dark:text-gray-300
                      bg-gray-200 dark:bg-[#1e3344]
                      first:rounded-tl-[15px] w-10 text-center
                    "
                  >
                    #
                  </th>
                  {headerGroup.headers.map((column) => {
                    const headerProps = column.getHeaderProps(
                      column.getSortByToggleProps()
                    );
                    const { key: columnKey, ...restHeaderProps } = headerProps;
                    return (
                      <th
                        key={columnKey}
                        {...restHeaderProps}
                        className="
                          px-3 py-2.5 text-[10px] font-bold uppercase tracking-[0.06em] whitespace-nowrap
                          text-left text-gray-700 dark:text-gray-300
                          bg-gray-200 dark:bg-[#1e3344]
                          first:rounded-tl-[15px] last:rounded-tr-[15px]
                        "
                      >
                        <div className="flex items-center gap-1">
                          {column.render("Header")}

                          {column.isSorted && (
                            <img
                              src={column.isSortedDesc ? DownArrow : UpArrow}
                              alt="Sort Arrow"
                              className="w-3 h-3 inline-block"
                            />
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              );
            })}
          </thead>
          <tbody
            {...getTableBodyProps()}
          >
            {isFiltering && (
              <tr>
                <td colSpan={allColumnsDef.length + 2} className="py-10">
                  <LoadingSpinner />
                </td>
              </tr>
            )}

            {!isFiltering && page.length === 0 && (
              <tr>
                <td
                  colSpan={allColumnsDef.length + 2}
                  className="py-6 text-center text-gray-700 dark:text-gray-50"
                >
                  No node found for this search
                </td>
              </tr>
            )}

            {!isFiltering &&
              page.map((row, i) => {
                prepareRow(row);
                const rowProps = row.getRowProps();
                const { key: rowKey, ...restRowProps } = rowProps;

                const actionValue = row.original.action || "";

                const highlightClass = getRowHighlightClass(actionValue);

                const stripeClass =
                  i % 2 === 1
                    ? "bg-gray-100/60 dark:bg-white/[0.03]"
                    : "";
                return (
                  <tr
                    key={rowKey}
                    className={`hover:!bg-[#4dc89f] hover:!text-[#0f172a] cursor-pointer transition-colors ${highlightClass || stripeClass}`}
                    onClick={(e) => {
                      const el = e.target;
                      const tr = e.currentTarget;
                      if (
                        el.closest("a") ||
                        el.closest("button") ||
                        el.closest("[data-interactive]") ||
                        el.tagName === "IMG" && el.closest(".cursor-pointer") !== tr
                      ) return;
                      let node = el;
                      while (node && node !== tr) {
                        if (node.classList && (node.classList.contains("underline") || node.classList.contains("cursor-pointer"))) return;
                        node = node.parentElement;
                      }
                      setDrawerNode(row.original);
                    }}
                    {...restRowProps}
                  >
                    <td className="px-2 py-2.5 whitespace-nowrap text-[11px] text-gray-500 dark:text-gray-400 tabular-nums text-center border-t border-white/[0.05] w-8">
                      {i + 1 + pageIndex * pageSize}
                    </td>
                    {row.cells.map((cell) => {
                      const cellProps = cell.getCellProps();
                      const { key: cellKey, ...restCellProps } = cellProps;

                      return (
                        <td
                          key={cellKey}
                          {...restCellProps}
                          className="px-3 py-2.5 whitespace-nowrap text-xs text-gray-700 dark:text-gray-50 border-t border-white/[0.05]"
                        >
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <Pagination
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}
        pageOptions={pageOptions}
        pageCount={pageCount}
        gotoPage={gotoPage}
        nextPage={nextPage}
        previousPage={previousPage}
        setPageSize={setPageSize}
        pageIndex={pageIndex}
        pageSize={pageSize}
      />

      {showModal && getNodeChartConfig(selectedChartType) && (
        <NodeChartModal
          title={getNodeChartConfig(selectedChartType).title}
          subtitle={selectedNodeAddress}
          onClose={handleCloseModal}
        >
          {renderChartContent()}
        </NodeChartModal>
      )}

      <BondProvidersTable
        isOpen={showProvidersModal}
        onClose={() => setShowProvidersModal(false)}
        providersData={providersData}
      />

      {drawerNode && (
        <NodeDrawer
          node={drawerNode}
          onClose={() => setDrawerNode(null)}
          isDark={isDark}
          isSidebarExpanded={isSidebarExpanded}
          runePrice={runeCurrentPrice}
        />
      )}
    </>
  );
};

export default NodesTable;
