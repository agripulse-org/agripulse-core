export const MAP_INITIAL_CENTER: [number, number] = [41.6086, 21.7453];
export const MAP_INITIAL_ZOOM = 8;

export const ANALYSIS_DEPTH_OPTIONS = [
  { value: "0-5", label: "0–5 cm", description: "Surface layer" },
  { value: "5-15", label: "5–15 cm", description: "Topsoil" },
  { value: "15-30", label: "15–30 cm", description: "Subsoil" },
  { value: "30-60", label: "30–60 cm", description: "Deep layer" },
];

export const getSoilDepthLabel = (soilDepth: string): string => {
  const value = soilDepth.replace("DEPTH_", "").replaceAll("_", "-").toLowerCase();
  return ANALYSIS_DEPTH_OPTIONS.find((o) => o.value === value)?.label ?? soilDepth;
};

// ==== Crop types ====

export type CropI18nKey =
  | "crops.maize"
  | "crops.sugarcane"
  | "crops.cotton"
  | "crops.tobacco"
  | "crops.paddy"
  | "crops.barley"
  | "crops.wheat"
  | "crops.millets"
  | "crops.oilSeeds"
  | "crops.pulses"
  | "crops.groundNuts";

export type CropTypeMeta = {
  name: CropI18nKey;
  imagePath?: string;
  description?: string;
};

export const CROP_TYPE_MAP: Partial<Record<string, CropTypeMeta>> = {
  maize: { name: "crops.maize" },
  sugarcane: { name: "crops.sugarcane" },
  cotton: { name: "crops.cotton" },
  tobacco: { name: "crops.tobacco" },
  paddy: { name: "crops.paddy" },
  barley: { name: "crops.barley" },
  wheat: { name: "crops.wheat" },
  millets: { name: "crops.millets" },
  oil_seeds: { name: "crops.oilSeeds" },
  pulses: { name: "crops.pulses" },
  ground_nuts: { name: "crops.groundNuts" },
};

export const ANALYSIS_DETAILS_MOCK = {
  id: "1",
  location: "Skopje, North Macedonia",
  date: "2026-04-10",
  depth: "0-5 cm",
  coordinates: { lat: 41.9973, lng: 21.428 },
  soilParameters: {
    ph: { value: 6.5, unit: "pH", status: "optimal" },
    texture: { value: "Loamy", status: "good" },
    carbon: { value: 2.8, unit: "%", status: "good" },
    nitrogen: { value: 0.14, unit: "%", status: "optimal" },
    bulkDensity: { value: 1.35, unit: "g/cm³", status: "good" },
    cec: { value: 18, unit: "meq/100g", status: "optimal" },
    moisture: { value: 22, unit: "%", status: "good" },
  },
  weather: {
    temperature: { value: 18, unit: "°C" },
    rainfall: { value: 45, unit: "mm/month" },
  },
  recommendations: [
    { plant: "Wheat", compatibility: 92, reason: "Optimal pH and nitrogen levels" },
    { plant: "Barley", compatibility: 88, reason: "Good soil texture and moisture" },
    { plant: "Sunflower", compatibility: 85, reason: "Suitable organic carbon content" },
    { plant: "Corn", compatibility: 78, reason: "Adequate CEC and bulk density" },
    { plant: "Potato", compatibility: 75, reason: "Good moisture retention" },
  ],
};

export const SOIL_DETAILS_MOCK_ANALYSES = [
  {
    id: "1",
    soilId: "1",
    depth: "0-5 cm",
    date: "2026-04-10",
    topRecommendations: [
      { plant: "Wheat", compatibility: 92 },
      { plant: "Barley", compatibility: 88 },
    ],
  },
  {
    id: "2",
    soilId: "1",
    depth: "5-15 cm",
    date: "2026-04-05",
    topRecommendations: [
      { plant: "Corn", compatibility: 90 },
      { plant: "Potato", compatibility: 87 },
    ],
  },
];
