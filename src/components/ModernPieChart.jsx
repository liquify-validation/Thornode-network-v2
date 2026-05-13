import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Sector,
} from "recharts";
import Box from "../ui/Box";
import ModernDivider from "./ModernDivider";

const ModernPieChart = ({
  data,
  title,
  subtitle,
  centerValue,
  centerValueMode,
  legendPosition = "right",
  showValueInLegend = false,
  useIconsInLegend = false,
  iconMap = {},
  tooltipStyle = {},
  disclaimerText,
  chartHeight = 340,
  legendColumns,
  legendMaxHeight,
  contentClassName = "",
}) => {
  const COLORS = [
    "#183E5A",
    "#354B79",
    "#62528D",
    "#965592",
    "#C45985",
    "#E7676E",
    "#EE8351",
    "#F3AA3B",
    "#3A856E",
    "#5A9782",
    "#79A897",
    "#96BBAC",
    "#B4CCC2",
    "#D2DFDA",
  ];

  const safeData = Array.isArray(data) ? data : [];

  const sumOfValues = safeData.reduce(
    (acc, item) => acc + (item.value || 0),
    0
  );
  const countOfEntries = safeData.length;

  const resolvedCenterValue = React.useMemo(() => {
    if (typeof centerValue === "number" || typeof centerValue === "string") {
      return centerValue;
    }
    if (centerValueMode === "count") {
      return countOfEntries;
    }
    if (centerValueMode === "sum") {
      return sumOfValues;
    }
    return sumOfValues;
  }, [centerValue, centerValueMode, sumOfValues, countOfEntries]);

  const [activeIndex, setActiveIndex] = React.useState(undefined);
  const onPieEnter = (_, index) => setActiveIndex(index);
  const onPieLeave = () => setActiveIndex(undefined);
  const onLegendClick = (index) => {
    setActiveIndex(index === activeIndex ? undefined : index);
  };
  const resolvedLegendColumns =
    legendColumns ?? (safeData.length > 16 ? 2 : safeData.length > 8 ? 2 : 1);
  const isLegendOnRight = legendPosition === "right";

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
      props;
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 20}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  const renderCustomLegend = () => {
    return (
      <ul
        className="m-0 grid list-none gap-x-4 gap-y-2 p-0 text-xs text-slate-600 dark:text-slate-200"
        style={{
          gridTemplateColumns: `repeat(${resolvedLegendColumns}, minmax(0, 1fr))`,
        }}
      >
        {safeData.map((entry, index) => {
          const isActive = activeIndex === index;
          const labelText = showValueInLegend
            ? `${entry.name} (${entry.value})`
            : entry.name;

          const iconSrc = iconMap[entry.name] || null;

          return (
            <li
              key={`legend-item-${index}`}
              onClick={() => onLegendClick(index)}
              className="mb-0 flex cursor-pointer items-start"
            >
              {useIconsInLegend && iconSrc ? (
                <img
                  src={iconSrc}
                  alt={`${entry.name} icon`}
                  title={entry.name}
                  style={{
                    width: 20,
                    height: 20,
                    marginRight: 8,
                    border: isActive
                      ? "2px solid white"
                      : "2px solid transparent",
                    borderRadius: "50%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <span
                  style={{
                    display: "inline-block",
                    backgroundColor: COLORS[index % COLORS.length],
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    marginRight: 8,
                    marginTop: 3,
                    border: isActive
                      ? "2px solid white"
                      : "2px solid transparent",
                  }}
                />
              )}

              {useIconsInLegend ? (
                <span style={{ display: "none" }}>{labelText}</span>
              ) : (
                <span className="break-words leading-5">{labelText}</span>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  const renderPieChart = () => (
    <PieChart>
      <Pie
        data={safeData}
        cx="50%"
        cy="50%"
        innerRadius="60%"
        outerRadius="90%"
        paddingAngle={2}
        dataKey="value"
        onMouseEnter={onPieEnter}
        onMouseLeave={onPieLeave}
        activeIndex={activeIndex}
        activeShape={activeIndex !== undefined ? renderActiveShape : undefined}
        nameKey="name"
        isAnimationActive={false}
      >
        {safeData.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={COLORS[index % COLORS.length]}
            stroke="none"
            style={{ outline: "none" }}
          />
        ))}
      </Pie>

      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
        <tspan
          x="50%"
          fontSize="42"
          fontWeight="bold"
          className="fill-gray-700 dark:fill-white"
        >
          {resolvedCenterValue}
        </tspan>
        <tspan
          x="50%"
          dy="2.5em"
          fontSize="14"
          fontWeight="bold"
          className="fill-gray-700 dark:fill-white"
        >
          {subtitle}
        </tspan>
      </text>

      <Tooltip
        contentStyle={{
          backgroundColor: "#333",
          borderRadius: "8px",
          border: "none",
          ...tooltipStyle,
        }}
        itemStyle={{ color: "#fff" }}
      />
    </PieChart>
  );

  return (
    <Box className="chart-card h-full flex flex-col pt-8 pb-16 relative">
      <h2 className="font-semibold text-md ml-8 text-slate-700 dark:text-white">{title}</h2>
      <ModernDivider />

      {isLegendOnRight ? (
        <div
          className={`flex flex-col gap-4 px-4 pb-2 xl:flex-row xl:items-center ${contentClassName}`.trim()}
        >
          <div className="relative min-h-0 xl:min-w-0 xl:flex-[0_0_46%]">
            <ResponsiveContainer width="100%" height={chartHeight}>
              {renderPieChart()}
            </ResponsiveContainer>
          </div>
          <div
            className="min-w-0 px-4 xl:flex-[1_1_54%] xl:pr-6"
            style={{
              maxHeight: legendMaxHeight ?? chartHeight,
              overflowY: legendMaxHeight ? "auto" : "visible",
            }}
          >
            {renderCustomLegend()}
          </div>
        </div>
      ) : (
        <div className={`flex flex-col px-4 pb-2 ${contentClassName}`.trim()}>
          <div className="relative w-full">
            <ResponsiveContainer width="100%" height={chartHeight}>
              {renderPieChart()}
            </ResponsiveContainer>
          </div>
          <div
            className="mt-4 px-4"
            style={{
              maxHeight: legendMaxHeight,
              overflowY: legendMaxHeight ? "auto" : "visible",
            }}
          >
            {renderCustomLegend()}
          </div>
        </div>
      )}

      {disclaimerText && (
        <div
          style={{
            position: "absolute",
            bottom: "8px",
            right: "20px",
            fontSize: "0.8rem",
            color: "#aaa",
          }}
        >
          * {disclaimerText}
        </div>
      )}
    </Box>
  );
};

export default ModernPieChart;
