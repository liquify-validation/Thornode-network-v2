/* eslint-disable react/prop-types */
import React, { useState, useMemo } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Box from "../ui/Box";
import ModernDivider from "./ModernDivider";

const RANGE_PRESETS = [
  { label: "50", value: 50 },
  { label: "100", value: 100 },
  { label: "250", value: 250 },
  { label: "500", value: 500 },
  { label: "All", value: 0 },
];

const ModernScatterChart = ({
  data,
  title,
  xAxisKey = "blockHeight",
  yAxisKey = "position",
  scatterPoints,
  xAxisLabel,
  yAxisLabel,
  yAxisMax,
  isDark = false,
  showHeader = true,
  showRangeControls = true,
}) => {
  const [range, setRange] = useState(0);

  const slicedData = useMemo(() => {
    if (!data || data.length === 0) return data;
    if (range === 0 || range >= data.length) return data;
    return data.slice(-range);
  }, [data, range]);

  const axisColor = isDark ? "#ffffff" : "#374151";
  const tooltipBgColor = isDark ? "#333333" : "#f9f9f9";
  const tooltipBorderColor = isDark ? "#555555" : "#ccc";
  const tooltipTextColor = isDark ? "#ffffff" : "#000000";

  const scatterSets = React.useMemo(() => {
    if (Array.isArray(scatterPoints) && scatterPoints.length > 0) {
      return scatterPoints;
    }
    return [
      {
        dataKey: yAxisKey,
        name: yAxisLabel || yAxisKey,
        fillColor: "#FFAE4C",
        shape: "circle",
      },
    ];
  }, [scatterPoints, yAxisKey, yAxisLabel]);

  return (
    <Box className={`chart-card px-12 pb-10 ${showHeader ? "pt-8" : "pt-6"}`}>
      {showHeader && (
        <>
          <h2 className="font-semibold text-md ml-8">{title}</h2>
          <ModernDivider />
        </>
      )}
      {showRangeControls && (
        <div className="flex items-center gap-1.5 flex-wrap mx-5 mb-4">
          {data && data.length > 50 && RANGE_PRESETS.map((p) => (
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
          {data && data.length > 50 && (
            <span className="text-[10px] text-gray-500 ml-1">
              {slicedData?.length || 0}/{data.length}
            </span>
          )}
        </div>
      )}

      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart
          margin={{ top: 10, right: 20, left: 20, bottom: 30 }}
          data={slicedData}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={axisColor} />

          <XAxis
            dataKey={xAxisKey}
            label={{
              value: xAxisLabel || xAxisKey,
              position: "insideBottomRight",
              offset: -10,
              fill: axisColor,
              fontSize: 14,
            }}
            tick={{ fill: axisColor, fontSize: 11 }}
            stroke={axisColor}
          />

          <YAxis
            domain={[0, yAxisMax || "auto"]}
            label={{
              value: yAxisLabel || yAxisKey,
              angle: -90,
              position: "insideLeft",
              fill: axisColor,
              fontSize: 14,
            }}
            tick={{ fill: axisColor, fontSize: 11 }}
            stroke={axisColor}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBgColor,
              borderRadius: "6px",
              border: `1px solid ${tooltipBorderColor}`,
            }}
            itemStyle={{ color: tooltipTextColor }}
            labelStyle={{ color: tooltipTextColor, fontWeight: "bold" }}
          />

          <Legend
            wrapperStyle={{
              color: axisColor,
            }}
          />

          {scatterSets.map((set, idx) => (
            <Scatter
              key={set.dataKey || idx}
              name={set.name}
              dataKey={set.dataKey}
              fill={set.fillColor || "#FFAE4C"}
              shape={set.shape || "circle"}
              isAnimationActive={false}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ModernScatterChart;
