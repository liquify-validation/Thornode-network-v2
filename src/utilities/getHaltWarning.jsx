import { WarningIcon } from "../assets";
import { InfoPopover } from "../components";

export function getHaltsData(globalData) {
  if (typeof globalData.halts === "string") {
    try {
      return JSON.parse(globalData.halts);
    } catch (error) {
      console.error("Failed to parse halts JSON", error);
      return {};
    }
  }
  return globalData.halts || {};
}

export function getHaltWarning(chain, haltsData) {
  const chainData = haltsData[chain];
  if (!chainData) return null;

  const haltedTypes = [];
  if (chainData.SIGNING === 1) haltedTypes.push("Signing is Halted");
  if (chainData.TRADING === 1) haltedTypes.push("Trading is Halted");
  if (chainData.CHAIN === 1) haltedTypes.push("Chain is Halted");

  if (haltedTypes.length === 0) return null; // No halts

  return (
    <InfoPopover title="Warning" text={haltedTypes.join(", ")}>
      <img
        src={WarningIcon}
        alt="Warning Icon"
        className="absolute ml-[20px] w-4 h-4 text-red-500"
      />
    </InfoPopover>
  );
}
