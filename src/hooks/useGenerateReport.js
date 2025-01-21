import { useMutation } from "@tanstack/react-query";
import { generateReport } from "../services/apiService";

export function useGenerateReport() {
  return useMutation({
    mutationFn: (payload) => generateReport(payload),
  });
}
