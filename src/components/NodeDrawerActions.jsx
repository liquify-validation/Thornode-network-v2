/* eslint-disable react/prop-types */
import { copyToClipboard } from "../utilities/commonFunctions";
import {
  ReportIcon,
  ExploreIcon,
  ThornodeApiIcon,
  IpAddressIcon,
} from "../assets";

const actionClassName =
  "flex items-center gap-1.5 rounded-lg border border-gray-600 px-3 py-1.5 text-xs text-gray-600 transition-colors hover:border-[#28f3b0] hover:text-[#28f3b0] dark:text-gray-300";

const NodeDrawerActions = ({ address, ipAddress, onOpenNodeReport }) => (
  <div className="flex items-center gap-2 flex-wrap">
    <button
      onClick={onOpenNodeReport}
      className={`${actionClassName} icon-button`}
    >
      <img
        src={ReportIcon}
        alt="Report"
        className="h-4 w-4 invert dark:invert-0"
      />
      Node Report
    </button>

    <a
      href={`https://viewblock.io/thorchain/address/${address}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`${actionClassName} no-underline`}
    >
      <img
        src={ExploreIcon}
        alt="Explore"
        className="h-4 w-4 invert dark:invert-0"
      />
      ViewBlock
    </a>

    <a
      href={`https://gateway.liquify.com/chain/thorchain_api/thorchain/node/${address}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`${actionClassName} no-underline`}
    >
      <img
        src={ThornodeApiIcon}
        alt="API"
        className="h-4 w-4 invert dark:invert-0"
      />
      THORNode API
    </a>

    <button
      onClick={() => {
        copyToClipboard(ipAddress, {
          successMessage: "IP address copied to clipboard!",
          errorMessage: "Failed to copy IP address.",
        });
      }}
      className={`${actionClassName} icon-button`}
    >
      <img
        src={IpAddressIcon}
        alt="IP"
        className="h-4 w-4 invert dark:invert-0"
      />
      {ipAddress}
    </button>
  </div>
);

export default NodeDrawerActions;
