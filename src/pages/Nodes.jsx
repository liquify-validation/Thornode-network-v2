import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import {
  SearchBar,
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
  const [currentTab, setCurrentTab] = useState(tab || "active");
  const [allColumns, setAllColumns] = useState([]);

  const [expandTable, setExpandTable] = useState(false);

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

  // Access maxChainHeights from nodeResult
  const maxChainHeights = nodeResult.maxChainHeights;
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
        <div className="flex items-center justify-between mt-6">
          <NodesFilter currentTab={currentTab} />
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            allColumns={allColumns}
            nodes={getCurrentTabData()}
          />
        </div>
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
          />
        </div>
      </div>
    </>
  );
};

export default Nodes;
