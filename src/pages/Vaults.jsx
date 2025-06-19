import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  NetworkTable,
  SearchBar,
  InfoPopover,
  VaultStatusFilter,
} from "../components";
import {
  vaultsTableColumns,
  vaultsTableData,
  vaultDetailColumns,
  vaultDetailMap,
} from "../constants/data";
import { chainIcons, copyToClipboard } from "../utilities/commonFunctions";
import { FavouriteIcon, UnfavouriteIcon } from "../assets";

function Vaults() {
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const toggleFavorite = (vaultId) => {
    setFavoriteIds((prev) =>
      prev.includes(vaultId)
        ? prev.filter((id) => id !== vaultId)
        : [...prev, vaultId]
    );
  };

  const mainColumns = useMemo(() => {
    const newCols = vaultsTableColumns.map((col) => {
      if (col.accessor === "status") {
        return {
          ...col,
          Cell: ({ row }) => {
            const { status } = row.original;
            let bgColor = "bg-gray-500";
            if (status === "active") bgColor = "bg-green-600";
            if (status === "retired") bgColor = "bg-red-600";

            return (
              <span className={`text-white px-3 py-1 rounded-xl ${bgColor}`}>
                {status}
              </span>
            );
          },
        };
      }

      if (col.accessor === "vaultName") {
        return {
          ...col,
          Cell: ({ row }) => {
            const { id, vaultName } = row.original;
            return <Link to={`/network/vaults/${id}`}>{vaultName}</Link>;
          },
        };
      }

      if (col.accessor === "favorite") {
        return {
          ...col,
          Cell: ({ row }) => {
            const vaultId = row.original.id;
            const isFavorite = favoriteIds.includes(vaultId);
            return (
              <img
                src={isFavorite ? FavouriteIcon : UnfavouriteIcon}
                alt="Favorite"
                className="w-5 h-5 cursor-pointer invert dark:invert-0"
                onClick={() => toggleFavorite(vaultId)}
              />
            );
          },
        };
      }

      if (col.accessor === "chains") {
        return {
          ...col,
          Cell: ({ row }) => {
            const chainStr = row.original.chains || "";
            const chainArray = chainStr.split(",").map((c) => c.trim());

            return (
              <div className="flex justify-left space-x-2">
                {chainArray.map((chain) => {
                  const Icon = chainIcons[chain];
                  if (!Icon) return <span key={chain}>{chain}</span>;
                  return (
                    <img
                      key={chain}
                      src={Icon}
                      alt={chain}
                      className="w-6 h-6"
                    />
                  );
                })}
              </div>
            );
          },
        };
      }

      return col;
    });

    const favIndex = newCols.findIndex((c) => c.accessor === "favorite");
    if (favIndex !== -1) {
      const [favCol] = newCols.splice(favIndex, 1);
      newCols.unshift(favCol);
    }

    return newCols;
  }, [favoriteIds]);

  const getDetailColumns = (detailColumns) => {
    return detailColumns.map((col) => {
      if (col.accessor === "address") {
        return {
          ...col,
          Cell: ({ row }) => {
            const address = row.original.address || "";
            const last4 = address.slice(-4);

            return (
              <InfoPopover title="Vault Address" text={address}>
                <span
                  onClick={() => copyToClipboard(address)}
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                  title="Click to copy"
                >
                  ...{last4}
                </span>
              </InfoPopover>
            );
          },
        };
      }
      return col;
    });
  };

  const allVaults = vaultsTableData;
  const filteredVaults = useMemo(() => {
    if (statusFilter === "all") return allVaults;
    return allVaults.filter((v) => v.status.toLowerCase() === statusFilter);
  }, [allVaults, statusFilter]);

  const displayedVaults = useMemo(() => {
    return filteredVaults.filter((v) =>
      v.vaultName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [filteredVaults, searchTerm]);

  const favoriteVaults = allVaults.filter((v) => favoriteIds.includes(v.id));

  return (
    <div className="p-4">
      <div className="flex items-center space-x-4 mt-16">
        <VaultStatusFilter
          statusFilter={statusFilter}
          onChange={setStatusFilter}
        />

        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Search vaults..."
        />
      </div>

      <NetworkTable
        title="All Vaults"
        columns={mainColumns}
        data={displayedVaults}
      />

      {favoriteVaults.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Favourited Vaults Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favoriteVaults.map((vault) => {
              const detailsData = vaultDetailMap[vault.id] || [];
              const detailCols = getDetailColumns(vaultDetailColumns);

              return (
                <div key={vault.id}>
                  <NetworkTable
                    title={`Vault #${vault.id} — ${vault.vaultName}`}
                    columns={detailCols}
                    data={detailsData}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Vaults;
