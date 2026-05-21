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

export function getHaltedTypes(chainData) {
  if (!chainData) return [];

  const haltedTypes = [];
  if (chainData.SIGNING === 1) haltedTypes.push("Signing is Halted");
  if (chainData.TRADING === 1) haltedTypes.push("Trading is Halted");
  if (chainData.CHAIN === 1) haltedTypes.push("Chain is Halted");

  return haltedTypes;
}

export function isChainHalted(chain, haltsData) {
  return getHaltedTypes(haltsData?.[chain]).length > 0;
}

export function getHaltWarning(chain, haltsData) {
  const chainData = haltsData[chain];
  const haltedTypes = getHaltedTypes(chainData);

  if (haltedTypes.length === 0) return null; // No halts

  return (
    <InfoPopover title="Warning" text={haltedTypes.join(", ")}>
      <span className="-ml-1 inline-flex shrink-0 items-center justify-center rounded-full bg-orange-100 p-0.5 ring-1 ring-orange-300 dark:bg-orange-500/15 dark:ring-orange-400/40">
        <img
          src={WarningIcon}
          alt="Warning Icon"
          className="inline-block h-3.5 w-3.5"
          style={{
            filter:
              "brightness(0) saturate(100%) invert(57%) sepia(97%) saturate(1802%) hue-rotate(350deg) brightness(100%) contrast(97%)",
          }}
        />
      </span>
    </InfoPopover>
  );
}
