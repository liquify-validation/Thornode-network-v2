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
      <ModernDivider />

      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={data}
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
