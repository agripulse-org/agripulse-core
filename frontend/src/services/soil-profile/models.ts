export type SoilProfileResponse = {
  id: string;
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
  city: string | null;
  country: string | null;
  createdAt: string;
};

export type CreateSoilProfileRequest = {
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  city: string;
  country: string;
};

export type UpdateSoilProfileRequest = {
  id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
};
