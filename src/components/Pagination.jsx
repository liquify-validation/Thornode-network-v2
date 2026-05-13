/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import {
  ArrowIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "../assets";
import { getCookieValue, setCookie } from "../utilities/commonFunctions";

const ALLOWED_PAGE_SIZES = [10, 25, 50, 100];

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
}) => {
  const [localPageSize, setLocalPageSize] = useState("all");

  useEffect(() => {
    const saved = getCookieValue("pageSize");
    if (saved) {
      if (saved === "all") {
        setPageSize(9999999);
        setLocalPageSize("all");
      } else {
        const num = parseInt(saved, 10);
        if (ALLOWED_PAGE_SIZES.includes(num)) {
          setPageSize(num);
          setLocalPageSize(num);
        } else {
          setPageSize(9999999);
          setLocalPageSize("all");
        }
      }
    } else {
      setPageSize(9999999);
      setLocalPageSize("all");
    }
  }, [setPageSize]);

  const handleChangePageSize = (value) => {
    setLocalPageSize(value);
    if (value === "all") {
      setPageSize(9999999);
      setCookie("pageSize", "all");
    } else {
      const num = parseInt(value, 10);
      if (!ALLOWED_PAGE_SIZES.includes(num)) {
        return;
      }
      setPageSize(num);
      setCookie("pageSize", num.toString());
    }
  };

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
    <div className="flex items-center inner-glass-effect rounded-b-xl border border-t-0 border-slate-200 py-6 px-4 text-slate-700 dark:border-white/10 dark:text-white">
      <div className="flex items-center space-x-2">
        <span>Show</span>
        <select
          className="rounded border border-slate-600 bg-slate-800 px-2 py-1 text-gray-200 focus:border-slate-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          value={localPageSize}
          onChange={(e) => handleChangePageSize(e.target.value)}
        >
          {ALLOWED_PAGE_SIZES.map((size) => (
            <option
              key={size}
              value={size}
              className="bg-slate-800 text-gray-200 dark:bg-gray-700 dark:text-gray-200"
            >
              {size}
            </option>
          ))}
          <option
            value="all"
            className="bg-slate-800 text-gray-200 dark:bg-gray-700 dark:text-gray-200"
          >
            All
          </option>
        </select>
        <span>results per page</span>
      </div>

      <div className="flex items-center space-x-1 flex-grow justify-center">
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
                  : "bg-transparent text-slate-600 hover:bg-slate-100 dark:text-[#28f3b0] dark:hover:bg-white/10"
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

      <div className="w-32" />
    </div>
  );
};

export default Pagination;
