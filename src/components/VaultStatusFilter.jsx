/* eslint-disable react/prop-types */
import Tabs from "./Tabs";

const vaultStatusTabs = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "retiring", label: "Retiring" },
  { value: "pending", label: "Pending" },
];

const VaultStatusFilter = ({ statusFilter, onChange }) => {
  return (
    <Tabs items={vaultStatusTabs} value={statusFilter} onChange={onChange} />
  );
};

export default VaultStatusFilter;
