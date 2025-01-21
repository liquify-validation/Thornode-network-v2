import NetworkTable from "../components/NetworkTable";
import {
  networkConfigTableColumns,
  networkConfigTableData,
} from "../constants/data";

function Config() {
  return (
    <div className="mt-24">
      <NetworkTable
        title="Config Data"
        columns={networkConfigTableColumns}
        data={networkConfigTableData}
      />
    </div>
  );
}

export default Config;
