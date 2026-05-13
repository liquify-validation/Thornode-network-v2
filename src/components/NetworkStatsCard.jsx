import React from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import ModernDivider from "./ModernDivider";

const NetworkStatsCard = ({ title, stats, chartData }) => {
  return (
    <div className="rounded-xl border border-slate-200/90 bg-white pt-4 text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.08)] w-full h-80 flex flex-col dark:border-white/10 dark:bg-white/10 dark:text-white dark:shadow-[0_4px_6px_rgba(0,0,0,0.3)]">
      <h2 className="ml-4 mb-2 text-lg font-semibold text-slate-700 dark:text-white">
        {title}
      </h2>
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
              <span className="text-md font-medium text-slate-600 dark:text-slate-200">
                {stat.subtitle}:
              </span>
            </div>
            <div className="ml-2 text-md font-bold text-emerald-500 dark:text-[#28F3B0CC]">
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
