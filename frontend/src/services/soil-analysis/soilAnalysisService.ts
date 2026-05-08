import apiClient from "@/services/apiClient";

export interface SoilAnalysisResponse {
  id: string;
  soilProfileId: string;
  createdAt: string;
  updatedAt: string;
  soilDepth: string;
  status: string;
  ph: number;
  nitrogen: number;
  cec: number;
  organicCarbon: number;
  sandContent: number;
  siltContent: number;
  clayContent: number;
  bulkDensity: number;
  coarseFragments: number;
  plantAvailableWater: number;
  temperatureAvgC: number;
  temperatureMinC: number;
  temperatureMaxC: number;
  avgHumidityPercent: number;
  totalPrecipitationMm: number;
}

export const getAnalysisById = async (analysisId: string) => {
  return await apiClient.get<SoilAnalysisResponse>(`api/analyses/${analysisId}`).json();
};