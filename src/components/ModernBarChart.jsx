import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Box from "../ui/Box";
import ModernDivider from "./ModernDivider";

function RoundedCursor(props) {
  const { x, y, width, height } = props;

  const r = 5;
  const x1 = x;
  const y1 = y;
  const w = width;
  const h = height;

  return (
    <path
      d={`
        M${x1 + r},${y1}
        H${x1 + w - r}
        A${r},${r} 0 0 1 ${x1 + w},${y1 + r}
        V${y1 + h - r}
        A${r},${r} 0 0 1 ${x1 + w - r},${y1 + h}
        H${x1 + r}
        A${r},${r} 0 0 1 ${x1},${y1 + h - r}
        V${y1 + r}
        A${r},${r} 0 0 1 ${x1 + r},${y1}
        Z
      `}
      fill="#4fdd97"
      fillOpacity={0.15}
      stroke="#4fdd97"
      strokeWidth={2}
    />
  );
}

function getSegmentRadius(rowData, allKeys, thisKey) {
  const nonZeroKeys = allKeys.filter((k) => rowData[k] > 0);

  if (nonZeroKeys.length <= 1) {
    return [5, 5, 5, 5];
  }

  const idx = nonZeroKeys.indexOf(thisKey);
  if (idx === -1) {
    return [0, 0, 0, 0];
  }

  if (idx === 0) {
    return [5, 0, 0, 5];
  }
  if (idx === nonZeroKeys.length - 1) {
    return [0, 5, 5, 0];
  }
  return [0, 0, 0, 0];
}

const ModernBarChart = ({ chartData, keys, maxVotes, title }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || payload.length === 0) {
      return null;
    }
    const rowData = payload[0].payload;

    const relevantSegments = payload.filter((seg) => seg.dataKey !== "missing");

    const totalVotes = keys.reduce((sum, k) => {
      if (k === "missing") return sum;
      return sum + (rowData[k] ?? 0);
    }, 0);
    const missingVotes = maxVotes - totalVotes;

    return (
      <div className="z-[9999] px-4 py-3 bg-gray-800 text-white text-sm rounded-xl shadow-lg text-center">
        <div className="font-semibold mb-2">{rowData.title}</div>

        {relevantSegments.map((seg) => (
          <div className="flex justify-between" key={seg.dataKey}>
            <span>{seg.dataKey}:</span>
            <span>{seg.value}</span>
          </div>
        ))}

        <hr className="my-2 border-gray-600" />

        <div className="flex justify-between">
          <span>Consensus Needed:</span>
          <span>{rowData.consensus}%</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Votes Needed:</span>
          <span>{rowData.votesNeeded}</span>
        </div>

        <hr className="my-2 border-gray-600" />

        <div className="flex justify-between">
          <span>Total Voted:</span>
          <span>{totalVotes}</span>
        </div>
        <div className="flex justify-between">
          <span>Missing Votes:</span>
          <span>{missingVotes}</span>
        </div>
      </div>
    );
  };

  return (
    <Box className="p-6">
      <h2 className="font-semibold text-lg mb-2">{title}</h2>
      <ModernDivider />

      <div style={{ width: "100%", height: 500 }}>
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
            barSize={10}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis type="number" domain={[0, maxVotes]} />
            <YAxis
              dataKey="title"
              type="category"
              width={150}
              tick={{ fill: "#F9FAFB" }}
            />

            <Tooltip content={<CustomTooltip />} cursor={<RoundedCursor />} />

            {keys.map((k, idx) => (
              <Bar
                key={k}
                dataKey={k}
                stackId="votesStack"
                fill={idx === keys.length - 1 ? "#999999" : getColor(idx)}
                radius={(barProps) =>
                  getSegmentRadius(barProps.payload, keys, k)
                }
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Box>
  );
};

function getColor(index) {
  const palette = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#FF6B8A",
    "#8A6BFF",
    "#EEBA00",
  ];
  return palette[index % palette.length];
}

export default ModernBarChart;
