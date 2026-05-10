import apiClient from "@/services/apiClient";
import type { SoilAnalysis } from "./models";

export const findAllByProfileId = async (soilProfileId: string): Promise<SoilAnalysis[]> => {
  return await apiClient.get(`/api/soil-profiles/${soilProfileId}/analyses`).json<SoilAnalysis[]>();
};

export const exportAnalysisPDF = async (soilProfileId: string, analysisId: string) => {
  return await apiClient
    .get<Blob>(`/api/soil-profiles/${soilProfileId}/analyses/${analysisId}/export`)
    .blob();
};
