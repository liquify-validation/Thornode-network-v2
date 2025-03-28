import React, { useState, useEffect } from "react";
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
} from "../components";
import {
  chainIcons,
  copyToClipboard,
  ispLogos,
  parseCoingeckoData,
  cityToCountryMap,
} from "../utilities/commonFunctions";
import { getHaltWarning, getHaltsData } from "../utilities/getHaltWarning";

import { useNodeBondData } from "../hooks/useNodeBondData";
import { useNodeRewardsData } from "../hooks/useNodeRewardsData";
import { useNodePositionData } from "../hooks/useNodePositionData";
import { useNodeSlashesData } from "../hooks/useNodeSlashesData";
import { JailIcon, LeaveIcon } from "../assets";

const NodesTable = ({
  data,
  setAllColumns,
  maxChainHeights,
  globalData,
  isDark,
  currentTab,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedNodeAddress, setSelectedNodeAddress] = useState(null);
  const [selectedChartType, setSelectedChartType] = useState(null);
  const [showProvidersModal, setShowProvidersModal] = useState(false);
  const [providersData, setProvidersData] = useState([]);

  const [chartData, setChartData] = useState([]);

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
    const { data, isLoading, error } = currentQuery || {};

    if (!currentQuery) return <div>No data available</div>;
    if (isLoading) return <LoadingSpinner />;
    if (error) return <div className="text-red-400">{error.message}</div>;

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

  const filteredData = React.useMemo(() => {
    return data.filter(
      (node) =>
        node.node_address.includes(searchTerm) ||
        (node.bondProvidersString &&
          node.bondProvidersString.includes(searchTerm))
    );
  }, [data, searchTerm]);

  // useEffect(() => {
  //   console.log("Final table data:", filteredData);
  // }, [filteredData]);

  const columns = React.useMemo(() => {
    return [
      // {
      //   Header: "#",
      //   id: "rowIndex",
      //   Cell: ({ row }) => row.index + 1,
      // },
      {
        Header: "Nodes",
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
                ...{last4}
              </span>
            </InfoPopover>
          );
        },
      },
      {
        Header: "Features",
        accessor: "icons",
        disableSortBy: true,
        Cell: ({ row }) => (
          <div className="overflow-visible">
            <TableIcons node={row.original} onOpenChart={handleOpenChart} />
          </div>
        ),
      },
      {
        Header: "Age",
        accessor: "age",
        Cell: ({ value }) => `${value.toFixed(2)}`,
      },
      {
        Header: "Action",
        accessor: "action",
      },
      {
        Header: "ISP",
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
        Header: "Bonders",
        accessor: (row) => row.bond_providers?.providers?.length || 0,
        Cell: ({ row }) => {
          const bondProvidersData = row.original.bond_providers;
          if (!bondProvidersData || !bondProvidersData.providers) return "-";

          const providers = bondProvidersData.providers;
          if (!Array.isArray(providers) || providers.length === 0) return "0";

          function handleClick() {
            setProvidersData(providers);
            setShowProvidersModal(true);
          }

          return (
            <span className="underline cursor-pointer" onClick={handleClick}>
              {providers.length}{" "}
            </span>
          );
        },
      },
      {
        Header: "Bond",
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
        Header: "APY",
        accessor: "apy",
      },
      {
        Header: "Score",
        accessor: "score",
      },
      {
        Header: "Version",
        accessor: "version",
      },
      {
        Header: (
          <div>
            <img
              src={LeaveIcon}
              alt="Leave Icon"
              width={"25px"}
              height={"25px"}
              className="invert dark:invert-0"
            />
          </div>
        ),
        accessor: "leave",
        Cell: ({ row }) =>
          row.original.forced_to_leave === 1 ||
          row.original.requested_to_leave === 1
            ? "Yes"
            : "-",
      },
      {
        Header: "Jailed",
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
        accessor: "rpc",
        disableSortBy: true,
        Cell: ({ row }) => {
          const { ip_address, rpc } = row.original;
          return rpc !== "null" ? (
            <a
              href={`http://${ip_address}:27147/health?`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "white dark:black",
              }}
            >
              *
            </a>
          ) : (
            "Bad"
          );
        },
      },
      {
        Header: "BFR",
        accessor: "bfr",
        disableSortBy: true,
        Cell: ({ row }) => {
          const { ip_address, bifrost } = row.original;
          return bifrost !== "null" ? (
            <a
              href={`http://${ip_address}:6040/p2pid`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "white dark:black",
              }}
            >
              *
            </a>
          ) : (
            "Bad"
          );
        },
      },
    ];
  }, [runeCurrentPrice]);

  const chainColumns = React.useMemo(() => {
    if (currentTab !== "active") {
      return [];
    }
    const chains = ["BTC", "ETH", "LTC", "BCH", "DOGE", "AVAX", "BSC", "BASE"];
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
      initialState: { pageSize: 10 },
      autoResetSortBy: false,
    },
    useSortBy,
    usePagination
  );

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
        className={`
       rounded-t-lg mt-8
       w-full
       
     `}
      >
        <table
          {...getTableProps()}
          className="min-w-full  table-auto divide-y-4 text-center divide-gray-500"
        >
          <thead>
            {headerGroups.map((headerGroup) => {
              const headerGroupProps = headerGroup.getHeaderGroupProps();
              const { key: headerGroupKey, ...restHeaderGroupProps } =
                headerGroupProps;
              return (
                <tr key={headerGroupKey} {...restHeaderGroupProps}>
                  {headerGroup.headers.map((column) => {
                    const headerProps = column.getHeaderProps(
                      column.getSortByToggleProps()
                    );
                    const { key: columnKey, ...restHeaderProps } = headerProps;
                    return (
                      <th
                        key={columnKey}
                        {...restHeaderProps}
                        className={`
                          px-4 py-4 text-md text-gray-700 dark:text-gray-50 bg-gray-200 dark:bg-[#1e3344] tracking-wider
                          
                        `}
                      >
                        {column.render("Header")}
                        <span>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? " 🔽"
                              : " 🔼"
                            : ""}
                        </span>
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
            {page.map((row) => {
              prepareRow(row);
              const rowProps = row.getRowProps();
              const { key: rowKey, ...restRowProps } = rowProps;
              return (
                <tr
                  key={rowKey}
                  className="hover:bg-[#4dc89f] inner-glass-effect"
                  {...restRowProps}
                >
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
