import React, { useMemo } from "react";
import { useTable, useSortBy, usePagination } from "react-table";

import Box from "../ui/Box";
import ModernDivider from "./ModernDivider";
import { DownArrow, UpArrow } from "../assets";

const VotingTable = ({ data, title, maxVotes }) => {
  const columns = useMemo(() => {
    return [
      {
        Header: "Vote",
        accessor: "title",
      },
      {
        Header: "Result",
        accessor: "status",
        Cell: ({ value }) => {
          return value === "passed" ? "Passed" : "In Progress";
        },
      },
      {
        Header: "Vote Poll",
        accessor: (row) => row,
        Cell: ({ value: rowData }) => {
          const totalVotes = rowData.options.reduce(
            (sum, opt) => sum + opt.value,
            0
          );
          const missingVotes = maxVotes - totalVotes;
          const percentage = (totalVotes / maxVotes) * 100;

          return (
            <div className="flex flex-col items-start">
              <div className="w-full mb-1">
                <span className="mr-2 text-sm">
                  {totalVotes}/{maxVotes} ({percentage.toFixed(1)}%)
                </span>
                <div className="w-full bg-gray-200 rounded-md h-2 relative">
                  <div
                    className="absolute left-0 top-0 h-2 rounded-md"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: "#28F3B0",
                    }}
                  />
                </div>
              </div>

              {missingVotes > 0 && (
                <div className="text-red-500 text-sm">
                  Not Voted: {missingVotes}
                </div>
              )}
            </div>
          );
        },
      },
    ];
  }, [maxVotes]);

  const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } =
    useTable({ columns, data }, useSortBy, usePagination);

  return (
    <Box className="p-6">
      <h2 className="font-semibold text-lg mb-2">{title}</h2>
      <ModernDivider />

      <div className="overflow-x-auto rounded-t-lg mt-8">
        <table
          {...getTableProps()}
          className="min-w-full table-auto divide-y-4 text-center divide-gray-500"
        >
          <thead>
            {headerGroups.map((headerGroup) => {
              const headerGroupProps = headerGroup.getHeaderGroupProps();
              return (
                <tr key={headerGroupProps.key} {...headerGroupProps}>
                  {headerGroup.headers.map((column) => {
                    const columnProps = column.getHeaderProps(
                      column.getSortByToggleProps()
                    );
                    return (
                      <th
                        key={columnProps.key}
                        {...columnProps}
                        className="px-4 py-4 text-md text-gray-700 dark:text-gray-50 bg-gray-200 dark:bg-[#1e3344] tracking-wider"
                      >
                        <div className="flex items-center justify-center">
                          {column.render("Header")}

                          {column.isSorted && (
                            <img
                              src={column.isSortedDesc ? UpArrow : DownArrow}
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
            {page.map((row) => {
              prepareRow(row);
              const rowProps = row.getRowProps();
              return (
                <tr
                  key={rowProps.key}
                  {...rowProps}
                  className="hover:bg-[#4dc89f] inner-glass-effect"
                >
                  {row.cells.map((cell) => {
                    const cellProps = cell.getCellProps();
                    return (
                      <td
                        key={cellProps.key}
                        {...cellProps}
                        className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-50"
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
    </Box>
  );
};

export default VotingTable;
