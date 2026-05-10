import type { ParseKeys } from "i18next";

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
