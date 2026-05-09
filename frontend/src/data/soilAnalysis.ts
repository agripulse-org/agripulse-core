import { useMutation } from "@tanstack/react-query";
import { exportAnalysisPDF } from "@/services/soil-analysis/soilAnalysisService";

export const useExportAnalysisPDFMutation = () => {
  return useMutation({
    mutationFn: ({ soilProfileId, analysisId }: { soilProfileId: string; analysisId: string }) =>
      exportAnalysisPDF(soilProfileId, analysisId),
  });
};
