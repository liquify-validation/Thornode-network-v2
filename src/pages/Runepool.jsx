import ModernPieChart from "../components/ModernPieChart";
import NetworkStatsCard from "../components/NetworkStatsCard";
import NetworkTable from "../components/NetworkTable";
import { runepoolTableColumns, runepoolTableData } from "../constants/data";

// TODO - Replace mockdata
// TODO - Center legend
// TODO - Icons by legend
// TODO - Hover on piechart shows addresses and has copy icons
// TODO - Add lines to network cards
// TODO - Divider line colors
// TODO - Remove index
// TODO - Add icons to table
// TODO - Add margin top

const Runepool = () => {
  const assetDistribution = [
    { name: "BTC", value: 30 },
    { name: "ETH", value: 25 },
    { name: "AVAX", value: 10 },
    { name: "BCH", value: 10 },
    { name: "LTC", value: 5 },
    { name: "USDT", value: 8 },
    { name: "BNB", value: 7 },
    { name: "USDC", value: 5 },
    { name: "XRP", value: 8 },
  ];

  const systemStats = [
    { subtitle: "Remaining Capacity", value: "10,000 RUNE" },
    { subtitle: "Min Depth", value: "1,000 RUNE" },
  ];

  const reservedStats = [
    { subtitle: "Max Backdrop", value: "5,000 RUNE" },
    { subtitle: "Difference", value: "2,500 RUNE" },
  ];

  const providerStats = [
    { subtitle: "PnL", value: "15%" },
    { subtitle: "Growth (av/md)", value: "10/15" },
    { subtitle: "Time to Profitability", value: "2 weeks" },
  ];

  const maturityStats = [
    { subtitle: "Days", value: "10" },
    { subtitle: "Blocks", value: "72,000" },
    { subtitle: "Blocktime", value: "6s" },
  ];

  return (
    <div className="p-4">
      <div className="flex flex-wrap mb-4">
        <div className="w-full md:w-1/2 px-2">
          <ModernPieChart
            data={assetDistribution}
            title="Asset Distribution"
            subtitle="Total Assets"
            centerValueMode="sum"
          />
        </div>

        <div className="w-full md:w-1/2 px-2">
          <div className="flex flex-wrap">
            <div className="w-full md:w-1/2 p-2">
              <NetworkStatsCard title="System" stats={systemStats} />
            </div>
            <div className="w-full md:w-1/2 p-2">
              <NetworkStatsCard title="Reserved" stats={reservedStats} />
            </div>
            <div className="w-full md:w-1/2 p-2">
              <NetworkStatsCard title="Provider" stats={providerStats} />
            </div>
            <div className="w-full md:w-1/2 p-2">
              <NetworkStatsCard title="Maturity" stats={maturityStats} />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mt-8">
        <NetworkTable
          title="RunePool Table"
          columns={runepoolTableColumns}
          data={runepoolTableData}
        />
      </div>
    </div>
  );
};

export default Runepool;
