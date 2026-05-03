import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  MapPin,
  Edit,
  Calendar,
  Layers,
  Plus,
  Upload,
  MessageSquare,
  FileText,
  FlaskConical,
  ChevronRight,
  StickyNote,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { getSoilProfileByIdQueryOptions } from "@/data/soilProfile";
import { ANALYSIS_DEPTH_OPTIONS, SOIL_DETAILS_MOCK_ANALYSES } from "@/lib/constants";
import { APIError } from "@/services/apiClient";
import { SoilNotesTab } from "@/components/soils/details/SoilNotesTab";
import { SoilConversationsTab } from "@/components/soils/details/SoilConversationsTab";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export const Route = createFileRoute("/(app)/soils/$soilId/")({
  loader: async ({ params, context: { queryClient } }) => {
    try {
      await queryClient.ensureQueryData(getSoilProfileByIdQueryOptions(params.soilId));
    } catch (error) {
      if (error instanceof APIError && error.statusCode === 404) {
        throw notFound();
      }

      throw error;
    }
  },
  notFoundComponent: SoilNotFound,
  component: SoilDetailsPage,
});

type Tab = "overview" | "analyses" | "notes" | "chat";

export function SoilDetailsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { soilId: id } = Route.useParams();

  const { data: soil } = useSuspenseQuery(getSoilProfileByIdQueryOptions(id));
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [showNewAnalysisModal, setShowNewAnalysisModal] = useState(false);

  const locationParts = [soil.city, soil.country].filter((value): value is string =>
    Boolean(value),
  );
  const locationLabel =
    locationParts.length > 0 ? locationParts.join(", ") : t("soils.unknownLocation");

  const tabs = [
    { id: "overview" as Tab, label: t("soils.details.tabs.overview"), icon: Layers },
    { id: "analyses" as Tab, label: t("soils.details.tabs.analyses"), icon: FlaskConical },
    { id: "notes" as Tab, label: t("soils.details.tabs.notes"), icon: StickyNote },
    { id: "chat" as Tab, label: t("soils.details.tabs.chat"), icon: MessageSquare },
  ];

  const handleCreateAnalysis = (depth: string) => {
    toast.success(t("soils.details.analysis.creating", { depth }));
    setShowNewAnalysisModal(false);
    setTimeout(() => {
      toast.success(t("soils.details.analysis.created"));
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-linear-to-r from-primary to-secondary text-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate({ to: "/soils" })}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t("soils.details.backToSoils")}</span>
          </button>

          <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shrink-0">
                  <Layers className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl mb-2">{soil.name}</h1>
                  <div className="flex flex-wrap gap-4 text-white/90 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{locationLabel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {t("soils.details.created")} {new Date(soil.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {soil.description && <p className="mt-3 text-white/80">{soil.description}</p>}
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate({ to: "/soils/$soilId/edit", params: { soilId: id } })}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg transition-all"
            >
              <Edit className="w-4 h-4" />
              <span>{t("soils.details.editSoil")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-4 border-b-2 transition-all whitespace-nowrap
                    ${
                      activeTab === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <OverviewTab
              key="overview"
              soil={soil}
              analyses={SOIL_DETAILS_MOCK_ANALYSES}
              onViewAllAnalyses={() => setActiveTab("analyses")}
            />
          )}
          {activeTab === "analyses" && (
            <AnalysesTab
              key="analyses"
              analyses={SOIL_DETAILS_MOCK_ANALYSES}
              onCreateNew={() => setShowNewAnalysisModal(true)}
            />
          )}
          {activeTab === "notes" && <SoilNotesTab key="notes" soilProfileId={id} />}
          {activeTab === "chat" && (
            <div className="h-[63vh]">
              <SoilConversationsTab soilProfileId={id} />
            </div>
          )}
        </AnimatePresence>
      </div>

      {showNewAnalysisModal && (
        <NewAnalysisModal
          onClose={() => setShowNewAnalysisModal(false)}
          onCreate={handleCreateAnalysis}
        />
      )}
    </div>
  );
}

function SoilNotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="text-center">
        <h1 className="mb-2 text-2xl">{t("soils.details.notFoundTitle")}</h1>
        <p className="mb-6 text-muted-foreground">{t("soils.details.notFoundDescription")}</p>
        <button
          onClick={() => navigate({ to: "/soils" })}
          className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          {t("soils.details.backToSoils")}
        </button>
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({
  soil,
  analyses,
  onViewAllAnalyses,
}: {
  soil: {
    id: string;
    city: string | null;
    country: string | null;
    latitude: number;
    longitude: number;
  };
  analyses: any[];
  onViewAllAnalyses: () => void;
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const locationParts = [soil.city, soil.country].filter((value): value is string =>
    Boolean(value),
  );
  const locationLabel =
    locationParts.length > 0 ? locationParts.join(", ") : t("soils.unknownLocation");
  const latestAnalysis = analyses
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-sm text-muted-foreground mb-2">{t("soils.details.totalAnalyses")}</p>
          <p className="text-3xl text-primary">{analyses.length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-sm text-muted-foreground mb-2">{t("soils.lastAnalysis")}</p>
          {latestAnalysis ? (
            <div className="space-y-1">
              <p className="text-lg">{latestAnalysis.depth}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(latestAnalysis.date).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <p className="text-lg text-muted-foreground">{t("dashboard.noAnalyses")}</p>
          )}
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-sm text-muted-foreground mb-2">{t("soils.location")}</p>
          <p className="text-lg">{locationLabel}</p>
        </div>
      </div>

      {/* Recent Analyses */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl">{t("soils.details.recentAnalyses")}</h2>
          <button onClick={onViewAllAnalyses} className="text-primary hover:underline text-sm">
            {t("soils.details.viewAll")}
          </button>
        </div>

        {analyses.slice(0, 3).map((analysis) => (
          <div
            key={analysis.id}
            onClick={() => navigate({ to: `/analysis/${analysis.id}` })}
            className="p-4 rounded-xl hover:bg-muted/50 transition-all cursor-pointer mb-2 last:mb-0"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium mb-1">{analysis.depth}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(analysis.date).toLocaleDateString()}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// Analyses Tab Component
function AnalysesTab({ analyses, onCreateNew }: { analyses: any[]; onCreateNew: () => void }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl">{t("soils.details.allAnalyses")}</h2>
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-lg"
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
          action={{ label: t("soils.details.createAnalysis"), onClick: onCreateNew }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analyses.map((analysis, index) => (
            <motion.div
              key={analysis.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate({ to: `/analysis/${analysis.id}` })}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-medium mb-1">{analysis.depth}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(analysis.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FlaskConical className="w-5 h-5 text-primary" />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-2">
                  {t("dashboard.recommendations")}
                </p>
                {analysis.topRecommendations.map((rec: any) => (
                  <div key={rec.plant} className="flex items-center justify-between">
                    <span className="text-sm">{rec.plant}</span>
                    <span className="text-sm font-medium text-primary">{rec.compatibility}%</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// New Analysis Modal Component
function NewAnalysisModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (depth: string) => void;
}) {
  const { t } = useTranslation();

  const [mode, setMode] = useState<"auto" | "import">("auto");
  const [selectedDepth, setSelectedDepth] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleImportCSV(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleImportCSV(Array.from(e.target.files));
    }
  };

  const handleImportCSV = (files: File[]) => {
    const csvFile = files.find((f) => f.name.endsWith(".csv"));
    if (csvFile) {
      setIsImporting(true);
      toast.loading(t("soils.details.import.importing"));
      setTimeout(() => {
        setIsImporting(false);
        toast.dismiss();
        toast.success(t("soils.details.import.parametersImported"));
        setTimeout(() => {
          toast.success(t("soils.details.analysis.created"));
          onClose();
        }, 1000);
      }, 2000);
    } else {
      toast.error(t("soils.details.import.invalidCsv"));
    }
  };

  const downloadTemplate = () => {
    const template = `Depth,pH,Texture,Nitrogen,Organic Carbon,Bulk Density,CEC,Moisture\n0-5 cm,6.5,Loamy,0.14,2.8,1.35,18,22\n`;
    const blob = new Blob([template], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "soil-parameters-template.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t("soils.details.import.templateDownloaded"));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <h3 className="text-xl mb-6">{t("soils.details.createAnalysis")}</h3>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6 p-1 bg-muted rounded-xl">
          <button
            onClick={() => setMode("auto")}
            className={`flex-1 px-4 py-2 rounded-lg transition-all ${
              mode === "auto"
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("soils.details.analysis.autoLoad")}
          </button>
          <button
            onClick={() => setMode("import")}
            className={`flex-1 px-4 py-2 rounded-lg transition-all ${
              mode === "import"
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("soils.details.import.fromCsv")}
          </button>
        </div>

        {/* Auto-Load Mode */}
        {mode === "auto" && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4">
              <p className="text-sm text-primary">
                <strong>{t("soils.details.analysis.autoLoadLabel")}:</strong>{" "}
                {t("soils.details.analysis.autoLoadDescription")}
              </p>
            </div>

            <label className="block text-sm mb-2">{t("analysis.new.selectDepth")}</label>
            {ANALYSIS_DEPTH_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedDepth(option.value)}
                className={`
                  w-full p-4 rounded-xl border-2 transition-all text-left
                  ${
                    selectedDepth === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-muted-foreground">{option.description}</div>
                  </div>
                  {selectedDepth === option.value && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              </button>
            ))}

            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-border rounded-xl hover:bg-muted transition-all"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={() => onCreate(selectedDepth)}
                disabled={!selectedDepth}
                className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 shadow-lg"
              >
                {t("soils.details.createAnalysis")}
              </button>
            </div>
          </motion.div>
        )}

        {/* Import Mode */}
        {mode === "import" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="bg-accent/15 border border-accent/40 rounded-xl p-4 mb-4">
              <p className="text-sm text-foreground">
                <strong>{t("soils.details.import.fromCsvLabel")}:</strong>{" "}
                {t("soils.details.import.description")}
              </p>
            </div>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                relative border-2 border-dashed rounded-xl p-8 text-center transition-all
                ${isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}
                ${isImporting ? "pointer-events-none opacity-50" : ""}
              `}
            >
              <input
                type="file"
                accept=".csv"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isImporting}
              />

              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h4 className="font-medium mb-1">{t("soils.details.import.dropCsv")}</h4>
              <p className="text-sm text-muted-foreground mb-2">
                {t("soils.details.import.orBrowse")}
              </p>

              {isImporting && (
                <div className="flex items-center justify-center gap-2 text-primary mt-2">
                  <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  <span className="text-sm">{t("soils.details.import.importingShort")}</span>
                </div>
              )}
            </div>

            <div className="bg-muted/50 rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    {t("soils.details.import.requirementsTitle")}
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
                    <li>{t("soils.details.import.requirement.depth")}</li>
                    <li>{t("soils.details.import.requirement.required")}</li>
                    <li>{t("soils.details.import.requirement.optional")}</li>
                    <li>{t("soils.details.import.requirement.headers")}</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={downloadTemplate}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-card border border-border rounded-lg hover:bg-muted transition-all text-sm"
              >
                <FileText className="w-4 h-4" />
                <span>{t("soils.details.import.downloadTemplate")}</span>
              </button>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-border rounded-xl hover:bg-muted transition-all"
              >
                {t("common.cancel")}
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  children?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action, children }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon className="w-12 h-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-lg"
        >
          {action.label}
        </button>
      )}
      {children}
    </motion.div>
  );
}
