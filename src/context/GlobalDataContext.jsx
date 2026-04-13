/* eslint-disable react-refresh/only-export-components, react/prop-types */
import { createContext, useState, useEffect } from "react";
import { getStoredJson, setStoredJson } from "../utilities/commonFunctions";

export const GlobalDataContext = createContext();

export const GlobalDataProvider = ({ children }) => {
  const [favoriteNodes, setFavoriteNodes] = useState(() => {
    const storedFavorites = getStoredJson("favoriteNodes", []);
    return Array.isArray(storedFavorites) ? storedFavorites : [];
  });

  useEffect(() => {
    setStoredJson("favoriteNodes", favoriteNodes);
  }, [favoriteNodes]);

  const addToFavorites = (address) =>
    setFavoriteNodes((prev) => [...prev, address]);

  const removeFromFavorites = (address) =>
    setFavoriteNodes((prev) => prev.filter((node) => node !== address));

  const isFavorite = (address) => favoriteNodes.includes(address);

  return (
    <GlobalDataContext.Provider
      value={{
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
