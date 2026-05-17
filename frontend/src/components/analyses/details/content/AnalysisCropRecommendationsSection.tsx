import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { AnalysisCropRecommendationCard } from "@/components/analyses/details/content/AnalysisCropRecommendationCard";
import type { SoilAnalysis } from "@/services/soil-analysis/models";

interface AnalysisCropRecommendationsSectionProps {
  analysis: SoilAnalysis;
}

export function AnalysisCropRecommendationsSection({
  analysis,
}: AnalysisCropRecommendationsSectionProps) {
  const { t } = useTranslation();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-xl mb-6">{t("analysis.details.plantRecommendations")}</h2>

      <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
        {analysis.cropRecommendations === null ? (
          <p className="text-sm text-muted-foreground italic text-center p-6">
            {t("analysis.details.recommendationsPending")}
          </p>
        ) : analysis.cropRecommendations.length === 0 ? (
          <p className="text-sm text-muted-foreground italic text-center p-6">
            {t("analysis.details.noRecommendations")}
          </p>
        ) : (
          analysis.cropRecommendations
            .filter((rec) => rec.confidencePercentage >= 1)
            .map((rec, index) => (
              <AnalysisCropRecommendationCard
                key={rec.crop}
                recommendation={rec}
                imageFallback={index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🌱"}
                delay={0.3 + index * 0.05}
              />
            ))
        )}
      </div>
    </motion.section>
  );
}
