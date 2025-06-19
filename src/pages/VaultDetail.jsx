import NetworkTable from "../components/NetworkTable";
import { vaultDetailColumns, vaultDetailData } from "../constants/data";
import { useParams } from "react-router-dom";

// TODO - Add back component
// TODO - Add copy icon next to address
// TODO - Asset Icon
// TODO - Remove index

function VaultDetail() {
  const { vaultId } = useParams();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Vault Detail (Vault ID: {vaultId})
      </h1>

      <NetworkTable
        title={`Vault #${vaultId} Assets`}
        columns={vaultDetailColumns}
        data={vaultDetailData}
      />
    </div>
  );
}

export default VaultDetail;
