import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import {
  NodeSearchBar,
  NodesFilter,
  NodesTable,
  LoadingSpinner,
  StatsCardSection,
} from "../components";
import { GlobalDataContext } from "../context/GlobalDataContext";
import { useNetworkData } from "../hooks/useNetworkData";
import { useNodeData } from "../hooks/useNodeData";

import { processData } from "../utilities/dataProcessing";
import { getCookieValue, setCookie } from "../utilities/commonFunctions";

const Nodes = ({ isDark }) => {
  const { tab } = useParams();
  const { favoriteNodes } = useContext(GlobalDataContext);
  const [processedData, setProcessedData] = useState({
    activeNodes: [],
    standbyNodes: [],
    otherNodes: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isFiltering, setIsFiltering] = useState(true);
  const [currentTab, setCurrentTab] = useState(tab || "active");
  const [allColumns, setAllColumns] = useState([]);

  const [expandTable, setExpandTable] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("nodeHiddenColumns") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("nodeHiddenColumns", JSON.stringify(hiddenColumns));
  }, [hiddenColumns]);

  useEffect(() => {
    const expandCookie = getCookieValue("expandTable");
    if (expandCookie === "true") {
      setExpandTable(true);
    }
  }, []);

  function handleExpandChange(checked) {
    setExpandTable(checked);
    setCookie("expandTable", checked ? "true" : "false");
  }

  const allNodes = React.useMemo(
    () => [
      ...processedData.activeNodes,
      ...processedData.standbyNodes,
      ...processedData.otherNodes,
    ],
    [processedData]
  );

  const {
    data: globalData,
    isLoading: netLoading,
    isError: netError,
  } = useNetworkData();

  const {
    data: nodeResult,
    isLoading: nodeLoading,
    isError: nodeError,
  } = useNodeData(globalData);

  useEffect(() => {
    if (nodeResult) {
      const newData = processData(
        nodeResult.processedNodes,
        globalData,
        nodeResult.maxVersion,
        favoriteNodes,
        searchTerm
      );
      setProcessedData(newData);
      setIsFiltering(false);
    }
  }, [nodeResult, favoriteNodes, searchTerm, globalData]);

  useEffect(() => {
    setCurrentTab(tab || "active");
  }, [tab]);

  function getCurrentTabData() {
    switch (currentTab.toLowerCase()) {
      case "active":
        return processedData.activeNodes;
      case "standby":
        return processedData.standbyNodes;
      case "other":
        return processedData.otherNodes;
      default:
        return processedData.activeNodes;
    }
  }

  if (netLoading || nodeLoading) {
    return <LoadingSpinner />;
  }
  if (netError) {
    return <div>Error fetching networkData</div>;
  }
  if (nodeError) {
    return <div>Error fetching nodeData</div>;
  }

  const maxChainHeights = nodeResult?.maxChainHeights ?? {};
  return (
    <>
      <Helmet>
        <title>THORChain Network Explorer | Nodes</title>
        <meta
          name="description"
          content="Browse active, standby, or other THORChain nodes. Filter by favorites, search addresses, and analyze node stats."
        />
        <meta
          name="keywords"
          content="THORChain, nodes, active, standby, crypto"
        />
      </Helmet>
      <div>
        <h1 className="text-xl font-bold">Nodes</h1>
        <div className="flex items-center justify-between mt-6 pb-6">
          <StatsCardSection netData={globalData} nodeData={nodeResult} />
        </div>
        <div className="flex items-center justify-between mt-6 pr-8">
          <NodesFilter currentTab={currentTab} />
          <NodeSearchBar
            searchTerm={searchTerm}
            setSearchTerm={(v) => {
              setIsFiltering(true);
              setSearchTerm(v);
            }}
            hiddenColumns={hiddenColumns}
            setHiddenColumns={setHiddenColumns}
            allColumns={allColumns}
            nodes={currentTab === "all" ? allNodes : getCurrentTabData()}
          />
        </div>

        {currentTab !== "all" && (
          <div className="mt-4">
            <NodesTable
              data={getCurrentTabData()}
              setAllColumns={setAllColumns}
              maxChainHeights={maxChainHeights}
              globalData={globalData}
              isDark={isDark}
              expandTable={expandTable}
              onExpandChange={handleExpandChange}
              currentTab={currentTab}
              isFiltering={isFiltering}
              hiddenColumns={hiddenColumns}
            />
          </div>
        )}

        {currentTab === "all" && (
          <>
            {(() => {
              const buckets = [
                {
                  key: "active",
                  title: "Active Nodes",
                  data: processedData.activeNodes,
                  expand: expandTable,
                },
                {
                  key: "standby",
                  title: "Standby Nodes",
                  data: processedData.standbyNodes,
                  expand: false,
                },
                {
                  key: "other",
                  title: "Other Nodes",
                  data: processedData.otherNodes,
                  expand: false,
                },
              ];

              const visibleBuckets = buckets.filter((b) => b.data.length > 0);

              if (!isFiltering && visibleBuckets.length === 0) {
                return (
                  <p className="mt-10 text-center text-gray-700 dark:text-gray-50">
                    No node found for this search
                  </p>
                );
              }

              return (
                <div className="space-y-16 mt-4">
                  {visibleBuckets.map(({ key, title, data, expand }) => (
                    <section key={key}>
                      <h2 className="text-lg font-semibold mb-4">{title}</h2>
                      <NodesTable
                        data={data}
                        setAllColumns={setAllColumns}
                        maxChainHeights={maxChainHeights}
                        globalData={globalData}
                        isDark={isDark}
                        expandTable={expand}
                        onExpandChange={handleExpandChange}
                        currentTab={key}
                        isFiltering={isFiltering}
                        hiddenColumns={hiddenColumns}
                      />
                    </section>
                  ))}
                </div>
              );
            })()}
          </>
        )}
      </div>
    </>
  );
};

export default Nodes;
