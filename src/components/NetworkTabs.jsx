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
              `px-6 py-2 border-4 border-gray-400 rounded-full font-bold ${
                isActive
                  ? "bg-[#28f3b0] text-gray-800"
                  : "inner-glass-effect text-gray-50"
              }`
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
