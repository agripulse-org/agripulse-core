import apiClient from "@/services/apiClient";
import type { CreateAnalysisRequest, SoilAnalysis } from "./models";

export const findAllByProfileId = async (soilProfileId: string): Promise<SoilAnalysis[]> => {
  return await apiClient.get(`/api/soil-profiles/${soilProfileId}/analyses`).json<SoilAnalysis[]>();
};

export const getById = async (soilProfileId: string, analysisId: string): Promise<SoilAnalysis> => {
  return await apiClient
    .get(`/api/soil-profiles/${soilProfileId}/analyses/${analysisId}`)
    .json<SoilAnalysis>();
};

export const createAnalysis = async (
  soilProfileId: string,
  request: CreateAnalysisRequest,
): Promise<SoilAnalysis> => {
  return await apiClient
    .post(`/api/soil-profiles/${soilProfileId}/analyses`, { json: request })
    .json<SoilAnalysis>();
};

export const uploadCSV = async (soilProfileId: string, file: File): Promise<SoilAnalysis[]> => {
  const formData = new FormData();
  formData.append("file", file);
  return await apiClient
    .post(`/api/soil-profiles/${soilProfileId}/analyses/upload`, { body: formData })
    .json<SoilAnalysis[]>();
};

export const deleteById = async (soilProfileId: string, analysisId: string) => {
  await apiClient.delete(`/api/soil-profiles/${soilProfileId}/analyses/${analysisId}`);
};

export const exportAnalysisPDF = async (soilProfileId: string, analysisId: string) => {
  return await apiClient
    .get<Blob>(`/api/soil-profiles/${soilProfileId}/analyses/${analysisId}/export`)
    .blob();
};
