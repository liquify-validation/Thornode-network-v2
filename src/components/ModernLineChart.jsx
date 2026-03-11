import React, { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Box from "../ui/Box";
import ModernDivider from "./ModernDivider";
import ExportCSVButton from "./ExportCSVButton";
import { DownloadIcon } from "../assets";

const RANGE_PRESETS = [
  { label: "50", value: 50 },
  { label: "100", value: 100 },
  { label: "250", value: 250 },
  { label: "500", value: 500 },
  { label: "All", value: 0 },
];

const ModernLineChart = ({
  data,
  title,
  lineColor = "#8884d8",
  gradientStartColor,
  yAxisKey = "bondValue",
  lines,
  xAxisKey = "blockHeight",
  xAxisLabel,
  yAxisLabel,
  yAxisMax,
  convertToMillions = false,

  isDark = false,
}) => {
  const [range, setRange] = useState(0);

  const slicedData = useMemo(() => {
    if (!data || data.length === 0) return data;
    if (range === 0 || range >= data.length) return data;
    return data.slice(-range);
  }, [data, range]);

  const axisColor = isDark ? "#ffffff" : "#374151";
  const tooltipBgColor = isDark ? "#333333" : "#fafafa";
  const tooltipBorderColor = isDark ? "#555555" : "#cccccc";
  const textColor = isDark ? "#ffffff" : "#000000";

  const linesToRender = React.useMemo(() => {
    if (Array.isArray(lines) && lines.length > 0) {
      return lines;
    }
    return [
      {
        dataKey: yAxisKey,
        name: yAxisLabel || yAxisKey,
        strokeColor: lineColor,
        gradientStartColor: gradientStartColor || lineColor,
      },
    ];
  }, [lines, yAxisKey, yAxisLabel, lineColor, gradientStartColor]);

  function formatYAxisValue(val) {
    if (!convertToMillions) {
      return val;
    }
    return val / 1_000_000;
  }

  function handleTooltipFormatter(value, name) {
    const rawNum = Number(value || 0);
    if (!convertToMillions) {
      return [rawNum.toFixed(2), name];
    }
    return [(rawNum / 1_000_000).toFixed(2), name];
  }

  const sanitize = (val) => String(val || "").replace(/\s+/g, "");

  return (
    <Box className="chart-card pt-8 pb-10 px-12">
      <h2 className="font-semibold text-md ml-8">{title}</h2>
      <ModernDivider mb={0} />
      <div className="flex items-center justify-between mb-4 pt-0 mx-5">
        {/* Range filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
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
        <ExportCSVButton
          data={slicedData}
          filename={`${title.replace(/\s+/g, "_")}.csv`}
          iconSrc={DownloadIcon}
        />
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={slicedData}
          margin={{ top: 10, right: 20, left: 10, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={axisColor} />

          <XAxis
            dataKey={xAxisKey}
            label={{
              value: xAxisLabel || xAxisKey,
              position: "insideBottomRight",
              offset: -20,
              fill: axisColor,
              fontSize: 14,
              dx: -20,
            }}
            tick={{ fill: axisColor, fontSize: 11 }}
            stroke={axisColor}
          />

          <YAxis
            type="number"
            domain={["auto", "auto"]}
            allowDataOverflow={false}
            tickCount={6}
            label={{
              value: yAxisLabel || yAxisKey,
              angle: -90,
              position: "insideLeft",
              fill: axisColor,
              fontSize: 14,
              dy: 20,
            }}
            tick={{ fill: axisColor, fontSize: 11 }}
            tickFormatter={formatYAxisValue}
            stroke={axisColor}
          />

          <Tooltip
            formatter={handleTooltipFormatter}
            contentStyle={{
              backgroundColor: tooltipBgColor,
              borderRadius: "6px",
              border: `1px solid ${tooltipBorderColor}`,
            }}
            itemStyle={{ color: textColor }}
            labelStyle={{ color: textColor, fontWeight: "bold" }}
            cursor={{ stroke: "#8884d8", strokeWidth: 2 }}
          />

          <Legend
            wrapperStyle={{
              color: axisColor,
            }}
          />

          {linesToRender.map((lineObj, idx) => {
            const gradId = `color_${sanitize(title)}_${sanitize(
              lineObj.dataKey
            )}_${idx}`;
            return (
              <React.Fragment key={gradId}>
                <defs>
                  <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={lineObj.gradientStartColor}
                      stopOpacity={1}
                    />
                    <stop offset="96%" stopColor="#C1DBFB" stopOpacity={0.1} />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <Area
                  name={lineObj.name}
                  type="monotone"
                  dataKey={lineObj.dataKey}
                  stroke={lineObj.strokeColor}
                  fill={`url(#${gradId})`}
                  fillOpacity={1}
                />
              </React.Fragment>
            );
          })}
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ModernLineChart;
