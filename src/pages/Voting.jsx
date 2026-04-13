/* eslint-disable react/prop-types */
import { useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { InfoPopover, LoadingSpinner, SearchBar, Tabs } from "../components";
import Box from "../ui/Box";
import ModernDivider from "../components/ModernDivider";
import { useMimirData } from "../hooks/useMimirData";
import { useVotingData } from "../hooks/useVotingData";
import { useNodeStatusMap } from "../hooks/useNodeData";
import { HexMapBg } from "../assets";

const STATUS_COLORS = {
  active: "#28F3B0",
  standby: "#F3B33D",
  others: "#3B82F6",
};

const VOTING_FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "in_progress", label: "In Progress" },
  { value: "passed", label: "Passed" },
];

const SUMMARY_LABEL_COLUMN_WIDTH = "220px";
const SUMMARY_COLUMN_GAP = "1.25rem";

function parseMimir(raw) {
  if (!raw) return {};
  if (raw.mimir_data) {
    return typeof raw.mimir_data === "string"
      ? JSON.parse(raw.mimir_data)
      : raw.mimir_data;
  }
  return raw;
}

function prettifyKey(key) {
  return key
    .replace(/-/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)(\d+)/g, "$1 $2")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDisplayValue(value) {
  if (value === null || value === undefined) return "None";
  if (value === "None") return "Not Voted";
  if (typeof value === "number") return value.toLocaleString();
  return String(value);
}

function normalizeVoteValue(value) {
  if (value === null || value === undefined || value === "None") return "None";
  return String(value);
}

function getNodeBucket(status) {
  if (status === "Active") return "active";
  if (status === "Standby" || status === "Ready") return "standby";
  return "others";
}

function getVoteStatus(entry) {
  if (!entry.leadingOption) {
    return {
      key: "in_progress",
      label: "No Votes",
      className: "border-slate-400/30 bg-slate-400/10 text-slate-300",
    };
  }

  if (entry.leadingNormalized === entry.currentValueNormalized) {
    return {
      key: "passed",
      label: "Passed",
      className: "border-[#28f3b0]/45 bg-[#28f3b0]/10 text-[#7EF7D6]",
    };
  }

  return {
    key: "in_progress",
    label: "In Progress",
    className: "border-[#F3D65C]/45 bg-[#F3D65C]/10 text-[#F3D65C]",
  };
}

