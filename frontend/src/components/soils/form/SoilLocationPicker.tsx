import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { LocateFixed, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { geocodingService } from "@/services/geocoding";
import { MAP_INITIAL_CENTER, MAP_INITIAL_ZOOM } from "@/lib/constants";

import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

interface SoilLocationPickerProps {
  latitude: string;
  longitude: string;
  onChange: (value: { latitude: string; longitude: string }) => void;
}

export function SoilLocationPicker({ latitude, longitude, onChange }: SoilLocationPickerProps) {
  const { t } = useTranslation();

  const [search, setSearch] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  const handleSearch = async () => {
    const result = await geocodingService.searchLocation(search);

    if (result) {
      onChange({ latitude: String(result.latitude), longitude: String(result.longitude) });
    }
  };

  const handleLocate = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange({
          latitude: String(pos.coords.latitude),
          longitude: String(pos.coords.longitude),
        });
        setIsLocating(false);
      },
      () => setIsLocating(false),
    );
  };

  const position = parseLatLng(latitude, longitude);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder={t("soils.searchPlaceholder")}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-xl border border-border bg-input-background px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              void handleSearch();
            }
          }}
        />

        <Button
          type="button"
          onClick={() => void handleSearch()}
          className="h-12.5 w-12.5 shrink-0 rounded-xl p-0"
          aria-label={t("soils.search")}
          title={t("soils.search")}
        >
          <Search className="size-5" />
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-card text-muted-foreground">
            {t("analysis.new.orCoordinates")}
          </span>
        </div>
      </div>

      <div className="w-full flex gap-3 items-end">
        <div className="grid gap-3 sm:grid-cols-2 grow">
          <div>
            <label className="mb-2 block text-sm">{t("analysis.new.latitude")}</label>
            <input
              type="number"
              step="any"
              value={latitude}
              className="w-full rounded-xl border border-border bg-input-background px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
              onChange={(event) => onChange({ latitude: event.target.value, longitude })}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm">{t("analysis.new.longitude")}</label>
            <input
              type="number"
              step="any"
              value={longitude}
              className="w-full rounded-xl border border-border bg-input-background px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
              onChange={(event) => onChange({ latitude, longitude: event.target.value })}
            />
          </div>
        </div>

        <Button
          type="button"
          onClick={handleLocate}
          disabled={isLocating}
          className="h-12.5 w-12.5 shrink-0 rounded-xl p-0"
          aria-label={t("soils.useMyLocation")}
          title={t("soils.useMyLocation")}
        >
          <LocateFixed className="size-5" />
        </Button>
      </div>

      <div className="h-80 relative w-full overflow-hidden rounded-2xl border">
        <MapContainer
          center={position ?? MAP_INITIAL_CENTER}
          zoom={position ? 12 : MAP_INITIAL_ZOOM}
          style={{ height: "100%", width: "100%" }}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <SoilLocationMarker
            position={position}
            onMove={(p) => onChange({ latitude: String(p.lat), longitude: String(p.lng) })}
          />
        </MapContainer>
      </div>
    </div>
  );
}

function SoilLocationMarker({
  position,
  onMove,
}: {
  position: L.LatLng | null;
  onMove: (position: L.LatLng) => void;
}) {
  const map = useMap();

  useEffect(() => {
    const timer = window.setTimeout(() => map.invalidateSize(), 120);
    return () => window.clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    if (position) map.flyTo(position, Math.max(map.getZoom(), 12));
  }, [map, position]);

  useMapEvents({ click: (e) => onMove(e.latlng) });

  return position === null ? null : <Marker position={position} />;
}

function parseLatLng(latitude: string, longitude: string): L.LatLng | null {
  const lat = Number(latitude);
  const lng = Number(longitude);
  return Number.isFinite(lat) && Number.isFinite(lng) && latitude.trim() && longitude.trim()
    ? L.latLng(lat, lng)
    : null;
}
