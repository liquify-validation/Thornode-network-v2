import React from "react";
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

const ModernLineChart = ({
  data,
  title,
  /**
   * For single-line usage:
   */
  lineColor = "#8884d8",
  gradientStartColor,
  yAxisKey = "bondValue",
  /**
   * For multi-line usage:
   * If provided, overrides single-line props.
   */
  lines,
  xAxisKey = "blockHeight",
  xAxisLabel,
  yAxisLabel,
  yAxisMax,
}) => {
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

  const sanitize = (val) => String(val || "").replace(/\s+/g, "");

  return (
    <Box className="chart-card pt-8 pb-10 px-12">
      <h2 className="font-semibold text-md ml-8">{title}</h2>
      <ModernDivider />

      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 20, left: 20, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={xAxisKey}
            label={{
              value: xAxisLabel || xAxisKey,
              position: "insideBottomRight",
              offset: -10,
              fill: "#fff",
              fontSize: 14,
            }}
            tick={{ fill: "#fff", fontSize: 11 }}
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
              fill: "#fff",
              fontSize: 14,
            }}
            tick={{ fill: "#fff", fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#333333",
              borderRadius: "6px",
              border: "1px solid #555",
            }}
            itemStyle={{ color: "#ffffff" }}
            labelStyle={{ color: "#ffffff", fontWeight: "bold" }}
            cursor={{ stroke: "#8884d8", strokeWidth: 2 }}
          />
          ;
          <Legend />
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
                    <stop offset="70%" stopColor="#C1DBFB" stopOpacity={0.1} />
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
