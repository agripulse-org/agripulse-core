import { useMutation, useQuery, queryOptions } from "@tanstack/react-query";
import { soilAnalysisService } from "@/services/soil-analysis";

export const getSoilAnalysesQueryOptions = (soilProfileId: string) =>
  queryOptions({
    queryKey: ["soil-analyses", soilProfileId],
    queryFn: () => soilAnalysisService.findAllByProfileId(soilProfileId),
  });

export const useSoilAnalyses = (soilProfileId: string) =>
  useQuery(getSoilAnalysesQueryOptions(soilProfileId));

export const useExportAnalysisPDFMutation = () => {
  return useMutation({
    mutationFn: ({ soilProfileId, analysisId }: { soilProfileId: string; analysisId: string }) =>
      soilAnalysisService.exportAnalysisPDF(soilProfileId, analysisId),
  });
};
