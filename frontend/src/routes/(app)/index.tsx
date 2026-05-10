import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { MapPin, Calendar, Layers, FlaskConical, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { StatCard } from "@/components/StatCard";
import { getDashboardQueryOptions } from "@/data/dashboard";
import { CROP_TYPE_MAP } from "@/lib/constants";
import { useFormatters } from "@/hooks/useFormatters";
import type { DashboardAnalysis } from "@/services/dashboard";

export const Route = createFileRoute("/(app)/")({
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(getDashboardQueryOptions()),
  component: DashboardRoute,
});

function DashboardRoute() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const formatters = useFormatters();

  const { data } = useSuspenseQuery(getDashboardQueryOptions());

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl mb-2">{t("dashboard.title")}</h1>
          <p className="text-muted-foreground">{t("dashboard.subtitle")}</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <StatCard
          title={t("dashboard.soilsTracked")}
          value={data.soilsTrackedCount}
          icon={Layers}
          iconColor="text-secondary"
        />
        <StatCard
          title={t("dashboard.totalAnalyses")}
          value={data.totalAnalysesCount}
          icon={FlaskConical}
          iconColor="text-primary"
        />
        <StatCard
          title={t("dashboard.avgCompatibility")}
          value={formatters.percent(data.avgCompatibility)}
          icon={TrendingUp}
          iconColor="text-accent"
        />
      </motion.div>

      <h2 className="text-xl mb-4">{t("dashboard.recentAnalyses")}</h2>

      {data.analyses.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("dashboard.getStarted")}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.analyses.map((analysis, index) => (
            <AnalysisCard
              key={analysis.id}
              analysis={analysis}
              delay={index * 0.1}
              onClick={() =>
                navigate({
                  to: "/soils/$soilId/analyses/$analysisId",
                  params: { soilId: analysis.soilProfile.id, analysisId: analysis.id },
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

type AnalysisCardProps = {
  analysis: DashboardAnalysis;
  delay: number;
  onClick: () => void;
};

function AnalysisCard({ analysis, delay, onClick }: AnalysisCardProps) {
  const { t } = useTranslation();
  const formatters = useFormatters();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      onClick={onClick}
      className="flex flex-col bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer group"
    >
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">
            {[analysis.soilProfile.city, analysis.soilProfile.country]
              .filter((v): v is string => v !== null)
              .join(", ")}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{formatters.date(analysis.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Layers className="w-4 h-4" />
            <span>{analysis.soilDepth}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          {analysis.recommendations === null ? (
            <p className="text-sm text-muted-foreground italic text-center">
              {t("dashboard.recommendationsPending")}
            </p>
          ) : analysis.recommendations.length === 0 ? (
            <p className="text-sm text-muted-foreground italic text-center">
              {t("dashboard.noRecommendations")}
            </p>
          ) : (
            <>
              <p className="text-sm mb-3 text-muted-foreground">{t("dashboard.recommendations")}</p>
              <div className="space-y-2">
                {analysis.recommendations.slice(0, 3).map((rec) => (
                  <div key={rec.crop} className="flex items-center justify-between">
                    <span className="text-sm">
                      {CROP_TYPE_MAP[rec.crop] ? t(CROP_TYPE_MAP[rec.crop]!.nameKey) : rec.crop}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${rec.recommendationScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-primary">
                        {formatters.percent(rec.recommendationScore)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-border">
        <div className="text-primary text-sm group-hover:underline">
          {t("dashboard.viewAnalysis")}
        </div>
      </div>
    </motion.div>
  );
}
