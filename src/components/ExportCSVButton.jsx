import React from "react";

function ExportCSVButton({ data = [], filename = "data.csv", iconSrc }) {
  const convertToCSV = (rows) => {
    if (!rows.length) return "";

    const headers = Object.keys(rows[0]);
    const csvLines = [
      headers.join(","),
      ...rows.map((obj) =>
        headers.map((key) => (obj[key] != null ? obj[key] : "")).join(",")
      ),
    ];
    return csvLines.join("\n");
  };

  const handleExportClick = () => {
    const csvString = convertToCSV(data);
    if (!csvString) return;

    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      type="button"
      onClick={handleExportClick}
      className="focus:outline-none"
      title="Export as CSV"
      aria-label="Export data as CSV"
      style={{ cursor: "pointer" }}
    >
      {iconSrc ? (
        <img src={iconSrc} alt="Export CSV" style={{ width: 24, height: 24 }} />
      ) : (
        <span>Export</span>
      )}
    </button>
  );
}

export default ExportCSVButton;
