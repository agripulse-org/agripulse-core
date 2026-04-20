import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useLanguage } from "@/providers/language-provider";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Layers,
  Download,
  Trash2,
  AlertCircle,
  Thermometer,
  Cloud,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { ANALYSIS_DETAILS_MOCK } from "@/lib/constants";

export const Route = createFileRoute("/(app)/analysis/$id")({
  component: AnalysisDetailsRoute,
});

interface AnalysisDetailsPageProps {
  id: string;
}

function AnalysisDetailsRoute() {
  const { id } = Route.useParams();
  return <AnalysisDetailsPage id={id} />;
}

function AnalysisDetailsPage({ id }: AnalysisDetailsPageProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = () => {
    toast.success("Analysis deleted successfully");
    setTimeout(() => navigate({ to: "/" }), 500);
  };

  const handleDownloadPDF = () => {
    toast.success("Downloading PDF report...");
    setTimeout(() => {
      toast.success("PDF report downloaded");
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal":
        return "text-primary";
      case "good":
        return "text-chart-2";
      case "warning":
        return "text-accent";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate({ to: "/" })}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl mb-4">Soil Analysis Report #{id}</h1>
              <div className="flex flex-wrap gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{ANALYSIS_DETAILS_MOCK.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(ANALYSIS_DETAILS_MOCK.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  <span>{ANALYSIS_DETAILS_MOCK.depth}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg transition-all"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">{t("analysis.details.downloadPDF")}</span>
                <span className="sm:hidden">Download PDF</span>
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-destructive/20 backdrop-blur-sm hover:bg-destructive/30 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>{t("analysis.details.delete")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl mb-6">{t("analysis.details.soilParameters")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(ANALYSIS_DETAILS_MOCK.soilParameters).map(
              ([key, param]: [string, any]) => (
                <div
                  key={key}
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all"
                >
                  <p className="text-sm text-muted-foreground mb-2 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-3xl ${getStatusColor(param.status)}`}>
                      {param.value}
                    </span>
                    {param.unit && (
                      <span className="text-sm text-muted-foreground">{param.unit}</span>
                    )}
                  </div>
                  <div className={`mt-2 text-xs ${getStatusColor(param.status)}`}>
                    ● {param.status}
                  </div>
                </div>
              ),
            )}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl mb-6">{t("analysis.details.weatherData")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Thermometer className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("analysis.details.temperature")}
                  </p>
                  <p className="text-2xl">
                    {ANALYSIS_DETAILS_MOCK.weather.temperature.value}
                    {ANALYSIS_DETAILS_MOCK.weather.temperature.unit}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-chart-2/20 rounded-lg flex items-center justify-center">
                  <Cloud className="w-5 h-5 text-chart-2" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("analysis.details.rainfall")}</p>
                  <p className="text-2xl">
                    {ANALYSIS_DETAILS_MOCK.weather.rainfall.value}{" "}
                    {ANALYSIS_DETAILS_MOCK.weather.rainfall.unit}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl mb-6">{t("analysis.details.plantRecommendations")}</h2>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="divide-y divide-border">
              {ANALYSIS_DETAILS_MOCK.recommendations.map((rec, index) => (
                <motion.div
                  key={rec.plant}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="p-6 hover:bg-muted/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🌱"}
                      </div>
                      <div>
                        <h3 className="text-lg">{rec.plant}</h3>
                        <p className="text-sm text-muted-foreground">{rec.reason}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl text-primary mb-1">{rec.compatibility}%</div>
                      <p className="text-xs text-muted-foreground">
                        {t("analysis.details.compatibility")}
                      </p>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${rec.compatibility}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + index * 0.05 }}
                      className="h-full bg-gradient-to-r from-primary to-chart-2 rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-accent/10 border border-accent/30 rounded-xl p-6"
        >
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium mb-1">Important Note</h4>
              <p className="text-sm text-muted-foreground">{t("analysis.details.disclaimer")}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl mb-4">Confirm Deletion</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete this analysis? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-all"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
