/* eslint-disable react/prop-types */
import {
  baseUnitsToWholeRune,
  formatRuneFromBaseUnits,
  formatUsdValue,
} from "../utilities/nodeFormatters";

const StatPill = ({ label, value, sub }) => (
  <div className="rounded-xl bg-white px-3 py-2 dark:bg-white/5">
    <span className="text-[10px] font-bold uppercase text-gray-400">
      {label}
    </span>
    <p className="text-sm font-semibold text-gray-800 dark:text-white">
      {value}
    </p>
    {sub && <p className="text-xs text-gray-500 dark:text-gray-400">{sub}</p>}
  </div>
);

const NodeStatsGrid = ({ node, runePrice }) => {
  const bondAmount = baseUnitsToWholeRune(node.bond);
  const rewardsAmount = baseUnitsToWholeRune(node.current_award);
  const ageText =
    typeof node.age === "number" ? `${node.age.toFixed(1)} days` : "0 days";

  const stats = [
    { label: "Status", value: node.status },
    { label: "Version", value: node.version },
    {
      label: "Bond",
      value: formatRuneFromBaseUnits(node.bond),
      sub: formatUsdValue(bondAmount * runePrice),
    },
    {
      label: "Rewards",
      value: formatRuneFromBaseUnits(node.current_award),
      sub: formatUsdValue(rewardsAmount * runePrice),
    },
    {
      label: "Slashes",
      value: node.slash_points?.toLocaleString() || "0",
    },
    { label: "Age", value: ageText },
    { label: "ISP", value: node.isp || "-" },
    {
      label: "Location",
      value: node.location || node.country_code || "-",
    },
    node.apy ? { label: "APY", value: node.apy } : null,
    node.score ? { label: "Score", value: node.score } : null,
  ].filter(Boolean);

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat) => (
        <StatPill
          key={stat.label}
          label={stat.label}
          value={stat.value}
          sub={stat.sub}
        />
      ))}
    </div>
  );
};

export default NodeStatsGrid;
