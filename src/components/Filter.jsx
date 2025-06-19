import React, { useState } from "react";
import Box from "../ui/Box";
import ModernDivider from "./ModernDivider";

const Filter = ({ allColumns, initialHidden = [], onSave, onClose }) => {
  const [columnVisibility, setColumnVisibility] = useState(() =>
    allColumns.reduce((acc, col) => {
      const visible =
        !initialHidden.includes(col.id) && col.isVisible !== false;
      acc[col.id] = visible;
      return acc;
    }, {})
  );

  const toggle = (id) =>
    setColumnVisibility((vis) => ({ ...vis, [id]: !vis[id] }));

  const handleSave = () => {
    allColumns.forEach((col) => {
      const shouldBeVisible = columnVisibility[col.id];
      col.toggleHidden?.(!shouldBeVisible);
    });

    if (onSave) {
      const newHidden = Object.entries(columnVisibility)
        .filter(([, visible]) => !visible)
        .map(([id]) => id);
      onSave(newHidden);
    }

    onClose?.();
  };

  const filteredColumns = allColumns.filter((c) => !c.icons);

  return (
    <Box className="chart-card pt-8 pb-4 ">
      <h2 className="font-semibold text-md mb-2 ml-8">Filter Nodes</h2>
      <ModernDivider />

      <div className="mt-6 grid grid-cols-2 gap-4 ml-8">
        {filteredColumns.map((col) => (
          <label key={col.id} className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={columnVisibility[col.id] ?? true}
              onChange={() => toggle(col.id)}
              className="form-checkbox h-4 w-4 text-[#28f3b0]"
            />
            <span className="ml-2">{col.Header || col.id}</span>
          </label>
        ))}
      </div>

      <div className="flex justify-end mt-8">
        <button
          className="bg-[#28f3b0] text-gray-700 mr-4 px-4 py-2 rounded hover:shadow-md focus:outline-none"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </Box>
  );
};

export default Filter;
