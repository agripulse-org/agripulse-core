import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { AlertCircle, Loader2, XCircle } from "lucide-react";
import { AnalysisSoilParametersSection } from "@/components/analyses/details/content/AnalysisSoilParametersSection";
import { AnalysisWeatherSection } from "@/components/analyses/details/content/AnalysisWeatherSection";
import { AnalysisCropRecommendationsSection } from "@/components/analyses/details/content/AnalysisCropRecommendationsSection";
import type { SoilAnalysis } from "@/services/soil-analysis/models";

interface AnalysisDetailsContentProps {
  analysis: SoilAnalysis;
}

export function AnalysisDetailsContent({ analysis }: AnalysisDetailsContentProps) {
  const { t } = useTranslation();

  if (analysis.status === "FAILED") {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center py-24">
        <div className="text-center space-y-4">
          <XCircle className="w-12 h-12 text-destructive mx-auto" />
          <h2 className="text-2xl">{t("analysis.details.failed")}</h2>
          <p className="text-muted-foreground max-w-md">
            {t("analysis.details.failedDescription")}
          </p>
        </div>
      </div>
    );
  }

  const hasSoilData = analysis.ph !== null && analysis.temperatureAvgC !== null;
  if (!hasSoilData && analysis.status === "PENDING") {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center py-24">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary mx-auto animate-spin" />
          <h2 className="text-2xl">{t("analysis.details.inProgress")}</h2>
          <p className="text-muted-foreground max-w-md">
            {t("analysis.details.inProgressDescription")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <AnalysisSoilParametersSection analysis={analysis} />

      <AnalysisWeatherSection analysis={analysis} />

      <AnalysisCropRecommendationsSection analysis={analysis} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-accent/10 border border-accent/30 rounded-xl p-6"
      >
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium mb-1">{t("analysis.details.importantNote")}</h4>
            <p className="text-sm text-muted-foreground">{t("analysis.details.disclaimer")}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
