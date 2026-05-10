import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { useFormatters } from "@/hooks/useFormatters";
import { CROP_TYPE_MAP } from "@/lib/constants";
import type { AnalysisCropRecommendation } from "@/services/soil-analysis/models";

function scoreTextClass(score: number): string {
  if (score >= 70) return "text-primary";
  if (score >= 30) return "text-secondary";
  return "text-destructive";
}

function scoreColorClass(score: number): string {
  if (score >= 70) return "bg-linear-to-r from-primary to-chart-2";
  if (score >= 30) return "bg-secondary";
  return "bg-destructive";
}

interface AnalysisCropRecommendationCardProps {
  recommendation: AnalysisCropRecommendation;
  delay: number;
  imageFallback?: string;
}

export function AnalysisCropRecommendationCard({
  recommendation,
  delay,
  imageFallback = "🌱",
}: AnalysisCropRecommendationCardProps) {
  const { t } = useTranslation();
  const { percent } = useFormatters();

  const cropMeta = CROP_TYPE_MAP[recommendation.crop];
  const score = recommendation.recommendationScore;

  return (
    <motion.div
      key={recommendation.crop}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="p-6 hover:bg-muted/30 transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex items-center justify-center shrink-0">
            {cropMeta?.imageUrl ? (
              <img
                src={cropMeta.imageUrl}
                alt={t(cropMeta.nameKey)}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl">{imageFallback}</span>
            )}
          </div>

          <div>
            <h3 className="text-lg">{cropMeta ? t(cropMeta.nameKey) : recommendation.crop}</h3>
            {cropMeta?.descriptionKey && (
              <p className="text-sm text-muted-foreground">{t(cropMeta.descriptionKey)}</p>
            )}
          </div>
        </div>

        <div className="text-right shrink-0 ml-4">
          <div className={`text-2xl mb-1 ${scoreTextClass(score)}`}>{percent(score)}</div>
          <p className="text-xs text-muted-foreground">{t("analysis.details.compatibility")}</p>
        </div>
      </div>

      <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, delay }}
          className={`h-full ${scoreColorClass(score)} rounded-full`}
        />
      </div>
    </motion.div>
  );
}
