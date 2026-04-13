/* eslint-disable react/prop-types */
function Tabs({ items = [], value, onChange }) {
  return (
    <div className="flex flex-wrap">
      {items.map((item, index) => {
        const isActive = value === item.value;
        const isFirst = index === 0;
        const isLast = index === items.length - 1;

        return (
          <button
            key={item.value ?? item.label}
            type="button"
            onClick={() => onChange?.(item.value)}
            className={`px-4 py-2 border-transparent hover:border-transparent focus:border-transparent focus:ring-0 focus-visible:ring-0 ${
              isFirst ? "rounded-l-xl" : "rounded-l-none"
            } ${isLast ? "rounded-r-xl" : "rounded-r-none"} ${
              isActive
                ? "bg-gray-800 dark:bg-[#28f3b0] text-gray-50 dark:text-gray-800 shadow-none outline-none ring-0"
                : "inner-glass-effect text-gray-800 dark:text-gray-50 shadow-none outline-none ring-0"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
