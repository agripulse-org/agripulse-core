import { useMutation, useQuery, useQueryClient, queryOptions } from "@tanstack/react-query";
import { soilAnalysisService } from "@/services/soil-analysis";

export const getSoilAnalysesQueryOptions = (soilProfileId: string) =>
  queryOptions({
    queryKey: ["soil-analyses", soilProfileId],
    queryFn: () => soilAnalysisService.findAllByProfileId(soilProfileId),
  });

export const getSoilAnalysisQueryOptions = (soilProfileId: string, analysisId: string) =>
  queryOptions({
    queryKey: ["soil-analyses", soilProfileId, analysisId],
    queryFn: () => soilAnalysisService.getById(soilProfileId, analysisId),
    refetchInterval: (query) => (query.state.data?.status === "PENDING" ? 30_000 : false),
  });

export const useSoilAnalyses = (soilProfileId: string) =>
  useQuery(getSoilAnalysesQueryOptions(soilProfileId));

export const useDeleteSoilAnalysis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ soilProfileId, analysisId }: { soilProfileId: string; analysisId: string }) =>
      soilAnalysisService.deleteById(soilProfileId, analysisId),
    onSuccess: (_data, { soilProfileId }) => {
      queryClient.invalidateQueries({ queryKey: ["soil-analyses", soilProfileId] });
    },
  });
};

export const useExportAnalysisPDFMutation = () => {
  return useMutation({
    mutationFn: ({ soilProfileId, analysisId }: { soilProfileId: string; analysisId: string }) =>
      soilAnalysisService.exportAnalysisPDF(soilProfileId, analysisId),
  });
};
