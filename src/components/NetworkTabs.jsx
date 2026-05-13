import { NavLink } from "react-router-dom";

const tabs = [
  { name: "STATS", path: "/network/overview" },
  { name: "CONFIG", path: "/network/config" },
  { name: "CHURNS", path: "/network/churns" },
  { name: "VAULTS", path: "/network/vaults" },
  { name: "RUNEPOOL", path: "/network/runepool" },
  { name: "SWAPS", path: "/network/swaps" },
  { name: "VOTING", path: "/network/voting" },
];

const NetworkTabs = () => {
  return (
    <div className="px-4 pt-6 pb-3">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="text-left">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Network
          </h1>
        </div>

        <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <NavLink
            key={tab.name}
            to={tab.path}
            className={({ isActive }) =>
              `rounded-full border px-6 py-2 text-sm font-bold tracking-[0.08em] transition-colors duration-200 ${
                isActive
                  ? "bg-[#28f3b0] text-slate-900"
                  : "border-slate-200/95 bg-white text-slate-600 shadow-[0_8px_20px_rgba(15,23,42,0.06)] hover:border-slate-400 hover:bg-slate-50 hover:text-slate-800 dark:border-white/10 dark:bg-white/10 dark:text-gray-50 dark:shadow-[0_4px_6px_rgba(0,0,0,0.3)] dark:hover:border-[#28f3b0]/45 dark:hover:text-white"
              }`
            }
            style={({ isActive }) =>
              isActive
                ? {
                    border: "1px solid #28f3b0",
                    boxShadow: "0 10px 24px rgba(40, 243, 176, 0.22)",
                  }
                : undefined
            }
          >
            {tab.name}
          </NavLink>
        ))}
        </div>
      </div>
    </div>
  );
};

export default NetworkTabs;
