import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import { LoadingSpinner } from "../components";
import Box from "../ui/Box";
import { useMimirData } from "../hooks/useMimirData";
import { MagnifyingGlass } from "../assets";

function Mimir() {
  const { data: mimirData, isLoading, isError, error } = useMimirData();
  const [searchTerm, setSearchTerm] = useState("");

  const mimirEntries = useMemo(() => {
    if (!mimirData) return [];
    try {
      // API may return flat object directly, or wrapped in mimir_data
      let obj = mimirData;
      if (mimirData.mimir_data) {
        obj =
          typeof mimirData.mimir_data === "string"
            ? JSON.parse(mimirData.mimir_data)
            : mimirData.mimir_data;
      }
      return Object.entries(obj).sort(([a], [b]) => a.localeCompare(b));
    } catch {
      return [];
    }
  }, [mimirData]);

  const filteredEntries = useMemo(() => {
    if (!searchTerm) return mimirEntries;
    const lower = searchTerm.toLowerCase();
    return mimirEntries.filter(([key]) => key.toLowerCase().includes(lower));
  }, [mimirEntries, searchTerm]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4">
        <p className="text-red-500">Error: {error?.message}</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>THORChain Network Explorer | Mimir</title>
        <meta
          name="description"
          content="View THORChain Mimir governance parameters and network configuration."
        />
      </Helmet>
      <div className="p-4">
        <h1 className="text-2xl text-gray-800 dark:text-white font-bold mb-6">
          Mimir - Governance Parameters
        </h1>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <img
              src={MagnifyingGlass}
              alt="Search"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-50 invert dark:invert-0"
            />
            <input
              type="text"
              placeholder="Search parameters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl inner-glass-effect text-gray-800 dark:text-white
                placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#28f3b0]/50"
            />
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredEntries.length} of {mimirEntries.length} parameters
          </span>
        </div>

        <Box className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-4 py-3 text-base font-bold uppercase text-gray-700 dark:text-white">
                  Parameter
                </th>
                <th className="text-right px-4 py-3 text-base font-bold uppercase text-gray-700 dark:text-white">
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map(([key, value]) => (
                <tr
                  key={key}
                  className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  <td className="px-4 py-3 text-base font-mono text-gray-700 dark:text-gray-300">
                    {key}
                  </td>
                  <td className="px-4 py-3 text-base text-right font-mono text-[#28f3b0]">
                    {typeof value === "number"
                      ? value.toLocaleString()
                      : String(value)}
                  </td>
                </tr>
              ))}
              {filteredEntries.length === 0 && (
                <tr>
                  <td
                    colSpan={2}
                    className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No parameters match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Box>
      </div>
    </>
  );
}

export default Mimir;
