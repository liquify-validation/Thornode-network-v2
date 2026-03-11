import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ExportButtons = ({ getTableRows, fileName }) => {
  const handleExportCSV = () => {
    const rows = getTableRows();
    if (!rows.length) return;

    const headers = ["Date", "Height", "BP Bond", "BP Ratio (%)", "BP Reward (RUNE)", "Reward ($)"];

    const csvRows = rows.map((row) => {
      const safeDate = row.date ? `"${row.date}"` : "";
      return [
        safeDate,
        row.height,
        Number(row.bpBond).toFixed(2),
        Number(row.bpRatio).toFixed(2),
        Number(row.bpReward).toFixed(4),
        Number(row.bpRewardDollar).toFixed(4),
      ].join(",");
    });
    const csvString = [headers.join(","), ...csvRows].join("\n");

    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName || "report"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const rows = getTableRows();
    if (!rows.length) return;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
    });

    const columns = [
      { header: "Date", dataKey: "date" },
      { header: "Height", dataKey: "height" },
      { header: "BP Bond", dataKey: "bpBond" },
      { header: "BP Ratio (%)", dataKey: "bpRatio" },
      { header: "BP Reward (RUNE)", dataKey: "bpReward" },
      { header: "Reward ($)", dataKey: "bpRewardDollar" },
    ];

    autoTable(doc, {
      head: [columns.map((col) => col.header)],
      body: rows.map((row) => [
        row.date,
        row.height,
        Number(row.bpBond).toFixed(2),
        Number(row.bpRatio).toFixed(2),
        Number(row.bpReward).toFixed(4),
        `$${Number(row.bpRewardDollar).toFixed(4)}`,
      ]),
      startY: 50,
    });

    doc.setFontSize(14);
    doc.text("Bond Provider Report", 40, 40);

    doc.save(`${fileName || "report"}.pdf`);
  };

  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={handleExportCSV}
        className="bg-gray-900 dark:bg-[#28f3b0] w-full text-gray-50 dark:text-gray-700 px-4 py-2
          rounded-xl"
      >
        Export CSV
      </button>
      <button
        onClick={handleExportPDF}
        className="bg-gray-900 dark:bg-[#28f3b0] w-full text-gray-50 dark:text-gray-700 px-4 py-2
          rounded-xl"
      >
        Export PDF
      </button>
    </div>
  );
};

export default ExportButtons;
