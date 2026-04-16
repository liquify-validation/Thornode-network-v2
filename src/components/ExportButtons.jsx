/* eslint-disable react/prop-types */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { LiquifyLogoLight } from "../assets";
import { REPORT_DISCLAIMER } from "./ReportDisclaimer";

const defaultColumns = [
  { header: "Date", dataKey: "date" },
  { header: "Height", dataKey: "height" },
  {
    header: "BP Bond",
    dataKey: "bpBond",
    format: (value) => Number(value).toFixed(2),
  },
  {
    header: "BP Ratio (%)",
    dataKey: "bpRatio",
    format: (value) => Number(value).toFixed(2),
  },
  {
    header: "BP Reward (RUNE)",
    dataKey: "bpReward",
    format: (value) => Number(value).toFixed(4),
  },
  {
    header: "Reward ($)",
    dataKey: "bpRewardDollar",
    format: (value) => Number(value).toFixed(4),
    pdfFormat: (value) => `$${Number(value).toFixed(4)}`,
  },
];

function formatCell(row, column, target = "csv") {
  const value =
    typeof column.accessor === "function"
      ? column.accessor(row)
      : row[column.dataKey];
  const formatter =
    target === "pdf" && column.pdfFormat ? column.pdfFormat : column.format;
  const formatted = formatter ? formatter(value, row) : value;
  return formatted == null ? "" : String(formatted);
}

function loadImageAsDataUrl(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    image.onerror = reject;
    image.src = src;
  });
}

function addPdfFooter(doc, logoDataUrl) {
  const pageCount = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const footerY = pageHeight - 48;

  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    doc.setDrawColor(220, 224, 230);
    doc.line(40, footerY - 12, pageWidth - 40, footerY - 12);

    if (logoDataUrl) {
      doc.addImage(logoDataUrl, "PNG", 40, footerY, 72, 20);
    } else {
      doc.setTextColor(17, 24, 39);
      doc.setFontSize(10);
      doc.text("Liquify", 40, footerY + 12);
    }

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(7);
    const disclaimerLines = doc.splitTextToSize(
      REPORT_DISCLAIMER,
      pageWidth - 170,
    );
    doc.text(disclaimerLines, 130, footerY + 4);
  }
}

const ExportButtons = ({
  getTableRows,
  fileName,
  columns = defaultColumns,
  reportTitle = "Report",
}) => {
  const handleExportCSV = () => {
    const rows = getTableRows();
    if (!rows.length) return;

    const headers = columns.map((column) => column.header);

    const csvRows = rows.map((row) => {
      return columns
        .map((column) => {
          const value = formatCell(row, column, "csv");
          return value.includes(",")
            ? `"${value.replace(/"/g, '""')}"`
            : value;
        })
        .join(",");
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

  const handleExportPDF = async () => {
    const rows = getTableRows();
    if (!rows.length) return;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
    });

    const logoDataUrl = await loadImageAsDataUrl(LiquifyLogoLight).catch(
      () => null,
    );

    autoTable(doc, {
      head: [columns.map((col) => col.header)],
      body: rows.map((row) =>
        columns.map((column) => formatCell(row, column, "pdf")),
      ),
      startY: 50,
      margin: { bottom: 78 },
    });

    doc.setFontSize(14);
    doc.text(reportTitle, 40, 40);
    addPdfFooter(doc, logoDataUrl);

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
