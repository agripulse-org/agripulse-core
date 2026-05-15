import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { FlaskConical, Plus, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSoilDepthLabel, CROP_TYPE_MAP } from "@/lib/constants";
import { EmptyState } from "@/components/EmptyState";
import { NewAnalysisModal } from "@/components/analyses/NewAnalysisModal";
import type { SoilAnalysis } from "@/services/soil-analysis/models";
import { useFormatters } from "@/hooks/useFormatters";

interface SoilAnalysesTabProps {
  soilId: string;
  analyses: SoilAnalysis[];
}

export function SoilAnalysesTab({ soilId, analyses }: SoilAnalysesTabProps) {
  const { t } = useTranslation();

  const [showModal, setShowModal] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl">{t("soils.details.allAnalyses")}</h2>

        <button
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-lg"
          onClick={() => setShowModal(true)}
        >
          <Plus className="w-5 h-5" />
          <span>{t("dashboard.newAnalysis")}</span>
        </button>
      </div>

      {analyses.length === 0 ? (
        <EmptyState
          icon={FlaskConical}
          title={t("dashboard.noAnalyses")}
          description={t("soils.details.noAnalysesDescription")}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analyses.map((analysis, index) => (
            <AnalysisCard
              key={analysis.id}
              soilId={soilId}
              analysis={analysis}
              delay={index * 0.1}
            />
          ))}
        </div>
      )}

      {showModal && (
        <NewAnalysisModal
          soilId={soilId}
          onClose={() => setShowModal(false)}
          onImportSuccess={() => setShowModal(false)}
        />
      )}
    </motion.div>
  );
}

interface AnalysisCardProps {
  soilId: string;
  analysis: SoilAnalysis;
  delay: number;
}

function AnalysisCard({ soilId, analysis, delay }: AnalysisCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { date } = useFormatters();

  const isPending = analysis.status === "PENDING";
  const isFailed = analysis.status === "FAILED";
  const topRecommendations = (analysis.cropRecommendations ?? []).slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={() =>
        navigate({
          to: "/soils/$soilId/analyses/$analysisId",
          params: { soilId, analysisId: analysis.id },
        })
      }
      className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-medium mb-1">{getSoilDepthLabel(analysis.soilDepth)}</h3>
          <p className="text-sm text-muted-foreground">{date(analysis.createdAt)}</p>
        </div>

        <div className="flex items-center gap-2">
          {isFailed && (
            <span className="hidden sm:block text-xs text-destructive font-medium">
              {t("analysis.status.FAILED")}
            </span>
          )}

          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              isPending ? "bg-amber-500/10" : isFailed ? "bg-destructive/10" : "bg-primary/10",
            )}
          >
            {isPending ? (
              <Clock className="w-5 h-5 text-amber-500" />
            ) : isFailed ? (
              <AlertCircle className="w-5 h-5 text-destructive" />
            ) : (
              <FlaskConical className="w-5 h-5 text-primary" />
            )}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        {isPending ? (
          <p className="text-sm text-muted-foreground italic text-center">
            {t("dashboard.recommendationsPending")}
          </p>
        ) : isFailed ? (
          <p className="text-sm text-destructive text-center">
            {t("soils.details.analysis.failedDescription")}
          </p>
        ) : topRecommendations.length === 0 ? (
          <p className="text-sm text-muted-foreground italic text-center">
            {t("dashboard.noRecommendations")}
          </p>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-2">{t("dashboard.recommendations")}</p>

            {topRecommendations.map((rec) => {
              const cropNameKey = CROP_TYPE_MAP[rec.crop]?.nameKey;
              return (
                <div key={rec.crop} className="flex items-center justify-between">
                  <span className="text-sm">{cropNameKey ? t(cropNameKey) : rec.crop}</span>
                  <span className="text-sm font-medium text-primary">
                    {Math.round(rec.recommendationScore)}%
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
