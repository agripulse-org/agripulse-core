import { useTranslation } from "react-i18next";

interface TemperatureRangeChartProps {
  avg: number | null;
  min: number;
  max: number;
}

export function TemperatureRangeChart({ avg, min, max }: TemperatureRangeChartProps) {
  const { t } = useTranslation();
  const avgPosition =
    avg !== null && max !== min
      ? Math.max(0, Math.min(100, ((avg - min) / (max - min)) * 100))
      : null;

  return (
    <div>
      <div className="relative h-2 bg-muted rounded-full mb-3">
        <div className="absolute inset-0 bg-linear-to-r from-blue-400 to-orange-400 rounded-full" />
        {avgPosition !== null && (
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-background border-2 border-foreground rounded-full shadow-sm"
            style={{ left: `${avgPosition}%` }}
          />
        )}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>
          {min.toFixed(1)}°C {t("analysis.details.tempMin")}
        </span>
        <span>
          {t("analysis.details.tempMax")} {max.toFixed(1)}°C
        </span>
      </div>
    </div>
  );
}
