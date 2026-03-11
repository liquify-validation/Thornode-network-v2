import React, { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  ModernLineChart,
  ModernScatterChart,
  LoadingSpinner,
  Modal,
} from "../components";
import { useNodeBondData } from "../hooks/useNodeBondData";
import { useNodeRewardsData } from "../hooks/useNodeRewardsData";
import { useNodePositionData } from "../hooks/useNodePositionData";
import { useNodeSlashesData } from "../hooks/useNodeSlashesData";
import { copyToClipboard } from "../utilities/commonFunctions";
import {
  ReportIcon,
  ExploreIcon,
  ThornodeApiIcon,
  IpAddressIcon,
} from "../assets";

/* ── range presets (number of data points from the end) ── */
const RANGE_PRESETS = [
  { label: "Last 50", value: 50 },
  { label: "Last 100", value: 100 },
  { label: "Last 250", value: 250 },
  { label: "All", value: 0 },
];

/* ── small reusable pieces ── */
const StatPill = ({ label, value, sub }) => (
  <div className="bg-white dark:bg-white/5 rounded-xl px-3 py-2">
    <span className="text-[10px] uppercase font-bold text-gray-400">{label}</span>
    <p className="text-sm font-semibold text-gray-800 dark:text-white">{value}</p>
    {sub && <p className="text-xs text-gray-500 dark:text-gray-400">{sub}</p>}
  </div>
);

/* ── range selector bar ── */
const RangeBar = ({ range, setRange, totalPoints }) => (
  <div className="flex items-center gap-1.5 flex-wrap">
    {RANGE_PRESETS.map((p) => (
      <button
        key={p.label}
        onClick={() => setRange(p.value)}
        className={`text-[11px] px-2 py-0.5 rounded-md icon-button border
          ${range === p.value
            ? "bg-[#28f3b0] text-gray-900 border-[#28f3b0]"
            : "bg-transparent text-gray-400 border-gray-600 hover:border-gray-400"}`}
      >
        {p.label}
      </button>
    ))}
    {totalPoints > 0 && (
      <span className="text-[10px] text-gray-500 ml-auto">{totalPoints} pts</span>
    )}
  </div>
);

/* ── apply range to data array ── */
function sliceData(data, range) {
  if (!data || data.length === 0) return data;
  if (range === 0 || range >= data.length) return data;
  return data.slice(-range);
}

