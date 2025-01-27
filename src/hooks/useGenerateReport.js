import { useMutation } from "@tanstack/react-query";
import { generateReport } from "../services/apiService";

function processReportData(rawReport) {
  const newReport = { ...rawReport };

  if (newReport.graphData) {
    if (Array.isArray(newReport.graphData.bond)) {
      newReport.graphData.bond = newReport.graphData.bond.map((bondValue) =>
        Math.round(bondValue / 1e8)
      );
    }

    if (Array.isArray(newReport.graphData.rewards)) {
      newReport.graphData.rewards = newReport.graphData.rewards.map(
        (rewardValue) => Math.round(rewardValue / 1e8)
      );
    }
  }

  return newReport;
}

export function useGenerateReport() {
  return useMutation({
    mutationFn: async (payload) => {
      const rawReport = await generateReport(payload);

      const processedReport = processReportData(rawReport);

      return processedReport;
    },
  });
}
