import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import { LoadingSpinner, VaultStatusFilter, SearchBar } from "../components";
import Box from "../ui/Box";
import StatsCard from "../components/StatsCard";
import {
  useAsgardVaults,
  usePendingVaults,
} from "../hooks/useVaultsData";
import { BondIcon, BlockIcon, NodesIcon } from "../assets";
import { chainIcons } from "../utilities/commonFunctions";

function Vaults({ isDark }) {
  const [statusFilter, setStatusFilter] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedVaults, setExpandedVaults] = useState({});

  const toggleVault = (pubKey) => {
    setExpandedVaults((prev) => ({ ...prev, [pubKey]: !prev[pubKey] }));
  };

  const { data: asgardVaults, isLoading: asgardLoading } = useAsgardVaults();
  const { data: pendingVaults, isLoading: pendingLoading } =
    usePendingVaults();

  const isLoading = asgardLoading || pendingLoading;

  const allVaults = useMemo(() => {
    const asgard = Array.isArray(asgardVaults) ? asgardVaults : [];
    const pending = Array.isArray(pendingVaults) ? pendingVaults : [];
    return [...asgard, ...pending];
  }, [asgardVaults, pendingVaults]);

  const filteredVaults = useMemo(() => {
    const asgard = Array.isArray(asgardVaults) ? asgardVaults : [];
    const pending = Array.isArray(pendingVaults) ? pendingVaults : [];

    let list;
    if (statusFilter === "all") list = allVaults;
    else if (statusFilter === "active") {
      list = asgard.filter(
        (v) => (v.status || "").toLowerCase() === "activevault"
      );
    } else if (statusFilter === "retired") {
      list = [
        ...asgard.filter(
          (v) => (v.status || "").toLowerCase() === "retiringvault"
        ),
        ...pending,
      ];
    } else {
      list = allVaults;
    }

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      list = list.filter(
        (v) =>
          (v.pub_key || "").toLowerCase().includes(lower) ||
          (v.node_address || "").toLowerCase().includes(lower)
      );
    }

    return list;
  }, [asgardVaults, pendingVaults, allVaults, statusFilter, searchTerm]);

  function parseCoins(coins) {
    if (Array.isArray(coins)) return coins;
    try {
      return JSON.parse(coins || "[]");
    } catch {
      return [];
    }
  }

  function parseMembership(membership) {
    if (Array.isArray(membership)) return membership.length;
    try {
      const parsed = JSON.parse(membership || "[]");
      return Array.isArray(parsed) ? parsed.length : 0;
    } catch {
      return 0;
    }
  }

  function shortenPubKey(key) {
    if (!key || key.length < 16) return key || "";
    return `${key.slice(0, 8)}...${key.slice(-8)}`;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  const activeCount = (
    Array.isArray(asgardVaults) ? asgardVaults : []
  ).filter((v) => (v.status || "").toLowerCase() === "activevault").length;
  const pendingCount = Array.isArray(pendingVaults)
    ? pendingVaults.length
    : 0;
  const retiringCount = (
    Array.isArray(asgardVaults) ? asgardVaults : []
  ).filter((v) => (v.status || "").toLowerCase() === "retiringvault").length;

  return (
    <>
      <Helmet>
        <title>THORChain Network Explorer | Vaults</title>
        <meta
          name="description"
          content="View THORChain Asgard and pending vaults, total value locked, and vault membership."
        />
      </Helmet>
      <div className="p-4">
        <h1 className="text-2xl text-gray-800 dark:text-white font-bold mb-6">
          Vaults
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            icon={BondIcon}
            title="Total Vaults"
            stat={String(allVaults.length)}
          />
          <StatsCard
            icon={NodesIcon}
            title="Active Vaults"
            stat={String(activeCount)}
          />
          <StatsCard
            icon={BlockIcon}
            title="Retiring Vaults"
            stat={String(retiringCount)}
          />
          <StatsCard
            icon={NodesIcon}
            title="Pending Vaults"
            stat={String(pendingCount)}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <VaultStatusFilter
            statusFilter={statusFilter}
            onChange={setStatusFilter}
          />
          <div className="flex items-center gap-4">
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Search vaults..."
            />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {filteredVaults.length} vault
              {filteredVaults.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {filteredVaults.map((vault) => {
            const coins = parseCoins(vault.coins);
            const memberCount = parseMembership(vault.membership);
            const members = Array.isArray(vault.membership)
              ? vault.membership
              : [];
            const rawStatus = (vault.status || "unknown")
              .replace("Vault", "")
              .replace("vault", "");
            const statusLabel =
              rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);
            const isExpanded = expandedVaults[vault.pub_key] || false;

            const renderCoinBadge = (coin, idx) => {
              const asset = coin.asset || "";
              const chain = asset.split(".")[0] || asset;
              const ticker =
                asset.split(".")[1]?.split("-")[0] || chain;
              const decimals = coin.decimals || 8;
              const amount = (
                Number(coin.amount) / Math.pow(10, decimals)
              ).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              });
              const ChainIcon = chainIcons[chain];

              return (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs
                    bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300"
                >
                  {ChainIcon && (
                    <img
                      src={ChainIcon}
                      alt={chain}
                      className="w-4 h-4"
                    />
                  )}
                  <span className="font-semibold">{ticker}</span>
                  <span>{amount}</span>
                </span>
              );
            };

            return (
              <Box key={vault.pub_key} className="p-4">
                {/* Header row - always visible */}
                <button
                  type="button"
                  onClick={() => toggleVault(vault.pub_key)}
                  className="w-full text-left"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold uppercase ${
                          statusLabel.toLowerCase() === "active"
                            ? "bg-green-500/20 text-green-400"
                            : statusLabel.toLowerCase() === "retiring"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {statusLabel}
                      </span>
                      <span className="text-sm font-mono text-gray-600 dark:text-gray-300">
                        {shortenPubKey(vault.pub_key)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>{coins.length} assets</span>
                      <span>{memberCount} members</span>
                      {vault.block_height && (
                        <span>
                          Block:{" "}
                          {Number(vault.block_height).toLocaleString()}
                        </span>
                      )}
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M19 9l-7 7-7-7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </button>

                {/* Asset preview - always visible */}
                {coins.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {coins.slice(0, 8).map(renderCoinBadge)}
                    {coins.length > 8 && (
                      <button
                        type="button"
                        onClick={() => toggleVault(vault.pub_key)}
                        className="px-2 py-1 text-xs text-[#28f3b0] hover:underline"
                      >
                        +{coins.length - 8} more
                      </button>
                    )}
                  </div>
                )}

                {/* Expanded details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700/50 space-y-4">
                    {/* Full Public Key */}
                    <div>
                      <h4 className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                        Public Key
                      </h4>
                      <p className="text-sm font-mono text-gray-700 dark:text-gray-300 break-all">
                        {vault.pub_key}
                      </p>
                    </div>

                    {/* Vault details grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <h4 className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                          Status
                        </h4>
                        <p className={`text-sm font-semibold ${
                          statusLabel.toLowerCase() === "active"
                            ? "text-green-400"
                            : statusLabel.toLowerCase() === "retiring"
                            ? "text-yellow-400"
                            : "text-gray-400"
                        }`}>
                          {statusLabel}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                          Type
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {vault.vault_type || "—"}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                          Block Height
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {vault.block_height
                            ? Number(vault.block_height).toLocaleString()
                            : "—"}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
                          Members
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {memberCount}
                        </p>
                      </div>
                    </div>

                    {/* All assets */}
                    {coins.length > 8 && (
                      <div>
                        <h4 className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
                          All Assets ({coins.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {coins.map(renderCoinBadge)}
                        </div>
                      </div>
                    )}

                    {/* Membership Addresses */}
                    {members.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
                          Member Addresses ({members.length})
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                          {members.map((addr, idx) => (
                            <span
                              key={idx}
                              className="text-xs font-mono text-gray-600 dark:text-gray-400 truncate"
                              title={addr}
                            >
                              {addr}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Box>
            );
          })}

          {filteredVaults.length === 0 && (
            <Box className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No vaults found for this filter.
              </p>
            </Box>
          )}
        </div>
      </div>
    </>
  );
}

export default Vaults;
