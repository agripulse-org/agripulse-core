export type SoilAnalysis = {
  id: string;
  soilProfileId: string;
  createdAt: string;
  updatedAt: string;
  soilDepth: AnalysisSoilDepth;
  status: string;
  ph: number | null;
  nitrogen: number | null;
  cec: number | null;
  organicCarbon: number | null;
  sandContent: number | null;
  siltContent: number | null;
  clayContent: number | null;
  bulkDensity: number | null;
  coarseFragments: number | null;
  plantAvailableWater: number | null;
  temperatureAvgC: number | null;
  temperatureMinC: number | null;
  temperatureMaxC: number | null;
  avgHumidityPercent: number | null;
  totalPrecipitationMm: number | null;
  cropRecommendations: AnalysisCropRecommendation[] | null;
};

export type AnalysisSoilDepth = "DEPTH_0_5" | "DEPTH_5_15" | "DEPTH_15_30" | "DEPTH_30_60";

export type AnalysisCropRecommendation = {
  crop: string;
  recommendationScore: number;
};

export type CreateAnalysisRequest = {
  soilDepth: AnalysisSoilDepth;
};
