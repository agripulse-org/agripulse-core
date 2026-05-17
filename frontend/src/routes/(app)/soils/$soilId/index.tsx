import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  MapPin,
  Edit,
  Calendar,
  Layers,
  MessageSquare,
  FlaskConical,
  ChevronRight,
  StickyNote,
  Clock,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { getSoilProfileByIdQueryOptions } from "@/data/soilProfile";
import { getSoilAnalysesQueryOptions } from "@/data/soilAnalysis";
import { cn } from "@/lib/utils";
import { CROP_TYPE_MAP, getSoilDepthLabel } from "@/lib/constants";
import { APIError } from "@/services/apiClient";
import { SoilNotesTab } from "@/components/soils/details/SoilNotesTab";
import { SoilConversationsTab } from "@/components/soils/details/SoilConversationsTab";
import { SoilAnalysesTab } from "@/components/soils/details/SoilAnalysesTab";
import type { SoilAnalysis } from "@/services/soil-analysis/models";
import { useFormatters } from "@/hooks/useFormatters";

export const Route = createFileRoute("/(app)/soils/$soilId/")({
  loader: async ({ params, context: { queryClient } }) => {
    try {
      await Promise.all([
        queryClient.ensureQueryData(getSoilProfileByIdQueryOptions(params.soilId)),
        queryClient.ensureQueryData(getSoilAnalysesQueryOptions(params.soilId)),
      ]);
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
  const { date } = useFormatters();

  const { data: soil } = useSuspenseQuery(getSoilProfileByIdQueryOptions(id));
  const { data: analyses } = useSuspenseQuery(getSoilAnalysesQueryOptions(id));
  const [activeTab, setActiveTab] = useState<Tab>("overview");

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
                        {t("soils.details.created")} {date(soil.createdAt)}
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
                  className={cn(
                    "flex items-center gap-2 px-6 py-4 border-b-2 transition-all whitespace-nowrap",
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
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
              analyses={analyses}
              onViewAllAnalyses={() => setActiveTab("analyses")}
            />
          )}
          {activeTab === "analyses" && (
            <SoilAnalysesTab key="analyses" soilId={id} analyses={analyses} />
          )}
          {activeTab === "notes" && <SoilNotesTab key="notes" soilProfileId={id} />}
          {activeTab === "chat" && <SoilConversationsTab soilProfileId={id} />}
        </AnimatePresence>
      </div>
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
  analyses: SoilAnalysis[];
  onViewAllAnalyses: () => void;
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { date, percent } = useFormatters();

  const locationParts = [soil.city, soil.country].filter((value): value is string =>
    Boolean(value),
  );
  const locationLabel =
    locationParts.length > 0 ? locationParts.join(", ") : t("soils.unknownLocation");

  const sortedAnalyses = analyses
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const latestAnalysis = sortedAnalyses[0];
  const recentAnalyses = sortedAnalyses.slice(0, 3);

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
        <div
          className={cn(
            "bg-card border border-border rounded-xl p-6",
            analyses.length > 0 && "cursor-pointer hover:shadow-md transition-all",
          )}
          onClick={
            analyses.length > 0
              ? () =>
                  navigate({
                    to: "/soils/$soilId/analyses/$analysisId",
                    params: { soilId: soil.id, analysisId: latestAnalysis.id },
                  })
              : undefined
          }
        >
          <p className="text-sm text-muted-foreground mb-2">{t("soils.lastAnalysis")}</p>
          {analyses.length > 0 ? (
            <div className="space-y-1">
              <p className="text-lg">{getSoilDepthLabel(latestAnalysis.soilDepth)}</p>
              <p className="text-sm text-muted-foreground">{date(latestAnalysis.createdAt)}</p>
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

      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Analyses */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl">{t("soils.details.recentAnalyses")}</h2>
            <button onClick={onViewAllAnalyses} className="text-primary hover:underline text-sm">
              {t("soils.details.viewAll")}
            </button>
          </div>

          {recentAnalyses.length === 0 ? (
            <p className="text-muted-foreground text-sm">{t("dashboard.noAnalyses")}</p>
          ) : (
            recentAnalyses.map((analysis) => {
              const isPending = analysis.status === "PENDING";
              const isFailed = analysis.status === "FAILED";
              const topRec =
                !isPending && !isFailed ? (analysis.cropRecommendations ?? [])[0] : undefined;
              const cropMeta = topRec ? CROP_TYPE_MAP[topRec.crop] : undefined;

              return (
                <div
                  key={analysis.id}
                  onClick={() =>
                    navigate({
                      to: "/soils/$soilId/analyses/$analysisId",
                      params: { soilId: soil.id, analysisId: analysis.id },
                    })
                  }
                  className="flex items-center gap-3 p-4 rounded-xl hover:bg-muted/50 transition-all cursor-pointer mb-2 last:mb-0"
                >
                  <div
                    className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                      isPending
                        ? "bg-amber-500/10"
                        : isFailed
                          ? "bg-destructive/10"
                          : "bg-primary/10",
                    )}
                  >
                    {isPending ? (
                      <Clock className="w-4 h-4 text-amber-500" />
                    ) : isFailed ? (
                      <AlertCircle className="w-4 h-4 text-destructive" />
                    ) : (
                      <FlaskConical className="w-4 h-4 text-primary" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{getSoilDepthLabel(analysis.soilDepth)}</p>
                    <p className="text-sm text-muted-foreground">{date(analysis.createdAt)}</p>
                  </div>

                  {isFailed ? (
                    <p className="text-xs text-destructive font-medium shrink-0">
                      {t("analysis.status.FAILED")}
                    </p>
                  ) : topRec ? (
                    <div className="text-right shrink-0">
                      <p className="text-sm font-medium text-primary">
                        {percent(topRec.confidencePercentage)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {cropMeta ? t(cropMeta.nameKey) : topRec.crop}
                      </p>
                    </div>
                  ) : null}

                  <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                </div>
              );
            })
          )}
        </div>
      </div>
    </motion.div>
  );
}
