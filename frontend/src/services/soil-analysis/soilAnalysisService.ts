import apiClient from "@/services/apiClient";
import type { SoilAnalysis } from "./models";

export const findAllByProfileId = async (soilProfileId: string): Promise<SoilAnalysis[]> => {
  return await apiClient.get(`/api/soil-profiles/${soilProfileId}/analyses`).json<SoilAnalysis[]>();
};

export const getById = async (soilProfileId: string, analysisId: string): Promise<SoilAnalysis> => {
  return await apiClient
    .get(`/api/soil-profiles/${soilProfileId}/analyses/${analysisId}`)
    .json<SoilAnalysis>();
};

export const deleteById = async (soilProfileId: string, analysisId: string) => {
  await apiClient.delete(`/api/soil-profiles/${soilProfileId}/analyses/${analysisId}`);
};

export const exportAnalysisPDF = async (soilProfileId: string, analysisId: string) => {
  return await apiClient
    .get<Blob>(`/api/soil-profiles/${soilProfileId}/analyses/${analysisId}/export`)
    .blob();
};
