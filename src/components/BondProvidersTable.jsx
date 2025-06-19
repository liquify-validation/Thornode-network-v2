import React, { useEffect, useMemo } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import Modal from "./Modal";
import Pagination from "./Pagination";
import { copyToClipboard } from "../utilities/commonFunctions";
import InfoPopover from "./InfoPopover";
import { DownArrow, UpArrow } from "../assets";

function BondProvidersTable({ isOpen, onClose, providersData = [] }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const totalBond = useMemo(() => {
    return providersData.reduce((sum, p) => sum + Number(p.bond), 0);
  }, [providersData]);

  const tableData = useMemo(() => {
    return providersData.map((prov) => {
      const bondVal = Number(prov.bond);
      const numericPercent = totalBond > 0 ? (bondVal / totalBond) * 100 : 0;
      const bondRune = bondVal / 1e8;

      return {
        address: prov.bond_address,
        last4: prov.bond_address.slice(-4),
        percent: numericPercent,
        bondRune,
      };
    });
  }, [providersData, totalBond]);

  const columns = useMemo(() => {
    return [
      {
        Header: "Node Address",
        accessor: "address",
        sortType: "basic",
        Cell: ({ value, row }) => {
          const shortText = row.original.last4;
          return (
            <InfoPopover title="Thornode Address" text={value}>
              <span
                onClick={() => copyToClipboard(value)}
                style={{ cursor: "pointer", textDecoration: "underline" }}
                title="Click to copy"
              >
                {shortText}
              </span>
            </InfoPopover>
          );
        },
      },
      {
        Header: "Percentage",
        accessor: "percent",
        sortType: "basic",
        Cell: ({ value }) => `${value.toFixed(2)}%`,
      },
      {
        Header: "Bond (RUNE)",
        accessor: "bondRune",
        sortType: "basic",
        Cell: ({ value }) =>
          value.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
      },
    ];
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: tableData,
      initialState: { pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <div className="bg-gray-800 rounded-lg p-4">
        <h2 className="text-xl font-bold text-white mb-4">Bond Providers</h2>

        <div className="bg-gray-700 rounded p-0 max-h-[600px] overflow-y-auto overflow-x-auto scrollbar-custom">
          <table
            {...getTableProps()}
            className="min-w-full table-auto divide-y-2 divide-gray-500 text-left"
          >
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => {
                    const headerProps = column.getHeaderProps(
                      column.getSortByToggleProps()
                    );
                    return (
                      <th
                        {...headerProps}
                        className="px-4 py-4 bg-gray-200 dark:bg-[#1e3344] text-gray-700 dark:text-gray-50 sticky top-0 z-10"
                      >
                        <div className="flex items-left">
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
              ))}
            </thead>
            <tbody
              {...getTableBodyProps()}
              className="divide-y divide-gray-600"
            >
              {page.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className="hover:bg-[#4dc89f]">
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        className="px-4 py-2 text-white"
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

        <div>
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
            hideExpandOption
          />
        </div>
      </div>
    </Modal>
  );
}

export default BondProvidersTable;
