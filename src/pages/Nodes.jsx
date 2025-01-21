import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import {
  SearchBar,
  NodesFilter,
  NodesTable,
  LoadingSpinner,
} from "../components";
import { GlobalDataContext } from "../context/GlobalDataContext";
import { useThorChainData } from "../hooks/useThorChainData";
import { processData } from "../utilities/dataProcessing";

const Nodes = () => {
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

  const { data: thorData, isLoading, isError } = useThorChainData();

  console.log("thorData", thorData);

  useEffect(() => {
    if (!thorData) return;

    const newData = processData(
      thorData.data,
      thorData.globalData,
      favoriteNodes,
      searchTerm
    );
    setProcessedData(newData);
  }, [thorData, favoriteNodes, searchTerm]);

  useEffect(() => {
    setCurrentTab(tab || "active");
  }, [tab]);

  const getCurrentTabData = () => {
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
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (isError) {
    console.log("Error fetching nodes:", isError.message);
  }

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
            maxChainHeights={thorData.maxChainHeights}
            globalData={thorData.globalData}
          />
        </div>
      </div>
    </>
  );
};

export default Nodes;
