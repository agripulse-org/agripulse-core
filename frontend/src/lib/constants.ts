export const MAP_INITIAL_CENTER: [number, number] = [41.6086, 21.7453];
export const MAP_INITIAL_ZOOM = 8;

export const ANALYSIS_DEPTH_OPTIONS = [
  { value: "0-5", label: "0–5 cm", description: "Surface layer" },
  { value: "5-15", label: "5–15 cm", description: "Topsoil" },
  { value: "15-30", label: "15–30 cm", description: "Subsoil" },
  { value: "30-60", label: "30–60 cm", description: "Deep layer" },
];

export const IMPORT_UPLOAD_STATUSES = ["idle", "success", "error"] as const;
export type ImportUploadStatus = (typeof IMPORT_UPLOAD_STATUSES)[number];

// ==== Mock data ====

export const DASHBOARD_MOCK_ANALYSES = [
  {
    id: "1",
    location: "Skopje, North Macedonia",
    date: "2026-04-10",
    depth: "0-5 cm",
    coordinates: { lat: 41.9973, lng: 21.428 },
    recommendations: [
      { plant: "Wheat", compatibility: 92 },
      { plant: "Barley", compatibility: 88 },
      { plant: "Sunflower", compatibility: 85 },
    ],
  },
  {
    id: "2",
    location: "Bitola, North Macedonia",
    date: "2026-04-05",
    depth: "5-15 cm",
    coordinates: { lat: 41.0297, lng: 21.3347 },
    recommendations: [
      { plant: "Corn", compatibility: 90 },
      { plant: "Potato", compatibility: 87 },
      { plant: "Tomato", compatibility: 82 },
    ],
  },
  {
    id: "3",
    location: "Ohrid, North Macedonia",
    date: "2026-03-28",
    depth: "15-30 cm",
    coordinates: { lat: 41.1172, lng: 20.8019 },
    recommendations: [
      { plant: "Grapes", compatibility: 95 },
      { plant: "Olive", compatibility: 91 },
      { plant: "Almond", compatibility: 86 },
    ],
  },
];

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

export const IMPORT_ANALYSES_CSV_CONTENT =
  "Location,Date,Depth,pH,Nitrogen,Top Plant\nSkopje,2026-04-10,0-5cm,6.5,0.14,Wheat\n";

export const IMPORT_TEMPLATE_CSV_CONTENT =
  "Location,Latitude,Longitude,Depth,pH,Texture,Nitrogen,Organic Carbon\n";
