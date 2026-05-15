import type { ParseKeys } from "i18next";

export const MAP_INITIAL_CENTER: [number, number] = [41.6086, 21.7453];
export const MAP_INITIAL_ZOOM = 8;

// ==== Soil analysis ====
export const ANALYSIS_DEPTH_OPTIONS: {
  value: "DEPTH_0_5" | "DEPTH_5_15" | "DEPTH_15_30" | "DEPTH_30_60";
  label: string;
  descriptionKey: ParseKeys;
}[] = [
  { value: "DEPTH_0_5", label: "0–5 cm", descriptionKey: "soils.depth.DEPTH_0_5.description" },
  { value: "DEPTH_5_15", label: "5–15 cm", descriptionKey: "soils.depth.DEPTH_5_15.description" },
  {
    value: "DEPTH_15_30",
    label: "15–30 cm",
    descriptionKey: "soils.depth.DEPTH_15_30.description",
  },
  {
    value: "DEPTH_30_60",
    label: "30–60 cm",
    descriptionKey: "soils.depth.DEPTH_30_60.description",
  },
];

export const getSoilDepthLabel = (soilDepth: string): string => {
  return ANALYSIS_DEPTH_OPTIONS.find((o) => o.value === soilDepth)?.label ?? soilDepth;
};

export const SOIL_ANALYSIS_CSV_TEMPLATE =
  "soilDepth,ph,nitrogen,cec,organicCarbon,sandContent,siltContent,clayContent,bulkDensity,coarseFragments,plantAvailableWater\n" +
  "0-5,6.5,0.14,18.0,2.8,45.0,35.0,20.0,1.35,5.0,22.0\n";

// ==== Crop types ====
export type CropTypeMeta = {
  nameKey: ParseKeys;
  descriptionKey: ParseKeys;
  imageUrl?: string;
};

export const CROP_TYPE_MAP: Partial<Record<string, CropTypeMeta>> = {
  maize: { nameKey: "crops.maize", descriptionKey: "crops.maize.description" },
  sugarcane: { nameKey: "crops.sugarcane", descriptionKey: "crops.sugarcane.description" },
  cotton: { nameKey: "crops.cotton", descriptionKey: "crops.cotton.description" },
  tobacco: { nameKey: "crops.tobacco", descriptionKey: "crops.tobacco.description" },
  paddy: { nameKey: "crops.paddy", descriptionKey: "crops.paddy.description" },
  barley: { nameKey: "crops.barley", descriptionKey: "crops.barley.description" },
  wheat: { nameKey: "crops.wheat", descriptionKey: "crops.wheat.description" },
  millets: { nameKey: "crops.millets", descriptionKey: "crops.millets.description" },
  oil_seeds: { nameKey: "crops.oilSeeds", descriptionKey: "crops.oilSeeds.description" },
  pulses: { nameKey: "crops.pulses", descriptionKey: "crops.pulses.description" },
  ground_nuts: { nameKey: "crops.groundNuts", descriptionKey: "crops.groundNuts.description" },
};
