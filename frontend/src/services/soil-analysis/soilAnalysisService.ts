import apiClient from "@/services/apiClient";

export const exportAnalysisPDF = async (soilProfileId: string, analysisId: string) => {
  return await apiClient
    .get<Blob>(`/api/soil-profiles/${soilProfileId}/analyses/${analysisId}/export`)
    .blob();
};
