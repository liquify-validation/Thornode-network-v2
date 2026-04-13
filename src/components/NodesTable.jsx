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
  Number,
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
        Cell: ({ value }) => `${value.toFixed(2)}`,
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
                className="cursor-pointer underline"
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
                className="cursor-pointer underline"
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
          return (
            <span
              className="cursor-pointer underline"
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
      },
      {
        Header: "Version",
        id: "version",
        accessor: "version",
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
          const linkClass = "font-normal text-gray-700 dark:text-white visited:text-gray-700 dark:visited:text-white hover:underline focus:outline-none";
          return (
            <div className="flex items-center justify-center gap-1">
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
                  <span className={rpcOk ? "text-green-400" : "text-red-400"}>R</span>
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
                  <span className={bfrOk ? "text-green-400" : "text-red-400"}>B</span>
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
      Cell: ({ value }) => <ChainStatusCell value={value} />,
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
      <div key={`table-${currentTab}`} className="rounded-t-lg mt-8 w-full">
        <table
          {...getTableProps()}
          className="min-w-full table-auto divide-y-4 text-center divide-gray-500"
        >
          <thead className="sticky top-0 z-10">
            {headerGroups.map((headerGroup) => {
              const headerGroupProps = headerGroup.getHeaderGroupProps();
              const { key: headerGroupKey, ...restHeaderGroupProps } =
                headerGroupProps;

              return (
                <tr key={headerGroupKey} {...restHeaderGroupProps}>
                  <th className="px-2 pl-4 py-4 text-md text-gray-700 dark:text-gray-50 bg-gray-200 dark:bg-[#1e3344] w-12"></th>
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
                          px-2 py-4 text-md text-gray-700 dark:text-gray-50
                          bg-gray-200 dark:bg-[#1e3344] tracking-wider
                        "
                      >
                        <div className="flex items-center justify-center">
                          {column.render("Header")}

                          {column.isSorted && (
                            <img
                              src={column.isSortedDesc ? DownArrow : UpArrow}
                              alt="Sort Arrow"
                              className="w-4 h-4 ml-1 inline-block"
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
            className="divide-y-2 divide-gray-700"
          >
            {isFiltering && (
              <tr>
                <td colSpan={allColumnsDef.length + 1} className="py-10">
                  <LoadingSpinner />
                </td>
              </tr>
            )}

            {!isFiltering && page.length === 0 && (
              <tr>
                <td
                  colSpan={allColumnsDef.length + 1}
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

                return (
                  <tr
                    key={rowKey}
                    className={`hover:!bg-[#4dc89f] cursor-pointer ${highlightClass || (i % 2 === 0 ? "inner-glass-effect" : "bg-gray-300/80 dark:bg-gray-800/80")}`}
                    onClick={(e) => {
                      const el = e.target;
                      const tr = e.currentTarget;
                      if (
                        el.closest("a") ||
                        el.closest("button") ||
                        el.closest("[data-interactive]") ||
                        el.tagName === "IMG" && el.closest(".cursor-pointer") !== tr
                      ) return;
                      // Check if clicked element (or ancestor below the row) has underline/cursor-pointer
                      let node = el;
                      while (node && node !== tr) {
                        if (node.classList && (node.classList.contains("underline") || node.classList.contains("cursor-pointer"))) return;
                        node = node.parentElement;
                      }
                      setDrawerNode(row.original);
                    }}
                    {...restRowProps}
                  >
                    <td className="px-2 pl-4 py-4 whitespace-nowrap text-sm text-gray-50 w-12">
                      <Number number={i + 1 + pageIndex * pageSize} />
                    </td>

                    {row.cells.map((cell) => {
                      const cellProps = cell.getCellProps();
                      const { key: cellKey, ...restCellProps } = cellProps;

                      return (
                        <td
                          key={cellKey}
                          {...restCellProps}
                          className="px-2 py-4 whitespace-nowrap text-md text-gray-700 dark:text-gray-50"
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
