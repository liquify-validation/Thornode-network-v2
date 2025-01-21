import React, { useEffect } from "react";
import { useTable, useSortBy } from "react-table";
import { Number, ModernDivider, Pagination } from "../components";

const NetworkTable = ({ columns, data, title }) => {
  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useSortBy
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setState,
  } = tableInstance;

  const [pageSize, setPageSize] = React.useState(10);
  const [pageIndex, setPageIndex] = React.useState(0);

  const pageCount = Math.ceil(rows.length / pageSize);

  const currentRows = React.useMemo(() => {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    return rows.slice(start, end);
  }, [rows, pageIndex, pageSize]);

  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < pageCount - 1;

  const gotoPage = (page) => {
    setPageIndex(page);
  };

  const previousPage = () => {
    setPageIndex((old) => Math.max(old - 1, 0));
  };

  const nextPage = () => {
    setPageIndex((old) => Math.min(old + 1, pageCount - 1));
  };

  useEffect(() => {
    setPageIndex(0);
  }, [pageSize]);

  return (
    <div className="mt-4">
      <div className="inner-glass-effect rounded-t-xl">
        <div className="py-4">
          <h2 className="text-md font-bold ml-8 mt-4">{title}</h2>
          <ModernDivider />
        </div>

        <div className="overflow-x-auto">
          <table
            {...getTableProps()}
            className="min-w-full divide-y-4 divide-gray-700"
          >
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                  <th
                    className="px-2 py-3 text-left tracking-wider"
                    style={{ width: "10%" }}
                  ></th>
                  {headerGroup.headers.map((column) => (
                    <th
                      key={column.id}
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="px-6 py-3 text-left text-md font-semibold text-[#28F3B0] tracking-wider pb-8"
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
                  ))}
                </tr>
              ))}
            </thead>
            <tbody
              {...getTableBodyProps()}
              className="divide-y-4 divide-gray-700"
            >
              {currentRows.map((row, i) => {
                prepareRow(row);
                return (
                  <tr key={row.id} {...row.getRowProps()}>
                    <td className="px-2 pl-4 py-4 whitespace-nowrap text-sm text-gray-50">
                      <Number number={i + 1 + pageIndex * pageSize} />
                    </td>
                    {row.cells.map((cell) => (
                      <td
                        key={cell.column.id}
                        {...cell.getCellProps()}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-50"
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}
        pageOptions={Array.from({ length: pageCount }, (_, i) => i)}
        pageCount={pageCount}
        gotoPage={gotoPage}
        nextPage={nextPage}
        previousPage={previousPage}
        setPageSize={setPageSize}
        pageIndex={pageIndex}
        pageSize={pageSize}
      />
    </div>
  );
};

export default NetworkTable;
