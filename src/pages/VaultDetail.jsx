import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { LoadingSpinner, NetworkTable, InfoPopover } from "../components";
import { useAsgardVaults, usePendingVaults } from "../hooks/useVaultsData";
import { copyToClipboard } from "../utilities/commonFunctions";

function parseCoins(coins) {
  if (Array.isArray(coins)) return coins;
  try {
    return JSON.parse(coins || "[]");
  } catch {
    return [];
  }
}

function formatAmount(amount, decimals = 8) {
  const num = Number(amount) / Math.pow(10, decimals);
  if (!Number.isFinite(num)) return "—";
  return num.toLocaleString(undefined, { maximumFractionDigits: 4 });
}

function VaultDetail() {
  const { vaultId } = useParams();
  const { data: asgardVaults, isLoading: asgardLoading } = useAsgardVaults();
  const { data: pendingVaults, isLoading: pendingLoading } = usePendingVaults();

  const vault = useMemo(() => {
    const merged = [
      ...(Array.isArray(asgardVaults) ? asgardVaults : []),
      ...(Array.isArray(pendingVaults) ? pendingVaults : []),
    ];
    return merged.find((item) => item.pub_key === vaultId) || null;
  }, [asgardVaults, pendingVaults, vaultId]);

  const data = useMemo(() => {
    if (!vault) return [];
    return parseCoins(vault.coins).map((coin) => ({
      asset: coin.asset,
      amount: formatAmount(coin.amount, coin.decimals || 8),
      decimals: coin.decimals || 8,
      address: vault.pub_key,
    }));
  }, [vault]);

  const columns = useMemo(
    () => [
      { Header: "Asset", accessor: "asset" },
      { Header: "Amount", accessor: "amount" },
      { Header: "Decimals", accessor: "decimals" },
      {
        Header: "Address",
        accessor: "address",
        Cell: ({ value }) => {
          const last4 = value.slice(-4);
          return (
            <InfoPopover title="Vault Address" text={value}>
              <span
                onClick={() => copyToClipboard(value)}
                style={{ cursor: "pointer", textDecoration: "underline" }}
              >
                ...{last4}
              </span>
            </InfoPopover>
          );
        },
      },
    ],
    [],
  );

  if (asgardLoading || pendingLoading) {
    return (
      <div className="p-2 mt-12 h-[55vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!vault) {
    return <div className="p-4 text-red-500">Vault not found.</div>;
  }

  return (
    <>
      <Helmet>
        <title>THORChain Network Explorer | Vault Detail</title>
      </Helmet>
      <div className="p-2 ">
        <h1 className="text-2xl font-bold mb-4">Vault Detail</h1>
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          {vault.pub_key}
        </p>
        <NetworkTable title={`Vault Assets`} columns={columns} data={data} />
      </div>
    </>
  );
}

export default VaultDetail;
