import React, { createContext, useState, useEffect } from "react";

export const GlobalDataContext = createContext();

export const GlobalDataProvider = ({ children }) => {
  const [favoriteNodes, setFavoriteNodes] = useState(() => {
    return JSON.parse(localStorage.getItem("favoriteNodes")) || [];
  });

  useEffect(() => {
    localStorage.setItem("favoriteNodes", JSON.stringify(favoriteNodes));
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
