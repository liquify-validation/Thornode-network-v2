import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  NodesIcon,
  NetworkIcon,
  AnalyticsIcon,
  MailIcon,
  ArrowIcon,
  ThorIcon,
  LiquifyIcon,
  LeaderboardIcon,
  ReportIcon,
} from "../assets";
import DarkModeToggle from "../components/DarkModeToggle";

const Sidebar = ({ isExpanded, onToggleSidebar, isDark, onToggleTheme, mobileOpen, onCloseMobile }) => {
  const location = useLocation();

  const menuItems = [
    { name: "Thornodes", icon: ThorIcon, path: "/" },
    { name: "Home", icon: HomeIcon, path: "/" },
    { name: "Nodes", icon: NodesIcon, path: "/nodes" },
    { name: "Vaults", icon: NetworkIcon, path: "/vaults" },
    { name: "Pools", icon: AnalyticsIcon, path: "/pools" },
    { name: "Mimir", icon: LeaderboardIcon, path: "/mimir" },
    { name: "Queue", icon: NodesIcon, path: "/queue" },
    { name: "BP Report", icon: ReportIcon, path: "/bp-report" },
  ];

  // Bottom nav items for mobile (subset)
  const mobileNavItems = [
    { name: "Home", icon: HomeIcon, path: "/" },
    { name: "Nodes", icon: NodesIcon, path: "/nodes" },
    { name: "Vaults", icon: NetworkIcon, path: "/vaults" },
    { name: "Pools", icon: AnalyticsIcon, path: "/pools" },
    { name: "More", icon: LeaderboardIcon, path: null },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Desktop sidebar */}
      <nav
        className={`fixed top-[45%] left-6 transform -translate-y-1/2 z-20 flex-col justify-between
            rounded-[15px] bg-slate-700 text-white p-2.5 shadow-2xl
          ${isExpanded ? "w-48" : "w-16"} transition-all duration-300 h-[85%]
          hidden lg:flex`}
      >
        <div className="flex flex-col gap-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-2 p-2 rounded-md hover:bg-slate-600
                  ${isActive ? "bg-slate-600" : ""}`}
              >
                <img
                  src={item.icon}
                  alt={`${item.name} icon`}
                  className="w-6 h-6 transition-transform duration-300 transform hover:scale-110"
                />
                {isExpanded && (
                  <span className="text-sm font-semibold ml-2 text-gray-50">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex flex-col gap-4 mt-60">
          <Link
            to="mailto:contact@liquify.io"
            className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-600"
          >
            <img
              src={MailIcon}
              alt="Contact icon"
              className="w-6 h-6 transition-transform duration-300 transform hover:scale-110"
            />
            {isExpanded && (
              <span className="text-sm font-medium text-gray-50 ml-2">
                Contact
              </span>
            )}
          </Link>

          <button
            onClick={onToggleTheme}
            className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-600 icon-button"
          >
            <DarkModeToggle isDark={isDark} />
            {isExpanded && (
              <span className="text-sm font-medium text-gray-50 ml-2">Theme</span>
            )}
          </button>

          <button
            onClick={onToggleSidebar}
            className="flex items-center gap-2 p-2 bg-transparent rounded-md hover:bg-slate-600 icon-button"
          >
            <img
              src={ArrowIcon}
              alt="Toggle sidebar"
              className={`w-6 h-6 transform ${
                isExpanded ? "rotate-180" : ""
              } transition-transform duration-300`}
            />
            {isExpanded && (
              <span className="text-sm font-medium">
                {isExpanded ? "Collapse" : "Expand"}
              </span>
            )}
          </button>
          <hr className="border-gray-50"></hr>

          <Link
            to="https://www.liquify.io"
            className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-600"
          >
            <img
              src={LiquifyIcon}
              alt="Contact icon"
              className="w-6 h-6 transition-transform duration-300 transform hover:scale-110"
            />
            {isExpanded && (
              <span className="text-sm font-medium text-gray-50 ml-1">
                Built by Liquify
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* Mobile slide-out menu */}
      <nav
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-slate-700 text-white p-4 shadow-2xl
          transform transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:hidden`}
      >
        <div className="flex items-center justify-between mb-6">
          <img src={ThorIcon} alt="THORChain" className="w-8 h-8" />
          <button onClick={onCloseMobile} className="icon-button text-white text-2xl p-1">
            &#x2715;
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 p-3 rounded-md hover:bg-slate-600
                  ${isActive ? "bg-slate-600" : ""}`}
              >
                <img src={item.icon} alt={`${item.name} icon`} className="w-5 h-5" />
                <span className="text-sm font-semibold">{item.name}</span>
              </Link>
            );
          })}
        </div>
        <div className="mt-8 flex flex-col gap-2">
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-3 p-3 rounded-md hover:bg-slate-600 icon-button"
          >
            <DarkModeToggle isDark={isDark} />
            <span className="text-sm font-medium text-gray-50">Theme</span>
          </button>
          <Link
            to="mailto:contact@liquify.io"
            onClick={onCloseMobile}
            className="flex items-center gap-3 p-3 rounded-md hover:bg-slate-600"
          >
            <img src={MailIcon} alt="Contact" className="w-5 h-5" />
            <span className="text-sm font-medium text-gray-50">Contact</span>
          </Link>
        </div>
      </nav>

      {/* Mobile bottom navigation bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-slate-700 shadow-[0_-2px_10px_rgba(0,0,0,0.3)] lg:hidden">
        <div className="flex items-center justify-around py-2">
          {mobileNavItems.map((item) => {
            if (item.path === null) {
              return (
                <button
                  key={item.name}
                  onClick={onCloseMobile ? () => { /* trigger mobile menu open from parent */ document.dispatchEvent(new CustomEvent("toggleMobileMenu")); } : undefined}
                  className="flex flex-col items-center gap-0.5 p-1 icon-button"
                >
                  <img src={item.icon} alt={item.name} className="w-5 h-5" />
                  <span className="text-[10px] text-gray-300">{item.name}</span>
                </button>
              );
            }
            const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 p-1 ${isActive ? "text-[#28f3b0]" : "text-gray-300"}`}
              >
                <img
                  src={item.icon}
                  alt={item.name}
                  className={`w-5 h-5 ${isActive ? "brightness-150" : ""}`}
                />
                <span className="text-[10px]">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
