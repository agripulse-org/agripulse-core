import ky from "ky";
import type {
  NominatimReverseResult,
  NominatimSearchResult,
  ReverseGeocodedLocation,
  SearchLocationResult,
} from "./models";

const nominatimClient = ky.create({
  baseUrl: "https://nominatim.openstreetmap.org",
  retry: 0,
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});

export async function searchLocation(query: string): Promise<SearchLocationResult | null> {
  if (!query.trim()) {
    return null;
  }

  try {
    const results = await nominatimClient
      .get("search", { searchParams: { format: "json", q: query } })
      .json<NominatimSearchResult[]>();

    if (results.length === 0) {
      return null;
    }

    const latitude = Number(results[0].lat);
    const longitude = Number(results[0].lon);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return null;
    }

    return { latitude, longitude };
  } catch {
    return null;
  }
}

export async function reverseGeocodeLocation(
  latitude: number,
  longitude: number,
): Promise<ReverseGeocodedLocation | null> {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  try {
    const result = await nominatimClient
      .get("reverse", {
        searchParams: {
          format: "jsonv2",
          lat: latitude,
          lon: longitude,
          zoom: 10,
          addressdetails: 1,
        },
      })
      .json<NominatimReverseResult>();
    const address = result.address;

    if (!address) {
      return null;
    }

    const city =
      address.city ??
      address.town ??
      address.village ??
      address.municipality ??
      address.state_district ??
      address.county;

    const country = address.country;

    if (!city && !country) {
      return null;
    }

    return {
      city: city ?? "",
      country: country ?? "",
    };
  } catch {
    return null;
  }
}
