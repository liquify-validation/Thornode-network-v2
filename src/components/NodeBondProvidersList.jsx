/* eslint-disable react/prop-types */
import { copyToClipboard } from "../utilities/commonFunctions";
import { formatRuneFromBaseUnits } from "../utilities/nodeFormatters";

const NodeBondProvidersList = ({
  address,
  providers,
  onOpenBondProviderReport,
}) => {
  if (!providers.length) {
    return null;
  }

  return (
    <div className="mb-4">
      <h3 className="mb-2 text-sm font-bold uppercase text-gray-400">
        Bond Providers ({providers.length})
      </h3>
      <div className="space-y-1">
        {providers.map((provider, index) => (
          <div
            key={`${provider.bond_address}-${index}`}
            className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-xs"
          >
            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(provider.bond_address)}
                className="icon-button bg-transparent p-0 text-xs text-[#28f3b0] hover:text-[#7EF7D6] hover:underline"
                title="Copy address"
              >
                {provider.bond_address?.slice(-8)}
              </button>
              <button
                onClick={() =>
                  onOpenBondProviderReport(address, provider.bond_address)
                }
                className="icon-button rounded border border-gray-600 bg-transparent px-1.5 py-0.5 text-[10px] text-gray-400 hover:border-[#28f3b0] hover:text-[#28f3b0]"
                title="Generate BP Report"
              >
                BP Report
              </button>
            </div>
            <span className="text-gray-600 dark:text-gray-300">
              {formatRuneFromBaseUnits(provider.bond)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NodeBondProvidersList;
