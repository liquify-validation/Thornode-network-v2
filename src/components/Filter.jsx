import React, { useState } from "react";
import Box from "../ui/Box";
import ModernDivider from "./ModernDivider";

const Filter = ({ allColumns, onClose }) => {
  const initialVisibility = allColumns.reduce((acc, col) => {
    acc[col.id] = col.isVisible !== false;
    return acc;
  }, {});

  const [columnVisibility, setColumnVisibility] = useState(initialVisibility);

  const handleCheckboxChange = (colId) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [colId]: !prev[colId],
    }));
  };

  const handleSave = () => {
    allColumns.forEach((col) => {
      const shouldBeVisible = columnVisibility[col.id];
      col.toggleHidden?.(!shouldBeVisible);
    });
    onClose?.();
  };

  const filteredColumns = allColumns?.filter((col) => !col.icons);

  return (
    <Box className="chart-card pt-8 pb-4 ">
      <h2 className="font-semibold text-md mb-2 ml-8">Filter Nodes</h2>
      <ModernDivider />

      <div className="mt-6 grid grid-cols-2 gap-4 ml-8">
        {filteredColumns?.map((col) => (
          <label key={col.id} className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={columnVisibility[col.id] ?? true}
              onChange={() => handleCheckboxChange(col.id)}
              className="form-checkbox h-4 w-4 text-[#28f3b0]"
            />
            <span className="ml-2">{col.Header || col.id}</span>
          </label>
        ))}
      </div>

      <div className="flex justify-end mt-8">
        <button
          className="bg-[#28f3b0] text-black mr-4 px-4 py-2 rounded hover:shadow-md focus:outline-none"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </Box>
  );
};

export default Filter;
