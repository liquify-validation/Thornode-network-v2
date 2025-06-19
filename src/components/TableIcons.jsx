import React, { useContext } from "react";
import { GlobalDataContext } from "../context/GlobalDataContext";
import {
  NodeGraphIcon,
  ReportIcon,
  ExploreIcon,
  ThornodeApiIcon,
  IpAddressIcon,
} from "../assets";
import { useNavigate } from "react-router-dom";
import InfoPopover from "./InfoPopover";

const TableIcons = ({ node, onOpenChart }) => {
  const { isFavorite, addToFavorites, removeFromFavorites } =
    useContext(GlobalDataContext);
  const navigate = useNavigate();

  const handleCopyIpAddress = () => {
    navigator.clipboard
      .writeText(node.ip_address)
      .then(() => {
        alert("IP address copied to clipboard!");
      })
      .catch(() => {
        alert("Failed to copy IP address.");
      });
  };

  return (
    <div className="flex flex-wrap gap-2 w-full overflow-visible">
      <InfoPopover title="Performance Over Time">
        <img
          src={NodeGraphIcon}
          alt="Chart"
          className="w-5 h-5 cursor-pointer invert dark:invert-0"
          onClick={() => onOpenChart(node.node_address, "position")}
        />
      </InfoPopover>

      <InfoPopover title="Generate Report">
        <img
          src={ReportIcon}
          alt="Report"
          className="w-5 h-5 cursor-pointer invert dark:invert-0"
          onClick={() => {
            navigate(`/nodes/report/${node.node_address}`);
          }}
        />
      </InfoPopover>

      <InfoPopover title="Explore Node">
        <a
          href={`https://viewblock.io/thorchain/address/${node.node_address}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={ExploreIcon}
            alt="Explore Node"
            className="w-5 h-5 invert dark:invert-0"
          />
        </a>
      </InfoPopover>

      <InfoPopover title="Thornode API">
        <a
          href={`https://thornode.ninerealms.com/thorchain/node/${node.node_address}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={ThornodeApiIcon}
            alt="Thornode API"
            className="w-5 h-5 invert dark:invert-0"
          />
        </a>
      </InfoPopover>

      <div className="ip-address-icon">
        <InfoPopover title="IP Address" text={node.ip_address}>
          <img
            src={IpAddressIcon}
            alt="IP Address"
            onClick={handleCopyIpAddress}
            className="w-5 h-5 cursor-pointer invert dark:invert-0"
          />
        </InfoPopover>
      </div>
    </div>
  );
};

export default TableIcons;
