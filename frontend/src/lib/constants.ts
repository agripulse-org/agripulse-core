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
  wheat: {
    nameKey: "crops.wheat",
    descriptionKey: "crops.wheat.description",
    imageUrl: "/crops/wheat.webp",
  },
  barley: {
    nameKey: "crops.barley",
    descriptionKey: "crops.barley.description",
    imageUrl: "/crops/barley.webp",
  },
  rye: {
    nameKey: "crops.rye",
    descriptionKey: "crops.rye.description",
    imageUrl: "/crops/rye.webp",
  },
  oats: {
    nameKey: "crops.oats",
    descriptionKey: "crops.oats.description",
    imageUrl: "/crops/oats.webp",
  },
  corn: {
    nameKey: "crops.corn",
    descriptionKey: "crops.corn.description",
    imageUrl: "/crops/corn.webp",
  },
  rapeseed: {
    nameKey: "crops.rapeseed",
    descriptionKey: "crops.rapeseed.description",
    imageUrl: "/crops/Rapeseed.webp",
  },
  sunflower: {
    nameKey: "crops.sunflower",
    descriptionKey: "crops.sunflower.description",
    imageUrl: "/crops/sunflower.webp",
  },
  soybean: {
    nameKey: "crops.soybean",
    descriptionKey: "crops.soybean.description",
    imageUrl: "/crops/soybean.webp",
  },
  potato: {
    nameKey: "crops.potato",
    descriptionKey: "crops.potato.description",
    imageUrl: "/crops/potato.webp",
  },
  sugar_beet: {
    nameKey: "crops.sugarBeet",
    descriptionKey: "crops.sugarBeet.description",
  },
  tomato: {
    nameKey: "crops.tomato",
    descriptionKey: "crops.tomato.description",
    imageUrl: "/crops/tomato.webp",
  },
  cherry: {
    nameKey: "crops.cherry",
    descriptionKey: "crops.cherry.description",
    imageUrl: "/crops/cherry.webp",
  },
  peach: {
    nameKey: "crops.peach",
    descriptionKey: "crops.peach.description",
    imageUrl: "/crops/peach.webp",
  },
};
