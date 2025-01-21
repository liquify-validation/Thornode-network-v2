import React, { createContext, useState, useEffect } from "react";
import { getData } from "../services/dataService";

export const GlobalDataContext = createContext();

export const GlobalDataProvider = ({ children }) => {
  const [globalData, setGlobalData] = useState(null);
  const [nodesData, setNodesData] = useState([]);
  const [maxChainHeights, setMaxChainHeights] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [favoriteNodes, setFavoriteNodes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const results = await getData();
        if (results) {
          setGlobalData(results.globalData);
          setNodesData(results.data);
          setMaxChainHeights(results.maxChainHeights);
          const storedFavorites =
            JSON.parse(localStorage.getItem("favoriteNodes")) || [];
          setFavoriteNodes(storedFavorites);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem("favoriteNodes", JSON.stringify(favoriteNodes));
  }, [favoriteNodes]);

  const addToFavorites = (address) => {
    setFavoriteNodes((prev) => [...prev, address]);
  };

  const removeFromFavorites = (address) => {
    setFavoriteNodes((prev) => prev.filter((node) => node !== address));
  };

  const isFavorite = (address) => favoriteNodes.includes(address);

  return (
    <GlobalDataContext.Provider
      value={{
        globalData,
        nodesData,
        maxChainHeights,
        loading,
        error,
        favoriteNodes,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
      }}
    >
      {children}
    </GlobalDataContext.Provider>
  );
};
