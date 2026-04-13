import { useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { LoadingSpinner, NetworkTable, Tabs } from "../components";
import { useMimirData } from "../hooks/useMimirData";

function parseMimir(raw) {
  if (!raw) return {};
  if (raw.mimir_data) {
    return typeof raw.mimir_data === "string"
      ? JSON.parse(raw.mimir_data)
      : raw.mimir_data;
  }
  return raw;
}

function categorizeKey(key, value) {
  if (typeof value === "boolean") return "Boolean";

  if (/^HALT|PAUSE|ENABLE|DISABLE|STOP|BURN|MINT|THORNAMES|RUNEPOOLENABLED/i.test(key)) {
    return "Toggle";
  }

  if (/INTERVAL|CYCLE|BLOCKS|MAXAGE|MIGRATION|SCHEDULED|HEIGHT/i.test(key)) {
    return "Block / Interval";
  }

  if (/BPS|BASISPOINTS|REDLINE|THRESHOLD|CR$|SLIP|LEVER/i.test(key)) {
    return "Rate / Threshold";
  }

  if (/RUNE|BOND|LIQUIDITY|SUPPLY|VOLUME|DEPTH|CAP|FEE|STAKE|LIMIT|CURVE/i.test(key)) {
    return "Amount / Limit";
  }

  if (/SET|SIZE|COUNT|NUMBER|CONCURRENCY|ATTEMPTS|ROUND/i.test(key)) {
    return "Count / Capacity";
  }

  return typeof value === "number" ? "Numeric Setting" : "String";
}

function formatValue(value) {
  if (typeof value === "number") return value.toLocaleString();
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value);
}

function Config() {
  const { data: mimirData, isLoading, isError, error } = useMimirData();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const rows = useMemo(() => {
    try {
      return Object.entries(parseMimir(mimirData))
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => ({
          key,
          value: formatValue(value),
          category: categorizeKey(key, value),
        }));
    } catch {
      return [];
    }
  }, [mimirData]);

  const categories = useMemo(
    () => ["All", ...new Set(rows.map((row) => row.category))],
    [rows],
  );

  const filteredRows = useMemo(() => {
    if (selectedCategory === "All") return rows;
    return rows.filter((row) => row.category === selectedCategory);
  }, [rows, selectedCategory]);

  const categoryTabs = useMemo(
    () =>
      categories.map((category) => ({
        value: category,
        label: category,
      })),
    [categories],
  );

  const columns = useMemo(
    () => [
      { Header: "Key", accessor: "key" },
      { Header: "Value", accessor: "value" },
      { Header: "Category", accessor: "category" },
    ],
    [],
  );

  if (isLoading) {
    return (
      <div className="p-2 mt-12 h-[55vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return <div className="p-4 text-red-500">Error: {error?.message}</div>;
  }

  return (
    <>
      <Helmet>
        <title>THORChain Network Explorer | Config</title>
      </Helmet>
      <div className="p-2 mt-12">
        <div className="mb-8">
          <h1 className="text-2xl text-gray-800 dark:text-white font-bold mb-3">
            Config
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-300 max-w-3xl">
            Live configuration table sourced from current Mimir values.
          </p>
        </div>

        <div className="mb-4">
          <Tabs
            items={categoryTabs}
            value={selectedCategory}
            onChange={setSelectedCategory}
          />
        </div>

        <NetworkTable
          title={`Config Data${selectedCategory === "All" ? "" : ` - ${selectedCategory}`}`}
          columns={columns}
          data={filteredRows}
        />
      </div>
    </>
  );
}

export default Config;
