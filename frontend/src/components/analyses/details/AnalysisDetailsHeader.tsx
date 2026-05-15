import { useTranslation } from "react-i18next";
import { ArrowLeft, MapPin, Calendar, Layers, Download, Trash2 } from "lucide-react";
import { useFormatters } from "@/hooks/useFormatters";
import { getSoilDepthLabel } from "@/lib/constants";
import type { SoilAnalysis } from "@/services/soil-analysis/models";
import type { SoilProfileResponse } from "@/services/soil-profile";

interface AnalysisDetailsHeaderProps {
  soil: SoilProfileResponse;
  analysis: SoilAnalysis;
  isDownloading?: boolean;
  onBackClick?: () => void;
  onDownloadClick?: () => void;
  onDeleteClick?: () => void;
}

export function AnalysisDetailsHeader({
  soil,
  analysis,
  isDownloading,
  onBackClick,
  onDownloadClick,
  onDeleteClick,
}: AnalysisDetailsHeaderProps) {
  const { t } = useTranslation();
  const { dateTime } = useFormatters();

  const locationParts = [soil.city, soil.country].filter((v): v is string => Boolean(v));
  const locationLabel =
    locationParts.length > 0 ? locationParts.join(", ") : t("soils.unknownLocation");

  return (
    <div className="bg-linear-to-r from-primary to-secondary text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBackClick}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t("analysis.details.backToSoil")}</span>
        </button>

        <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl mb-4">{t("analysis.details.reportTitle")}</h1>
            <div className="flex flex-wrap gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{locationLabel}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{dateTime(analysis.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>{getSoilDepthLabel(analysis.soilDepth)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button
              onClick={onDownloadClick}
              disabled={isDownloading}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">{t("analysis.details.downloadPDF")}</span>
              <span className="sm:hidden">{t("analysis.details.downloadPDFShort")}</span>
            </button>

            <button
              onClick={onDeleteClick}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-destructive/20 backdrop-blur-sm hover:bg-destructive/30 rounded-lg transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span>{t("analysis.details.delete")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