/* ── chart wrapper with expand + range ── */
const ChartSection = ({ title, data, isLoading, isDark, renderChart, renderExpandedChart }) => {
  const [range, setRange] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const sliced = useMemo(() => sliceData(data, range), [data, range]);

  if (isLoading) {
    return (
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">{title}</h3>
        <LoadingSpinner />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">{title}</h3>
        <p className="text-sm text-gray-500">No data</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-gray-400 uppercase">{title}</h3>
          <button
            onClick={() => setExpanded(true)}
            className="icon-button text-[11px] text-gray-400 hover:text-[#28f3b0] bg-transparent border border-gray-600 hover:border-[#28f3b0] px-2 py-0.5 rounded-md"
            title="Expand chart"
          >
            Expand
          </button>
        </div>
        <RangeBar range={range} setRange={setRange} totalPoints={data.length} />
        <div className="mt-2">
          {renderChart(sliced)}
        </div>
      </div>

      {expanded && (
        <ExpandedChartModal
          title={title}
          data={data}
          isDark={isDark}
          onClose={() => setExpanded(false)}
          renderChart={renderExpandedChart || renderChart}
        />
      )}
    </>
  );
};

/* ── expanded full-screen chart modal ── */
const ExpandedChartModal = ({ title, data, isDark, onClose, renderChart }) => {
  const [range, setRange] = useState(0);
  const sliced = useMemo(() => sliceData(data, range), [data, range]);

  const modal = (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="relative z-10 w-full max-w-6xl mx-4 bg-gray-100 dark:bg-[#132a3c] rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h2>
          <div className="flex items-center gap-4">
            <RangeBar range={range} setRange={setRange} totalPoints={data.length} />
            <button
              onClick={onClose}
              className="icon-button text-gray-500 dark:text-gray-300 hover:text-white text-2xl p-1"
            >
              &#x2715;
            </button>
          </div>
        </div>
        <div className="p-6" style={{ minHeight: 500 }}>
          {renderChart(sliced)}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.getElementById("popover-root"));
};

/* ── main drawer ── */
const NodeDrawer = ({ node, onClose, isDark, runePrice = 0 }) => {
  const navigate = useNavigate();
  if (!node) return null;

  const address = node.node_address;
  const { data: bondData, isLoading: bondLoading } = useNodeBondData(address);
  const { data: rewardsData, isLoading: rewardsLoading } = useNodeRewardsData(address);
  const { data: positionData, isLoading: positionLoading } = useNodePositionData(address);
  const { data: slashesData, isLoading: slashesLoading } = useNodeSlashesData(address);

  const bond = Math.round(node.bond / 1e8);
  const reward = Math.round(node.current_award / 1e8);
  const providers = node.bond_providers?.providers || [];

  const drawer = (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 z-50 h-full w-full sm:w-[520px] bg-gray-100 dark:bg-[#132a3c] shadow-2xl overflow-y-auto scrollbar-custom">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gray-100 dark:bg-[#1e3344] px-5 py-4 flex items-center justify-between border-b border-gray-300 dark:border-gray-700">
          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Node Details</h2>
            <button
              onClick={() => copyToClipboard(address)}
              className="text-xs text-[#28f3b0] hover:underline icon-button bg-transparent p-0 mt-0.5"
              title="Click to copy"
            >
              {address.slice(0, 10)}...{address.slice(-6)}
            </button>
          </div>
          <button
            onClick={onClose}
            className="icon-button text-gray-500 dark:text-gray-300 hover:text-white text-2xl p-1"
          >
            &#x2715;
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Quick action links */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => { onClose(); navigate(`/nodes/report/${address}`); }}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg icon-button border border-gray-600 hover:border-[#28f3b0] hover:text-[#28f3b0] text-gray-300 transition-colors"
            >
              <img src={ReportIcon} alt="Report" className="w-4 h-4 invert dark:invert-0" />
              Node Report
            </button>
            <a
              href={`https://viewblock.io/thorchain/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-600 hover:border-[#28f3b0] hover:text-[#28f3b0] text-gray-300 transition-colors no-underline"
            >
              <img src={ExploreIcon} alt="Explore" className="w-4 h-4 invert dark:invert-0" />
              ViewBlock
            </a>
            <a
              href={`https://thornode.ninerealms.com/thorchain/node/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-600 hover:border-[#28f3b0] hover:text-[#28f3b0] text-gray-300 transition-colors no-underline"
            >
              <img src={ThornodeApiIcon} alt="API" className="w-4 h-4 invert dark:invert-0" />
              THORNode API
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(node.ip_address).then(
                  () => alert("IP address copied!"),
                  () => alert("Failed to copy IP address.")
                );
              }}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg icon-button border border-gray-600 hover:border-[#28f3b0] hover:text-[#28f3b0] text-gray-300 transition-colors"
            >
              <img src={IpAddressIcon} alt="IP" className="w-4 h-4 invert dark:invert-0" />
              {node.ip_address}
            </button>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3">
            <StatPill label="Status" value={node.status} />
            <StatPill label="Version" value={node.version} />
            <StatPill label="Bond" value={`ᚱ${bond.toLocaleString()}`} sub={`$${(bond * runePrice).toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
            <StatPill label="Rewards" value={`ᚱ${reward.toLocaleString()}`} sub={`$${(reward * runePrice).toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
            <StatPill label="Slashes" value={node.slash_points?.toLocaleString() || "0"} />
            <StatPill label="Age" value={`${node.age?.toFixed(1) || 0} days`} />
            <StatPill label="ISP" value={node.isp || "-"} />
            <StatPill label="Location" value={node.location || node.country_code || "-"} />
            {node.apy && <StatPill label="APY" value={node.apy} />}
            {node.score && <StatPill label="Score" value={node.score} />}
          </div>

          {/* Bond Providers */}
          {providers.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">
                Bond Providers ({providers.length})
              </h3>
              <div className="space-y-1">
                {providers.map((bp, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs bg-white/5 dark:bg-white/5 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(bp.bond_address)}
                        className="text-[#28f3b0] hover:underline icon-button bg-transparent p-0 text-xs"
                        title="Copy address"
                      >
                        {bp.bond_address?.slice(-8)}
                      </button>
                      <button
                        onClick={() => {
                          onClose();
                          navigate(`/bp-report?node=${address}&bp=${bp.bond_address}`);
                        }}
                        className="icon-button bg-transparent p-0 text-[10px] text-gray-400 hover:text-[#28f3b0] border border-gray-600 hover:border-[#28f3b0] px-1.5 py-0.5 rounded"
                        title="Generate BP Report"
                      >
                        BP Report
                      </button>
                    </div>
                    <span className="text-gray-600 dark:text-gray-300">
                      ᚱ{Math.round(bp.bond / 1e8).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bond Chart */}
          <ChartSection
            title="Bond Over Time"
            data={bondData}
            isLoading={bondLoading}
            isDark={isDark}
            renderChart={(d) => (
              <ModernLineChart
                data={d}
                title=""
                xAxisKey="blockHeight"
                yAxisLabel="Bond"
                lines={[{ dataKey: "bondValue", name: "Bond", strokeColor: "#28F3B0", gradientStartColor: "#28F3B0" }]}
                isDark={isDark}
              />
            )}
          />

          {/* Rewards Chart */}
          <ChartSection
            title="Rewards Over Time"
            data={rewardsData}
            isLoading={rewardsLoading}
            isDark={isDark}
            renderChart={(d) => (
              <ModernLineChart
                data={d}
                title=""
                xAxisKey="blockHeight"
                yAxisLabel="Rewards"
                lines={[{ dataKey: "rewardsValue", name: "Rewards", strokeColor: "#C45985", gradientStartColor: "#C45985" }]}
                isDark={isDark}
              />
            )}
          />

          {/* Position Chart */}
          <ChartSection
            title="Position Over Time"
            data={positionData}
            isLoading={positionLoading}
            isDark={isDark}
            renderChart={(d) => (
              <ModernScatterChart
                data={d}
                title=""
                xAxisKey="blockHeight"
                yAxisKey="position"
                scatterPoints={[
                  { dataKey: "position", name: "Position", fillColor: "#FFAE4C" },
                  { dataKey: "maxPosition", name: "Max Position", fillColor: "#8884d8" },
                ]}
                xAxisLabel="Block Height"
                yAxisLabel="Position"
                isDark={isDark}
              />
            )}
          />

          {/* Slashes Chart */}
          <ChartSection
            title="Slashes Over Time"
            data={slashesData}
            isLoading={slashesLoading}
            isDark={isDark}
            renderChart={(d) => (
              <ModernLineChart
                data={d}
                title=""
                xAxisKey="blockHeight"
                yAxisLabel="Slashes"
                lines={[{ dataKey: "slashesValue", name: "Slashes", strokeColor: "#FF5733", gradientStartColor: "#FF5733" }]}
                isDark={isDark}
              />
            )}
          />
        </div>
      </div>
    </>
  );

  return createPortal(drawer, document.getElementById("popover-root"));
};

export default NodeDrawer;
