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
    const shouldUseTwoColumns = safeData.length > 12;
    return (
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: shouldUseTwoColumns ? "grid" : "block",
          gridTemplateColumns: shouldUseTwoColumns ? "repeat(2, auto)" : "none",
          columnGap: "16px",
          rowGap: "8px",
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
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                marginBottom: 8,
              }}
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
                    border: isActive
                      ? "2px solid white"
                      : "2px solid transparent",
                  }}
                />
              )}

              {useIconsInLegend ? (
                <span style={{ display: "none" }}>{labelText}</span>
              ) : (
                <span>{labelText}</span>
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
        <tspan x="50%" fontSize="48" fontWeight="bold" fill="#fff">
          {resolvedCenterValue}
        </tspan>
        <tspan x="50%" dy="2.5em" fontSize="14" fontWeight="bold" fill="#fff">
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
    <Box className="chart-card h-full flex flex-col pt-8 pb-16">
      <h2 className="font-semibold text-md ml-8">{title}</h2>
      <ModernDivider />

      {legendPosition === "right" ? (
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <ResponsiveContainer width="100%" height={400}>
              {renderPieChart()}
            </ResponsiveContainer>
          </div>
          <div style={{ paddingRight: 24 }}>{renderCustomLegend()}</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ width: "100%", position: "relative" }}>
            <ResponsiveContainer width="100%" height={400}>
              {renderPieChart()}
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: 16, alignSelf: "center" }}>
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
