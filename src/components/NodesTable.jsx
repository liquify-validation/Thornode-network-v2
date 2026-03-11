import React, { useState, useEffect, useContext } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import {
  TableIcons,
  ChainStatusCell,
  Pagination,
  Modal,
  ModernLineChart,
  InfoPopover,
  LoadingSpinner,
  ModernScatterChart,
  BondProvidersTable,
  Number,
} from "../components";

import {
  chainIcons,
  copyToClipboard,
  ispLogos,
  parseCoingeckoData,
  cityToCountryMap,
  useViewport,
} from "../utilities/commonFunctions";
import { getHaltWarning, getHaltsData } from "../utilities/getHaltWarning";

import { useNodeBondData } from "../hooks/useNodeBondData";
import { useNodeRewardsData } from "../hooks/useNodeRewardsData";
import { useNodePositionData } from "../hooks/useNodePositionData";
import { useNodeSlashesData } from "../hooks/useNodeSlashesData";

import {
  DownArrow,
  JailIcon,
  LeaveIcon,
  MoonIcon,
  SunIcon,
  UpArrow,
} from "../assets";

import { GlobalDataContext } from "../context/GlobalDataContext";
import { FavouriteIcon, UnfavouriteIcon } from "../assets";

const NodesTable = ({
  data,
  setAllColumns,
  maxChainHeights,
  globalData,
  isDark,
  currentTab,
  isFiltering,
  hiddenColumns,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedNodeAddress, setSelectedNodeAddress] = useState(null);
  const [selectedChartType, setSelectedChartType] = useState(null);
  const [showProvidersModal, setShowProvidersModal] = useState(false);
  const [providersData, setProvidersData] = useState([]);
  const width = useViewport();
  const isSmall = width < 1300;
  const responsiveHidden = ["rpc", "bfr", "leave", "jailed"];

  const [chartData, setChartData] = useState([]);

  const { isFavorite, addToFavorites, removeFromFavorites } =
    useContext(GlobalDataContext);

  const coingeckoData = React.useMemo(() => {
    if (!globalData || !globalData.coingecko) return {};
    return globalData.coingecko;
  }, [globalData]);

  const runeCurrentPrice = coingeckoData.current_price || 0;

  const bondDataQuery = useNodeBondData(selectedNodeAddress);
  const rewardsDataQuery = useNodeRewardsData(selectedNodeAddress);
  const positionDataQuery = useNodePositionData(selectedNodeAddress);
  const slashesDataQuery = useNodeSlashesData(selectedNodeAddress);

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
    setChartData([]);
  };

  const renderChartContent = () => {
    const queryMap = {
      bond: bondDataQuery,
      rewards: rewardsDataQuery,
      position: positionDataQuery,
      slashes: slashesDataQuery,
    };

    const currentQuery = queryMap[selectedChartType];
    if (!currentQuery) return <div>No data available</div>;
    const { data, isLoading, error } = currentQuery;

    if (isLoading) return <LoadingSpinner />;
    if (error) return <div className="text-red-400">{error.message}</div>;
    if (!data || data.length === 0) return <div>No data</div>;

    if (selectedChartType === "position") {
      const scatterPoints = [
        {
          dataKey: "position",
          name: "Position",
          fillColor: "#FFAE4C",
        },
        {
          dataKey: "maxPosition",
          name: "Max Position",
          fillColor: "#8884d8",
        },
      ];

      return (
        <ModernScatterChart
          data={data}
          title="POSITION Over Time"
          xAxisKey="blockHeight"
          yAxisKey="position"
          scatterPoints={scatterPoints}
          xAxisLabel="Block Height"
          yAxisLabel="Position"
          isDark={isDark}
        />
      );
    }

    const chartLines = {
      bond: [
        {
          dataKey: "bondValue",
          name: "Bond Value",
          strokeColor: "#28F3B0",
          gradientStartColor: "#28F3B0",
        },
      ],
      rewards: [
        {
          dataKey: "rewardsValue",
          name: "Rewards",
          strokeColor: "#C45985",
          gradientStartColor: "#C45985",
        },
      ],
      slashes: [
        {
          dataKey: "slashesValue",
          name: "Slashes",
          strokeColor: "#FF5733",
          gradientStartColor: "#FF5733",
        },
      ],
    };

    return (
      <ModernLineChart
        data={data}
        title={`${selectedChartType.toUpperCase()} Over Time`}
        xAxisKey="blockHeight"
        yAxisLabel={selectedChartType}
        lines={chartLines[selectedChartType]}
        isDark={isDark}
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
        Cell: ({ value }) => {
          const last4 = value.slice(-4);
          return (
            <InfoPopover title="Thornode Address" text={value}>
              <span
                onClick={() => copyToClipboard(value)}
                style={{ cursor: "pointer", textDecoration: "underline" }}
                title="Click to copy"
              >
                {last4}
              </span>
            </InfoPopover>
          );
        },
      },
      {
        Header: "Features",
        id: "features",
        accessor: "icons",
        disableSortBy: true,
        Cell: ({ row }) => (
          <div className="overflow-visible">
            <TableIcons node={row.original} onOpenChart={handleOpenChart} />
          </div>
        ),
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
      },
      {
        Header: (
          <InfoPopover title="ISP" text="Internet Service Provider">
            <span>ISP</span>
          </InfoPopover>
        ),
        id: "isp",
        accessor: "isp",
        Cell: ({ value }) => {
          const ispName = value || "-";
          const logo = ispLogos[ispName];

          if (logo) {
            return (
              <div className="text-center">
                <InfoPopover title="Provider" text={ispName}>
                  <img
                    src={logo}
                    alt={ispName}
                    className="mx-auto block w-6 h-6"
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
          const { data: bondData, isLoading } = useNodeBondData(nodeAddress);

          if (isLoading || !bondData || bondData.length === 0) return "-";

          const latestBond = Math.round(row.original.bond / 1e8);
          const latestDollarBond = (
            latestBond * runeCurrentPrice
          ).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });

          return (
            <InfoPopover
              title="Bond Value in $"
              text={`$${latestDollarBond.toLocaleString()}`}
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
          const { data: rewardsData, isLoading } =
            useNodeRewardsData(nodeAddress);

          if (isLoading || !rewardsData || rewardsData.length === 0) return "-";
          const latestReward = Math.round(row.original.current_award / 1e8);
          const latestDollarReward = (latestReward * runeCurrentPrice).toFixed(
            2
          );

          return (
            <InfoPopover
              title="Rewards in ($) Value"
              text={`$${latestDollarReward.toLocaleString()}`}
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
        Header: "Leave",
        accessor: "leave",
        Cell: ({ row }) =>
          row.original.forced_to_leave === 1 ||
          row.original.requested_to_leave === 1
            ? "Yes"
            : "-",
      },
      {
        Header: "Jailed",
        id: "jailed",
        accessor: "is_jailed",
        Cell: ({ row }) => {
          const { is_jailed, jail } = row.original;
          if (is_jailed === 1 && jail) {
            return (
              <InfoPopover
                title="Jailed Information"
                text={
                  <>
                    Release Height: {jail.release_height}
                    <br />
                    Reason: {jail.reason}
                  </>
                }
              >
                <img
                  src={JailIcon}
                  alt="Jail Icon"
                  className="mx-auto invert dark:invert-0"
                />
              </InfoPopover>
            );
          }
          return "-";
        },
      },
      {
        Header: "RPC",
        id: "rpc",
        accessor: "rpc",
        disableSortBy: true,
        Cell: ({ row }) => {
          const { ip_address, rpc } = row.original;
          const healthy = rpc !== "null";
          return (
            <a
              href={`http://${ip_address}:27147/health?`}
              target="_blank"
              rel="noopener noreferrer"
              className="
              font-normal
              text-gray-700            
              dark:text-white      
              visited:text-gray-700
              dark:visited:text-white
              hover:underline      
              focus:outline-none
            "
            >
              {healthy ? "*" : "Bad"}
            </a>
          );
        },
      },
      {
        Header: "BFR",
        id: "bfr",
        accessor: "bfr",
        disableSortBy: true,
        Cell: ({ row }) => {
          const { ip_address, bifrost } = row.original;
          const healthy = bifrost !== "null";

          return (
            <a
              href={`http://${ip_address}:6040/p2pid`}
              target="_blank"
              rel="noopener noreferrer"
              className="
              font-normal
            text-gray-700            
            dark:text-white      
            visited:text-gray-700
            dark:visited:text-white
            hover:underline
            focus:outline-none
          "
            >
              {healthy ? "*" : "Bad"}
            </a>
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
        hiddenColumns: [...(isSmall ? responsiveHidden : []), ...hiddenColumns],
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
      ...(isSmall ? responsiveHidden : []),
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
          <thead>
            {headerGroups.map((headerGroup) => {
              const headerGroupProps = headerGroup.getHeaderGroupProps();
              const { key: headerGroupKey, ...restHeaderGroupProps } =
                headerGroupProps;

              return (
                <tr key={headerGroupKey} {...restHeaderGroupProps}>
                  <th className="px-2 py-4 text-md text-gray-700 dark:text-gray-50 bg-gray-200 dark:bg-[#1e3344]"></th>
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
                          px-4 py-4 text-md text-gray-700 dark:text-gray-50
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
                    className={`hover:bg-[#4dc89f] inner-glass-effect ${highlightClass}`}
                    {...restRowProps}
                  >
                    <td className="px-2 pl-4 py-4 whitespace-nowrap text-sm text-gray-50">
                      <Number number={i + 1 + pageIndex * pageSize} />
                    </td>

                    {row.cells.map((cell) => {
                      const cellProps = cell.getCellProps();
                      const { key: cellKey, ...restCellProps } = cellProps;

                      return (
                        <td
                          key={cellKey}
                          {...restCellProps}
                          className="px-4 py-4 whitespace-nowrap text-md text-gray-700 dark:text-gray-50"
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

      {showModal && (
        <Modal onClose={handleCloseModal}>
          <h2 className="text-xl font-bold text-white mb-4">
            {selectedChartType?.toUpperCase()} Chart for {selectedNodeAddress}
          </h2>
          {renderChartContent()}
        </Modal>
      )}

      <BondProvidersTable
        isOpen={showProvidersModal}
        onClose={() => setShowProvidersModal(false)}
        providersData={providersData}
      />
    </>
  );
};

export default NodesTable;
