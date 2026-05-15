import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { Thermometer, Droplets, CloudRain } from "lucide-react";
import { AnalysisMetricCard } from "@/components/analyses/AnalysisMetricCard";
import { TemperatureRangeChart } from "@/components/charts/TemperatureRangeChart";
import type { SoilAnalysis } from "@/services/soil-analysis/models";

interface AnalysisWeatherSectionProps {
  analysis: SoilAnalysis;
}

export function AnalysisWeatherSection({ analysis }: AnalysisWeatherSectionProps) {
  const { t } = useTranslation();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <h2 className="text-xl mb-6">{t("analysis.details.weatherData")}</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AnalysisMetricCard
          label={t("analysis.details.temperature")}
          value={analysis.temperatureAvgC?.toFixed(1)}
          unit="°C"
          icon={
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
              <Thermometer className="w-5 h-5 text-accent" />
            </div>
          }
        >
          {analysis.temperatureMinC !== null && analysis.temperatureMaxC !== null && (
            <TemperatureRangeChart
              avg={analysis.temperatureAvgC}
              min={analysis.temperatureMinC}
              max={analysis.temperatureMaxC}
            />
          )}
        </AnalysisMetricCard>

        <AnalysisMetricCard
          label={t("analysis.details.humidity")}
          value={analysis.avgHumidityPercent?.toFixed(1)}
          unit="%"
          icon={
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Droplets className="w-5 h-5 text-blue-500" />
            </div>
          }
        />

        <AnalysisMetricCard
          label={t("analysis.details.precipitation")}
          value={analysis.totalPrecipitationMm?.toFixed(0)}
          unit="mm"
          icon={
            <div className="w-10 h-10 bg-chart-2/20 rounded-lg flex items-center justify-center">
              <CloudRain className="w-5 h-5 text-chart-2" />
            </div>
          }
        />
      </div>
    </motion.section>
  );
}
