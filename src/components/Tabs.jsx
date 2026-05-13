/* eslint-disable react/prop-types */
function Tabs({
  items = [],
  value,
  onChange,
  containerClassName = "",
  activeClassName = "",
  inactiveClassName = "",
  buttonClassName = "",
}) {
  return (
    <div className={`flex flex-wrap ${containerClassName}`.trim()}>
      {items.map((item, index) => {
        const isActive = value === item.value;
        const isFirst = index === 0;
        const isLast = index === items.length - 1;

        return (
          <button
            key={item.value ?? item.label}
            type="button"
            onClick={() => onChange?.(item.value)}
            className={`px-4 py-2 border focus:border-transparent focus:ring-0 focus-visible:ring-0 transition-colors duration-200 ${
              isFirst ? "rounded-l-xl" : "rounded-l-none"
            } ${isLast ? "rounded-r-xl" : "rounded-r-none"} ${
              index > 0 ? "-ml-px" : ""
            } ${
              isActive
                ? "border-slate-800 bg-slate-800 text-white shadow-[0_10px_24px_rgba(15,23,42,0.16)] outline-none ring-0 dark:border-[#28f3b0] dark:bg-[#28f3b0] dark:text-gray-800 dark:shadow-none"
                : "inner-glass-effect border-slate-300 text-slate-700 shadow-sm outline-none ring-0 hover:border-slate-400 hover:bg-slate-50 dark:border-white/10 dark:text-gray-50 dark:hover:border-[#28f3b0]/45 dark:hover:bg-white/12"
            } ${isActive ? activeClassName : inactiveClassName} ${buttonClassName}`.trim()}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
