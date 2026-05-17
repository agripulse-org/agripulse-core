export type SoilTexture =
  | "sand"
  | "loamy_sand"
  | "sandy_loam"
  | "loam"
  | "silt_loam"
  | "silt"
  | "sandy_clay_loam"
  | "clay_loam"
  | "silty_clay_loam"
  | "sandy_clay"
  | "silty_clay"
  | "clay";

export type SoilAnalysis = {
  id: string;
  soilProfileId: string;
  createdAt: string;
  updatedAt: string;
  soilDepth: AnalysisSoilDepth;
  soilTexture: SoilTexture | null;
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
  confidencePercentage: number;
};

export type CreateAnalysisRequest = {
  soilDepth: AnalysisSoilDepth;
};
