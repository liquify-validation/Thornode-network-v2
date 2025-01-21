import React from "react";
import { LineChart, Line } from "recharts";
import ModernDivider from "./ModernDivider";

const NetworkStatsCard = ({ title, stats, chartData }) => {
  return (
    <div className="glass-effect shadow rounded pt-4 w-full h-80 flex flex-col">
      <h2 className="text-lg font-semibold mb-2 ml-6">{title}</h2>
      <ModernDivider />

      <div className="flex-1 overflow-y-auto text-right mx-8 scrollbar-custom">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="grid grid-cols-[_auto_1fr] gap-2 items-center mb-2 "
          >
            <div className="flex items-center">
              {stat.icon && (
                <img src={stat.icon} alt="" className="w-6 h-6 mr-2" />
              )}
              <span className="text-md font-semibold">{stat.subtitle}:</span>
            </div>
            <div className="ml-2 text-md font-bold text-[#28F3B0CC]">
              <span>{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      {chartData && chartData.length > 0 && (
        <div className="mt-auto mx-auto mb-2">
          <LineChart width={600} height={50} data={chartData}>
            <defs>
              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow
                  dx="1"
                  dy="5"
                  stdDeviation="4"
                  floodColor="#28F3B0CC"
                />
              </filter>
            </defs>
            <Line
              type="monotone"
              dataKey="value"
              stroke="#28F3B0CC"
              strokeWidth={2}
              dot={false}
              filter="url(#shadow)"
            />
          </LineChart>
        </div>
      )}
    </div>
  );
};

export default NetworkStatsCard;
