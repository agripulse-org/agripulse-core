import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Upload, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { ANALYSIS_DEPTH_OPTIONS, SOIL_ANALYSIS_CSV_TEMPLATE } from "@/lib/constants";
import { useCreateSoilAnalysis, useUploadSoilAnalysisCSV } from "@/data/soilAnalysis";
import { downloadBlob } from "@/lib/file";
import type { AnalysisSoilDepth } from "@/services/soil-analysis/models";

interface NewAnalysisModalProps {
  soilId: string;
  onClose: () => void;
  onImportSuccess: () => void;
}

export function NewAnalysisModal({ soilId, onClose, onImportSuccess }: NewAnalysisModalProps) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<"auto" | "import">("auto");

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <h3 className="text-xl mb-6">{t("soils.details.createAnalysis")}</h3>

        <div className="flex gap-2 mb-6 p-1 bg-muted rounded-xl">
          <button
            onClick={() => setMode("auto")}
            className={cn(
              "flex-1 px-4 py-2 rounded-lg transition-all",
              mode === "auto"
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t("soils.details.analysis.autoLoad")}
          </button>
          <button
            onClick={() => setMode("import")}
            className={cn(
              "flex-1 px-4 py-2 rounded-lg transition-all",
              mode === "import"
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t("soils.details.import.fromCsv")}
          </button>
        </div>

        {mode === "auto" && <AutoLoadTab soilId={soilId} onClose={onClose} />}
        {mode === "import" && (
          <ImportCsvTab soilId={soilId} onClose={onClose} onSuccess={onImportSuccess} />
        )}
      </motion.div>
    </div>
  );
}

interface AutoLoadTabProps {
  soilId: string;
  onClose: () => void;
}

function AutoLoadTab({ soilId, onClose }: AutoLoadTabProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [selectedDepth, setSelectedDepth] = useState<AnalysisSoilDepth | "">("");
  const createMutation = useCreateSoilAnalysis();

  const handleCreate = () => {
    if (!selectedDepth) return;

    createMutation.mutate(
      { soilProfileId: soilId, request: { soilDepth: selectedDepth } },
      {
        onSuccess: (analysis) => {
          onClose();
          navigate({
            to: "/soils/$soilId/analyses/$analysisId",
            params: { soilId, analysisId: analysis.id },
          });
        },
        onError: () => {
          toast.error(t("common.unexpectedError"));
        },
      },
    );
  };

  return (
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
          className={cn(
            "w-full p-4 rounded-xl border-2 transition-all text-left",
            selectedDepth === option.value
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50",
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{option.label}</div>
              <div className="text-sm text-muted-foreground">{t(option.descriptionKey)}</div>
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
          onClick={handleCreate}
          disabled={!selectedDepth || createMutation.isPending}
          className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 shadow-lg"
        >
          {createMutation.isPending ? t("common.loading") : t("soils.details.createAnalysis")}
        </button>
      </div>
    </motion.div>
  );
}

interface ImportCsvTabProps {
  soilId: string;
  onClose: () => void;
  onSuccess: () => void;
}

function ImportCsvTab({ soilId, onClose, onSuccess }: ImportCsvTabProps) {
  const { t } = useTranslation();

  const [isDragging, setIsDragging] = useState(false);
  const uploadMutation = useUploadSoilAnalysisCSV();

  const handleFiles = (files: File[]) => {
    const csvFile = files.find((f) => f.name.endsWith(".csv"));
    if (!csvFile) {
      toast.error(t("soils.details.import.invalidCsv"));
      return;
    }

    uploadMutation.mutate(
      { soilProfileId: soilId, file: csvFile },
      {
        onSuccess: () => {
          toast.success(t("soils.details.import.parametersImported"));
          onSuccess();
        },
        onError: () => {
          toast.error(t("common.unexpectedError"));
        },
      },
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(Array.from(e.target.files));
  };

  const downloadTemplate = () => {
    const blob = new Blob([SOIL_ANALYSIS_CSV_TEMPLATE], { type: "text/csv" });
    downloadBlob(blob, "soil-parameters-template.csv");
    toast.success(t("soils.details.import.templateDownloaded"));
  };

  return (
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
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 text-center transition-all",
          isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
          uploadMutation.isPending && "pointer-events-none opacity-50",
        )}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploadMutation.isPending}
        />

        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <h4 className="font-medium mb-1">{t("soils.details.import.dropCsv")}</h4>
        <p className="text-sm text-muted-foreground mb-2">{t("soils.details.import.orBrowse")}</p>

        {uploadMutation.isPending && (
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
  );
}
