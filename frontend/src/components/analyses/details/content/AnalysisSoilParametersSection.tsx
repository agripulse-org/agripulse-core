import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { AnalysisMetricCard } from "@/components/analyses/AnalysisMetricCard";
import type { SoilAnalysis } from "@/services/soil-analysis/models";
import { StackedBar } from "@/components/charts/StackedBar";

type SoilParameter = {
  key: string;
  label: string;
  value: string | undefined;
  unit: string;
};

interface AnalysisSoilParametersSectionProps {
  analysis: SoilAnalysis;
}

export function AnalysisSoilParametersSection({ analysis }: AnalysisSoilParametersSectionProps) {
  const { t } = useTranslation();

  const hasTexture =
    analysis.sandContent !== null || analysis.siltContent !== null || analysis.clayContent !== null;

  const soilParams = useMemo<SoilParameter[]>(
    () => [
      { key: "ph", label: t("analysis.details.ph"), value: analysis.ph?.toFixed(1), unit: "pH" },
      {
        key: "nitrogen",
        label: t("analysis.details.nitrogen"),
        value: analysis.nitrogen?.toFixed(2),
        unit: "g/kg",
      },
      {
        key: "organicCarbon",
        label: t("analysis.details.organicCarbon"),
        value: analysis.organicCarbon?.toFixed(1),
        unit: "g/kg",
      },
      {
        key: "cec",
        label: t("analysis.details.cec"),
        value: analysis.cec?.toFixed(1),
        unit: "mmolₓ/kg",
      },
      {
        key: "bulkDensity",
        label: t("analysis.details.bulkDensity"),
        value: analysis.bulkDensity?.toFixed(2),
        unit: "g/cm³",
      },
      {
        key: "coarseFragments",
        label: t("analysis.details.coarseFragments"),
        value: analysis.coarseFragments?.toFixed(1),
        unit: "%",
      },
      {
        key: "plantAvailableWater",
        label: t("analysis.details.plantAvailableWater"),
        value: analysis.plantAvailableWater?.toFixed(0),
        unit: "mm/m",
      },
    ],
    [analysis, t],
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 md:space-y-6"
    >
      {hasTexture && (
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-sm text-muted-foreground mb-4">
            {t("analysis.details.textureComposition")}
          </p>

          <StackedBar
            segments={[
              {
                label: t("analysis.details.sandContent"),
                value: analysis.sandContent,
                colorClass: "bg-chart-3",
              },
              {
                label: t("analysis.details.siltContent"),
                value: analysis.siltContent,
                colorClass: "bg-chart-2",
              },
              {
                label: t("analysis.details.clayContent"),
                value: analysis.clayContent,
                colorClass: "bg-chart-5",
              },
            ]}
          />
        </div>
      )}

      <h2 className="text-xl">{t("analysis.details.soilParameters")}</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {soilParams.map((param) => (
          <AnalysisMetricCard
            key={param.key}
            label={param.label}
            value={param.value}
            unit={param.unit}
          />
        ))}
      </div>
    </motion.section>
  );
}
