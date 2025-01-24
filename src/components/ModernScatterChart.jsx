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
  ZAxis,
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
}) => {
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
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey={xAxisKey}
            label={{
              value: xAxisLabel || xAxisKey,
              position: "insideBottomRight",
              offset: -10,
              fill: "fill-gray-700 dark:fill-white",
              fontSize: 14,
            }}
            tick={{ fill: "fill-gray-700 dark:fill-white", fontSize: 11 }}
          />
          <YAxis
            domain={[0, yAxisMax || "auto"]}
            label={{
              value: yAxisLabel || yAxisKey,
              angle: -90,
              position: "insideLeft",
              fill: "fill-gray-700 dark:fill-white",
              fontSize: 14,
            }}
            tick={{ fill: "fill-gray-700 dark:fill-white", fontSize: 11 }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#333333",
              borderRadius: "6px",
              border: "1px solid #555",
            }}
            itemStyle={{ color: "#ffffff" }}
            labelStyle={{ color: "#ffffff", fontWeight: "bold" }}
          />
          <Legend />

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
