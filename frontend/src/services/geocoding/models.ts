export type NominatimSearchResult = {
  lat: string;
  lon: string;
};

export type NominatimReverseResult = {
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    state_district?: string;
    county?: string;
    country?: string;
  };
};

export type SearchLocationResult = {
  latitude: number;
  longitude: number;
};

export type ReverseGeocodedLocation = {
  city: string;
  country: string;
};
