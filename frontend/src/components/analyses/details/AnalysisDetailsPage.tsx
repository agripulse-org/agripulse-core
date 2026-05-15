import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  getSoilAnalysisQueryOptions,
  useExportAnalysisPDFMutation,
  useDeleteSoilAnalysis,
} from "@/data/soilAnalysis";
import { getSoilProfileByIdQueryOptions } from "@/data/soilProfile";
import { downloadBlob } from "@/lib/file";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { AnalysisDetailsContent } from "@/components/analyses/details/AnalysisDetailsContent";
import { AnalysisDetailsHeader } from "./AnalysisDetailsHeader";

interface AnalysisDetailsPageProps {
  soilId: string;
  analysisId: string;
}

export function AnalysisDetailsPage({ soilId, analysisId }: AnalysisDetailsPageProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: analysis } = useSuspenseQuery(getSoilAnalysisQueryOptions(soilId, analysisId));
  const { data: soil } = useSuspenseQuery(getSoilProfileByIdQueryOptions(soilId));

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const exportPDFMutation = useExportAnalysisPDFMutation();
  const deleteAnalysisMutation = useDeleteSoilAnalysis();

  const handleDelete = () => {
    const toastId = toast.loading(t("analysis.details.deleting"));
    deleteAnalysisMutation.mutate(
      { soilProfileId: soilId, analysisId },
      {
        onSuccess: () => {
          toast.success(t("analysis.details.deleted"), { id: toastId });
          navigate({ to: "/soils/$soilId", params: { soilId } });
        },
        onError: () => {
          setShowDeleteModal(false);
          toast.error(t("analysis.details.deleteError"), { id: toastId });
        },
      },
    );
  };

  const handleDownloadPDF = () => {
    const loadingToastId = toast.loading(t("analysis.details.downloading"));
    exportPDFMutation.mutate(
      { soilProfileId: soilId, analysisId },
      {
        onSuccess: (blob) => {
          downloadBlob(blob, `analysis-${analysisId}.pdf`);
          toast.success(t("analysis.details.downloaded"), { id: loadingToastId });
        },
        onError: () => toast.error(t("analysis.details.downloadError"), { id: loadingToastId }),
      },
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <AnalysisDetailsHeader
        soil={soil}
        analysis={analysis}
        isDownloading={exportPDFMutation.isPending}
        onDownloadClick={handleDownloadPDF}
        onBackClick={() => navigate({ to: "/soils/$soilId", params: { soilId } })}
        onDeleteClick={() => setShowDeleteModal(true)}
      />

      <AnalysisDetailsContent analysis={analysis} />

      <ConfirmDialog
        item={showDeleteModal ? analysisId : null}
        open={showDeleteModal}
        onOpenChange={(open) => !open && setShowDeleteModal(false)}
        title={t("analysis.details.confirmDeletionTitle")}
        description={() => t("analysis.details.confirmDeletionDescription")}
        confirmLabel={t("common.delete")}
        onConfirm={handleDelete}
      />
    </div>
  );
}
