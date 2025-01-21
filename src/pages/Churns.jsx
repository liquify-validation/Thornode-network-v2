import { NetworkTable, ChurnStatsCardSection } from "../components";
import {
  networkChurnsTableColumns,
  networkChurnsTableData,
} from "../constants/data";

function Churns() {
  return (
    <>
      <div>
        <ChurnStatsCardSection />
      </div>
      <div className="mt-24">
        <NetworkTable
          title="Config Data"
          columns={networkChurnsTableColumns}
          data={networkChurnsTableData}
        />
      </div>
    </>
  );
}

export default Churns;
