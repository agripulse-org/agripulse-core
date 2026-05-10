export type DashboardResponse = {
  totalAnalysesCount: number;
  soilsTrackedCount: number;
  avgCompatibility: number;
  analyses: DashboardAnalysis[];
};

export type DashboardAnalysis = {
  id: string;
  soilProfile: {
    id: string;
    city: string | null;
    country: string | null;
  };
  createdAt: string;
  soilDepth: string;
  recommendations: DashboardCropRecommendation[] | null;
};

export type DashboardCropRecommendation = {
  crop: string;
  recommendationScore: number;
};
