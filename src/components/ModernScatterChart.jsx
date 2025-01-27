import React from "react";
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
}) => {
  // Conditionally set colors based on isDark
  const axisColor = isDark ? "#ffffff" : "#374151"; // gray-700 => #374151
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
    <Box className="chart-card pt-8 pb-10 px-12">
      <h2 className="font-semibold text-md ml-8">{title}</h2>
      <ModernDivider />

      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart
          margin={{ top: 10, right: 20, left: 20, bottom: 30 }}
          data={data}
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
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ModernScatterChart;