function SummaryLegend() {
  const items = [
    { label: "Active", color: STATUS_COLORS.active },
    { label: "Standby", color: STATUS_COLORS.standby },
    { label: "Others", color: STATUS_COLORS.others },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-gray-400">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function AxisTicks({ totalNodes }) {
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => ({
    ratio,
    label: Math.round(totalNodes * ratio).toLocaleString(),
  }));

  return (
    <div
      className="mt-4 hidden pr-2 md:block"
      style={{
        paddingLeft: `calc(${SUMMARY_LABEL_COLUMN_WIDTH} + ${SUMMARY_COLUMN_GAP})`,
      }}
    >
      <div className="relative h-6">
        {ticks.map((tick) => (
          <div
            key={`${tick.ratio}-${tick.label}`}
            className="absolute top-0 -translate-x-1/2 text-[11px] text-gray-500"
            style={{ left: `${tick.ratio * 100}%` }}
          >
            {tick.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryChartRow({ entry, totalNodes }) {
  const widthFromCount = (count) =>
    totalNodes > 0
      ? `${Math.max((count / totalNodes) * 100, count > 0 ? 0.9 : 0)}%`
      : "0%";
  const percentageFromCount = (count) =>
    totalNodes > 0 ? ((count / totalNodes) * 100).toFixed(1) : "0.0";

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-5">
      <div
        className="text-xs text-gray-600 dark:text-gray-200 md:text-[13px] md:text-right md:shrink-0"
        style={{ width: SUMMARY_LABEL_COLUMN_WIDTH }}
      >
        {prettifyKey(entry.key)}
      </div>

      <div className="relative min-w-0 flex-1 mt-6">
        <div className="relative h-[14px] rounded-full bg-white/8 border border-white/5 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_0,rgba(255,255,255,0.06)_1px,transparent_1px,transparent_10%)]" />
          <div className="absolute inset-y-0 left-0 flex items-center w-full overflow-hidden rounded-full">
            <InfoPopover
              title="Active"
              text={`${entry.activeVotes.toLocaleString()} votes (${percentageFromCount(entry.activeVotes)}%)`}
              as="div"
              wrapperClassName="h-full shrink-0"
              wrapperStyle={{
                width: widthFromCount(entry.activeVotes),
                backgroundColor: STATUS_COLORS.active,
              }}
            >
              <div className="h-full w-full" />
            </InfoPopover>
            <InfoPopover
              title="Standby"
              text={`${entry.standbyVotes.toLocaleString()} votes (${percentageFromCount(entry.standbyVotes)}%)`}
              as="div"
              wrapperClassName="h-full shrink-0"
              wrapperStyle={{
                width: widthFromCount(entry.standbyVotes),
                backgroundColor: STATUS_COLORS.standby,
              }}
            >
              <div className="h-full w-full" />
            </InfoPopover>
            <InfoPopover
              title="Others"
              text={`${entry.otherVotes.toLocaleString()} votes (${percentageFromCount(entry.otherVotes)}%)`}
              as="div"
              wrapperClassName="h-full shrink-0"
              wrapperStyle={{
                width: widthFromCount(entry.otherVotes),
                backgroundColor: STATUS_COLORS.others,
              }}
            >
              <div className="h-full w-full" />
            </InfoPopover>
          </div>
        </div>

        <div className="mt-1 flex items-center justify-between text-[10px] text-gray-500">
          <span>{entry.totalVotes.toLocaleString()} voted</span>
          <span>{Math.round(entry.participationPct)}%</span>
        </div>
      </div>
    </div>
  );
}

function VotePollLine({ option, totalNodes, currentValueNormalized }) {
  const percentage = totalNodes > 0 ? (option.count / totalNodes) * 100 : 0;
  const isCurrent =
    normalizeVoteValue(option.rawOption) === currentValueNormalized;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3 text-[12px] text-gray-300">
        <div className="flex items-center gap-2 min-w-0">
          <span className="truncate">{option.label}</span>
          {isCurrent && (
            <span className="shrink-0 px-2 py-[3px] rounded-full border border-[#28f3b0]/40 bg-[#28f3b0]/10 text-[#7EF7D6] text-[10px] uppercase tracking-[0.1em]">
              Current
            </span>
          )}
        </div>
        <span className="shrink-0 text-gray-400">
          {option.count}/{totalNodes}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-[11px] rounded-full bg-white/6 border border-white/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#28f3b0] shadow-[0_0_14px_rgba(40,243,176,0.35)]"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <div className="w-10 text-right text-[12px] text-gray-300">
          {percentage.toFixed(0)}%
        </div>
      </div>
    </div>
  );
}

function OverviewRow({ entry, totalNodes }) {
  const voteStatus = getVoteStatus(entry);
  const displayedOptions = entry.breakdown.slice(0, 2);
  const notVotedCount = Math.max(totalNodes - entry.totalVotes, 0);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,300px)_120px_minmax(0,1fr)] gap-6 px-7 py-6 border-t border-white/10 text-center">
      <div className="flex items-center text-sm text-gray-100 min-h-[44px] ml-8 ">
        {prettifyKey(entry.key)}
      </div>

      <div className="xl:pt-1">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full border text-[11px] uppercase tracking-[0.12em] ${voteStatus.className}`}
        >
          {voteStatus.label}
        </span>
      </div>

      <div className="space-y-3 ml-8">
        {displayedOptions.map((option) => (
          <VotePollLine
            key={`${entry.key}-${option.rawOption}`}
            option={option}
            totalNodes={totalNodes}
            currentValueNormalized={entry.currentValueNormalized}
          />
        ))}

        <div className="flex items-center gap-3 text-[12px] text-[#F26F8A]">
          <span className="font-medium">Not Voted:</span>
          <span className="px-2 py-[2px] rounded-full border border-[#F26F8A]/35 bg-[#F26F8A]/10">
            {notVotedCount}
          </span>
        </div>
      </div>
    </div>
  );
}

function Voting() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const mimirQuery = useMimirData();
  const votingQuery = useVotingData();
  const nodeStatusQuery = useNodeStatusMap();

  const isLoading =
    mimirQuery.isLoading ||
    votingQuery.isLoading ||
    nodeStatusQuery.isLoading;

  const error =
    mimirQuery.error ||
    votingQuery.error ||
    nodeStatusQuery.error;

  const nodeStatusMap = useMemo(() => {
    return Object.entries(nodeStatusQuery.data || {}).reduce(
      (accumulator, [nodeAddress, status]) => {
        accumulator[nodeAddress] = getNodeBucket(status);
        return accumulator;
      },
      {},
    );
  }, [nodeStatusQuery.data]);

  const entries = useMemo(() => {
    if (!votingQuery.data?.byKey) return [];

    let currentMimir = {};
    try {
      currentMimir = parseMimir(mimirQuery.data);
    } catch {
      currentMimir = {};
    }

    const statusCountsByKey = (votingQuery.data.raw || []).reduce(
      (accumulator, vote) => {
        const key = vote.key;
        const bucket = nodeStatusMap[vote.signer] || "others";

        if (!accumulator[key]) {
          accumulator[key] = {
            active: 0,
            standby: 0,
            others: 0,
          };
        }

        accumulator[key][bucket] += 1;
        return accumulator;
      },
      {},
    );

    return Object.entries(votingQuery.data.byKey)
      .map(([key, tallyMap]) => {
        const breakdown = Object.entries(tallyMap || {})
          .map(([option, count]) => ({
            rawOption: option,
            label: formatDisplayValue(option),
            count: Number(count || 0),
          }))
          .sort((left, right) => right.count - left.count);

        const totalVotes = breakdown.reduce(
          (sum, option) => sum + option.count,
          0,
        );
        const leadingOption = breakdown[0];
        const statusCounts = statusCountsByKey[key] || {
          active: 0,
          standby: 0,
          others: 0,
        };
        const totalNodes = Number(votingQuery.data.totalNodes || 0);
        const currentValueRaw = currentMimir[key];
        const currentValueNormalized = normalizeVoteValue(currentValueRaw);
        const leadingNormalized = normalizeVoteValue(
          leadingOption?.rawOption ?? null,
        );

        return {
          key,
          label: prettifyKey(key),
          currentValueRaw,
          currentValue: formatDisplayValue(currentValueRaw),
          currentValueNormalized,
          totalVotes,
          totalNodes,
          participationPct: totalNodes ? (totalVotes / totalNodes) * 100 : 0,
          leadingOption: leadingOption?.label || null,
          leadingNormalized,
          breakdown,
          activeVotes: statusCounts.active,
          standbyVotes: statusCounts.standby,
          otherVotes: statusCounts.others,
        };
      })
      .sort((left, right) => right.totalVotes - left.totalVotes);
  }, [mimirQuery.data, nodeStatusMap, votingQuery.data]);

  const filteredEntries = useMemo(() => {
    const loweredSearch = searchTerm.trim().toLowerCase();

    return entries.filter((entry) => {
      const statusMatch =
        statusFilter === "all" || getVoteStatus(entry).key === statusFilter;
      const searchMatch =
        !loweredSearch ||
        entry.key.toLowerCase().includes(loweredSearch) ||
        entry.label.toLowerCase().includes(loweredSearch) ||
        entry.currentValue.toLowerCase().includes(loweredSearch);

      return statusMatch && searchMatch;
    });
  }, [entries, searchTerm, statusFilter]);

  const summaryEntries = useMemo(
    () => filteredEntries.slice(0, 12),
    [filteredEntries],
  );

  const totalNodes = Number(votingQuery.data?.totalNodes || 0);

  if (isLoading) {
    return (
      <div className="p-2 mt-12 h-[55vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  }

  return (
    <>
      <Helmet>
        <title>THORChain Network Explorer | Voting</title>
      </Helmet>

      <div className="p-4">
        <div className="mb-7">
          <h1 className="text-2xl text-gray-800 dark:text-white font-bold mb-3">
            Voting
          </h1>
        </div>

        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <Tabs
            items={VOTING_FILTER_OPTIONS}
            value={statusFilter}
            onChange={setStatusFilter}
          />
          <div className="flex justify-end">
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Search mimir votes..."
              className="sm:w-[320px] md:w-[360px] lg:w-[420px] min-w-[240px]"
            />
          </div>
        </div>

        <Box className="relative overflow-hidden rounded-[28px] border border-white/10 pt-5 pb-6 mb-7">
          <img
            src={HexMapBg}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-[0.06] pointer-events-none"
          />

          <div className="relative px-6 md:px-8">
            <div className="text-sm font-medium text-gray-700 dark:text-white">
              Mimir Votes
            </div>
            <ModernDivider mt="mt-3" mb="mb-8" ml="ml-0" />

            <div className="space-y-4 md:space-y-[14px]">
              {summaryEntries.length > 0 ? (
                summaryEntries.map((entry) => (
                  <SummaryChartRow
                    key={entry.key}
                    entry={entry}
                    totalNodes={totalNodes}
                  />
                ))
              ) : (
                <div className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                  No Mimir votes matched the current filters.
                </div>
              )}
            </div>

            {summaryEntries.length > 0 ? (
              <AxisTicks totalNodes={totalNodes} />
            ) : null}

            {summaryEntries.length > 0 ? (
              <div className="mt-6">
                <SummaryLegend />
              </div>
            ) : null}
          </div>
        </Box>

        <Box className="relative overflow-hidden rounded-[28px] border border-white/10 pb-4">
          <img
            src={HexMapBg}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-[0.05] pointer-events-none"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(40,243,176,0.12),transparent_45%)] pointer-events-none" />

          <div className="relative px-6 pt-5 md:px-8">
            <div className="text-sm font-medium text-gray-700 dark:text-white">
              Mimir Voting Overview
            </div>
            <ModernDivider mt="mt-3" mb="mb-4" ml="ml-0" />

            <div className="hidden xl:grid xl:grid-cols-[minmax(0,300px)_120px_minmax(0,1fr)] gap-6 px-7 pb-3 text-[12px] uppercase tracking-[0.16em] text-[#28f3b0] mt-12 text-left">
              <div>Vote</div>
              <div>Result</div>
              <div>Vote Poll</div>
            </div>
          </div>

          <div className="relative">
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry) => (
                <OverviewRow
                  key={entry.key}
                  entry={entry}
                  totalNodes={totalNodes}
                />
              ))
            ) : (
              <div className="px-7 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                No Mimir votes matched the current filters.
              </div>
            )}
          </div>
        </Box>
      </div>
    </>
  );
}

export default Voting;
