import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Plus, MapPin, Calendar, Layers, FlaskConical, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { StatCard } from "@/components/StatCard";
import { EmptyState } from "@/components/EmptyState";
import { DASHBOARD_MOCK_ANALYSES } from "@/lib/constants";

export const Route = createFileRoute("/(app)/")({
  component: DashboardRoute,
});

function DashboardRoute() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl mb-2">{t("dashboard.title")}</h1>
          <p className="text-muted-foreground">{t("dashboard.subtitle")}</p>
        </div>
        <button
          onClick={() => navigate({ to: "/analysis/create" })}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span>{t("dashboard.newAnalysis")}</span>
        </button>
      </div>

      {DASHBOARD_MOCK_ANALYSES.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <StatCard
            title="Total Analyses"
            value={DASHBOARD_MOCK_ANALYSES.length}
            icon={FlaskConical}
            iconColor="text-primary"
          />
          <StatCard title="Soils Tracked" value={3} icon={Layers} iconColor="text-secondary" />
          <StatCard
            title="Avg Compatibility"
            value="88%"
            icon={TrendingUp}
            iconColor="text-accent"
          />
        </motion.div>
      )}

      {DASHBOARD_MOCK_ANALYSES.length === 0 ? (
        <EmptyState
          icon={Layers}
          title={t("dashboard.noAnalyses")}
          description={t("dashboard.getStarted")}
          action={{
            label: t("dashboard.newAnalysis"),
            onClick: () => navigate({ to: "/analysis/create" }),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DASHBOARD_MOCK_ANALYSES.map((analysis, index) => (
            <motion.div
              key={analysis.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() =>
                navigate({
                  to: "/analysis/$id",
                  params: { id: analysis.id },
                })
              }
              className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{analysis.location}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(analysis.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Layers className="w-4 h-4" />
                    <span>{analysis.depth}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm mb-3 text-muted-foreground">
                    {t("dashboard.recommendations")}
                  </p>
                  <div className="space-y-2">
                    {analysis.recommendations.map((rec) => (
                      <div key={rec.plant} className="flex items-center justify-between">
                        <span className="text-sm">{rec.plant}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${rec.compatibility}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-primary">
                            {rec.compatibility}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <div className="text-primary text-sm group-hover:underline">
                  View full analysis →
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
