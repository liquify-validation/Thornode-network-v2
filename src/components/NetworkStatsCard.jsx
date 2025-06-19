import React from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import ModernDivider from "./ModernDivider";

const NetworkStatsCard = ({ title, stats, chartData }) => {
  return (
    <div className="glass-effect shadow rounded-xl pt-4 w-full h-80 flex flex-col">
      <h2 className="text-lg font-medium mb-2 ml-4">{title}</h2>
      <ModernDivider mt="mt-2" mb="mb-8" ml="ml-4" />

      <div className="flex-1 overflow-y-auto text-right mx-6 scrollbar-custom">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="grid grid-cols-[_auto_1fr] gap-2 items-center mb-2"
          >
            <div className="flex items-center">
              {stat.icon && (
                <img src={stat.icon} alt="" className="w-6 h-6 mr-2" />
              )}
              <span className="text-md font-medium">{stat.subtitle}:</span>
            </div>
            <div className="ml-2 text-md font-bold text-[#28F3B0CC]">
              <span>{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      {chartData && chartData.length > 0 && (
        <div className="mt-auto px-4 mb-2" style={{ height: "80px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <defs>
                <filter
                  id="shadow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feDropShadow
                    dx="0"
                    dy="0"
                    stdDeviation="16"
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
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default NetworkStatsCard;
