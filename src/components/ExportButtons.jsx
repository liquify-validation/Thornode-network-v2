import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ExportButtons = ({ getTableRows, fileName }) => {
  const handleExportCSV = () => {
    const rows = getTableRows();
    if (!rows.length) return;

    const headers = ["Height", "Date", "Price", "Reward (RUNE)", "Reward ($)"];

    const csvRows = rows.map((row) => {
      const safeDate = new Date(row.date).toISOString().split("T")[0];
      const isoDate = `"${safeDate}"`;
      return [
        row.height,
        isoDate,
        row.price,
        row.rewardRune,
        row.rewardUSD,
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
      { header: "Height", dataKey: "height" },
      { header: "Date", dataKey: "date" },
      { header: "Price", dataKey: "price" },
      { header: "Reward (RUNE)", dataKey: "rewardRune" },
      { header: "Reward ($)", dataKey: "rewardUSD" },
    ];

    autoTable(doc, {
      head: [columns.map((col) => col.header)],
      body: rows.map((row) => [
        row.height,
        row.date,
        row.price,
        row.rewardRune,
        row.rewardUSD,
      ]),
      startY: 50,
    });

    doc.setFontSize(14);
    doc.text(`Report`, 40, 40);

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
