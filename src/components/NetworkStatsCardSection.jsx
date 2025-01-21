import React from "react";
import NetworkStatsCard from "./NetworkStatsCard";
import {
  BitcoinIcon,
  AtomIcon,
  EthIcon,
  LitecoinLogo,
  TetherIcon,
  BnbIcon,
  AvalancheIcon,
  BitcoinCashIcon,
} from "../assets";

const NetworkStatsCardSection = () => {
  const mockChartData = [
    { value: 100 },
    { value: 200 },
    { value: 150 },
    { value: 250 },
    { value: 300 },
  ];

  const cardsData = [
    {
      title: "Mainnet 2.135.0",
      stats: [
        { subtitle: "Age", value: "3 Years, 4 Months" },
        { subtitle: "Height", value: "ᚱ17,569,652" },
        { subtitle: "Blocktime", value: "6.15s" },
      ],
      chartData: mockChartData,
    },
    {
      title: "Bonds",
      stats: [
        { subtitle: "Active", value: "ᚱ3 98,895,519" },
        { subtitle: "Passive", value: "ᚱ5,406,951" },
        { subtitle: "Total", value: "ᚱ10,302,110" },
        { subtitle: "Units", value: "10,557,408" },
      ],
      chartData: mockChartData,
    },
    {
      title: "Observed Txs",
      stats: [
        { subtitle: "BTC", value: "850,045", icon: BitcoinIcon },
        { subtitle: "ETH", value: "120,684,404", icon: EthIcon },
        { subtitle: "LTC", value: "20,684,404", icon: LitecoinLogo },
        { subtitle: "BCH", value: "20,684,404", icon: BitcoinCashIcon },
        { subtitle: "ATOM", value: "120,684,404", icon: AtomIcon },
        { subtitle: "AVAX", value: "20,684,404", icon: AvalancheIcon },
        { subtitle: "USDT", value: "20,684,404", icon: TetherIcon },
      ],
      chartData: mockChartData,
    },
    {
      title: "Validators #102",
      stats: [
        { subtitle: "Version (2.135.0)", value: "102 (100%)" },
        { subtitle: "Optimal Threshold", value: "ᚱ1,105,135" },
        { subtitle: "Bond (av/md)", value: "ᚱ965,564 / ᚱ1,000,688" },
        { subtitle: "APY (av/md)", value: "13.7% / 13.8%" },
      ],
      chartData: mockChartData,
    },
    {
      title: "Churn #254",
      stats: [
        { subtitle: "Last", value: "17,466,148" },
        { subtitle: "Next", value: "17,564,276" },
      ],
      chartData: mockChartData,
    },

    {
      title: "Treasury",
      stats: [
        { subtitle: "Multisig", value: "ᚱ0" },
        { subtitle: "2", value: "ᚱ929" },
        { subtitle: "LP2", value: "ᚱ1200" },
        { subtitle: "Total", value: "ᚱ9129" },
      ],
      chartData: mockChartData,
    },
    {
      title: "Name Service",
      stats: [
        { subtitle: "Fee", value: "ᚱ10" },
        { subtitle: "Per Block", value: "ᚱ0.0000020" },
      ],
      chartData: mockChartData,
    },
    {
      title: "Rune",
      stats: [
        { subtitle: "Switched", value: "ᚱ111,109,884" },
        { subtitle: "Burned BEP20", value: "ᚱ46,342" },
        { subtitle: "Burned ERC20", value: "ᚱ50,409" },
        { subtitle: "Count to Asset/RUNE", value: "3,776,138 / 4,987,105" },
      ],
      chartData: mockChartData,
    },
    {
      title: "Limits",
      stats: [
        { subtitle: "Hard Cap", value: "ᚱ63,437,028" },
        { subtitle: "Total Pooled RUNE", value: "ᚱ29,168,105" },
        { subtitle: "Difference", value: "ᚱ35,267,922" },
      ],
      chartData: mockChartData,
    },
    {
      title: "Synths",
      stats: [
        { subtitle: "Minted", value: "12,617,775" },
        { subtitle: "Burned", value: "11,512,470" },
      ],
      chartData: mockChartData,
    },
    {
      title: "Price",
      stats: [
        { subtitle: "Internal", value: "$3.64" },
        { subtitle: "Deterministic", value: "$0.95" },
        { subtitle: "Valuation Gap", value: "$2.69" },
        { subtitle: "Speculative Multiplier", value: "3.83" },
        { subtitle: "Arbitrage", value: "$0.01" },
      ],
      chartData: mockChartData,
    },
    {
      title: "External(COINCAP)",
      stats: [
        { subtitle: "Price", value: "$3.65 (-2.89%)" },
        { subtitle: "Market Cap", value: "$1,224,267,919" },
        { subtitle: "Volume 25h", value: "$37,792,596" },
        { subtitle: "Supply", value: "ᚱ335,335,296 (500,000,000)" },
      ],
      chartData: mockChartData,
    },
    {
      title: "Liquidity",
      stats: [
        { subtitle: "APY", value: "10.81%" },
        { subtitle: "Added(vol/ct)", value: "ᚱ220,368,199 / 485,572" },
        { subtitle: "Difference", value: "ᚱ228,049,575 / 164,494" },
        { subtitle: "Difference(%)", value: "33.61%" },
      ],
      chartData: mockChartData,
    },
    {
      title: "Swap",
      stats: [
        { subtitle: "Volume", value: "ᚱ18,024689,519" },
        {
          subtitle: "Count(1d/30d/all)",
          value: "16,217 / 95,659 / 35,063,203",
        },
      ],
      chartData: mockChartData,
    },
    {
      title: "Gas",
      stats: [
        { subtitle: "Spent", value: "ᚱ1,1792,825" },
        { subtitle: "Withheld", value: "ᚱ2,311,804" },
      ],
      chartData: mockChartData,
    },
    {
      title: "Fees",
      stats: [
        { subtitle: "Transaction", value: "ᚱ0.020" },
        { subtitle: "Outbound", value: "ᚱ0.020" },
        { subtitle: "Outbound Multiplier", value: "1000" },
      ],
      chartData: mockChartData,
    },
    {
      title: "Supply",
      stats: [
        { subtitle: "Circulating Supply", value: "ᚱ335,366,091" },
        { subtitle: "Per Block", value: "ᚱ0.00000020" },
      ],
      chartData: mockChartData,
    },
    {
      title: "Reserve",
      stats: [
        { subtitle: "Active", value: "ᚱ78,417,859" },
        { subtitle: "Standby", value: "ᚱ1" },
      ],
      chartData: mockChartData,
    },
    {
      title: "Vault#6",
      stats: [{ subtitle: "Migration", value: "NO" }],
      chartData: mockChartData,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-24">
      {cardsData.map((card, index) => (
        <NetworkStatsCard
          key={index}
          title={card.title}
          stats={card.stats}
          chartData={card.chartData}
        />
      ))}
    </div>
  );
};

export default NetworkStatsCardSection;
