import React, { useState, useEffect } from "react";
import {
  ArrowIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "../assets";
import { getCookieValue, setCookie } from "../utilities/commonFunctions";

const Pagination = ({
  canPreviousPage,
  canNextPage,
  pageOptions,
  pageCount,
  gotoPage,
  nextPage,
  previousPage,
  setPageSize,
  pageIndex,
  pageSize,
  expandTable,
  onExpandChange,
  hideExpandOption = false,
}) => {
  const [localPageSize, setLocalPageSize] = useState(pageSize);

  useEffect(() => {
    const saved = getCookieValue("pageSize");
    if (saved) {
      if (saved === "all") {
        setPageSize(9999999);
        setLocalPageSize("all");
      } else {
        const num = parseInt(saved, 10);
        if (!isNaN(num)) {
          setPageSize(num);
          setLocalPageSize(num);
        }
      }
    }
  }, [setPageSize]);

  const handleChangePageSize = (value) => {
    setLocalPageSize(value);
    if (value === "all") {
      setPageSize(9999999);
      setCookie("pageSize", "all");
    } else {
      const num = parseInt(value, 10);
      setPageSize(num);
      setCookie("pageSize", num.toString());
    }
  };

  function handleExpandToggle(e) {
    const checked = e.target.checked;
    if (onExpandChange) {
      onExpandChange(checked);
    }
  }

  const pageNumbers = React.useMemo(() => {
    const totalPageCount = pageOptions.length;
    const currentPage = pageIndex;
    const maxPagesToShow = 4;

    let startPage = currentPage;
    let endPage = currentPage + (maxPagesToShow - 1);

    if (endPage >= totalPageCount) {
      endPage = totalPageCount - 1;
      startPage = Math.max(endPage - (maxPagesToShow - 1), 0);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }, [pageIndex, pageOptions]);

  return (
    <div className="flex items-center inner-glass-effect py-6 px-4 rounded-b-xl ">
      <div className="flex items-center space-x-2 ">
        <span>Show</span>
        <select
          className="border rounded p-1 bg-slate-500"
          value={localPageSize}
          onChange={(e) => handleChangePageSize(e.target.value)}
        >
          {[10, 25, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
          <option value="all">All</option>
        </select>
        <span>results per page</span>
        {!hideExpandOption && (
          <div className="pl-12">
            <input
              type="checkbox"
              checked={expandTable}
              onChange={handleExpandToggle}
            />
            <span>Expand Table</span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-1 flex-grow justify-center ">
        <button
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
          className="p-2 bg-transparent"
        >
          <img
            src={DoubleArrowLeftIcon}
            className="w-6 h-6 invert dark:invert-0"
            alt="First Page"
          />
        </button>

        <button
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          className="p-2 bg-transparent"
        >
          <img
            src={ArrowIcon}
            className="rotate-180 w-6 h-6 invert dark:invert-0"
            alt="Previous Page"
          />
        </button>

        <div className="flex items-center space-x-1">
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => gotoPage(page)}
              className={`px-2 py-1 rounded ${
                page === pageIndex
                  ? "bg-[#28f3b0] text-gray-900"
                  : "bg-transparent text-gray-700 dark:text-[#28f3b0] hover:bg-blue-200"
              }`}
            >
              {page + 1}
            </button>
          ))}
        </div>

        <button
          onClick={() => nextPage()}
          disabled={!canNextPage}
          className="p-2 bg-transparent"
        >
          <img
            src={ArrowIcon}
            className="w-6 h-6 invert dark:invert-0"
            alt="Next Page"
          />
        </button>

        <button
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
          className="p-2 bg-transparent"
        >
          <img
            src={DoubleArrowRightIcon}
            className="w-6 h-6 invert dark:invert-0"
            alt="Last Page"
          />
        </button>
      </div>

      <div className="w-32"></div>
    </div>
  );
};

export default Pagination;
