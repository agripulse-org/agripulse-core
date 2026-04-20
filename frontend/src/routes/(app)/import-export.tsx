import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Upload, Download, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { IMPORT_ANALYSES_CSV_CONTENT, IMPORT_TEMPLATE_CSV_CONTENT } from "@/lib/constants";
import type { ImportUploadStatus } from "@/lib/constants";

export const Route = createFileRoute("/(app)/import-export")({
  component: ImportExportRoute,
});

function ImportExportRoute() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<ImportUploadStatus>("idle");

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
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const csvFile = files.find((f) => f.name.endsWith(".csv"));

    if (csvFile) {
      toast.loading("Importing soil data...");
      setTimeout(() => {
        setUploadStatus("success");
        toast.dismiss();
        toast.success(`Successfully imported data from ${csvFile.name}`);
        setTimeout(() => setUploadStatus("idle"), 3000);
      }, 1500);
    } else {
      setUploadStatus("error");
      toast.error("Please upload a valid CSV file");
      setTimeout(() => setUploadStatus("idle"), 3000);
    }
  };

  const handleExportAllAnalyses = () => {
    const blob = new Blob([IMPORT_ANALYSES_CSV_CONTENT], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "soil-analyses.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Analyses exported successfully");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Import & Export</h1>
        <p className="text-muted-foreground">Manage your soil data with CSV import and export</p>
      </div>

      <div className="space-y-6">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <h2 className="text-xl mb-6 flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            Export Data
          </h2>

          <div className="space-y-4">
            <div className="bg-muted/50 rounded-xl p-4 border border-border">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-medium mb-1">Export All Analyses</h3>
                  <p className="text-sm text-muted-foreground">
                    Download all your soil analyses as a CSV file
                  </p>
                </div>
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <button
                onClick={handleExportAllAnalyses}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download CSV</span>
              </button>
            </div>

            <div className="bg-muted/50 rounded-xl p-4 border border-border">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-medium mb-1">Export Analysis Templates</h3>
                  <p className="text-sm text-muted-foreground">
                    Download a CSV template for bulk soil data import
                  </p>
                </div>
                <FileText className="w-8 h-8 text-secondary" />
              </div>
              <button
                onClick={() => {
                  const blob = new Blob([IMPORT_TEMPLATE_CSV_CONTENT], { type: "text/csv" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "soil-analysis-template.csv";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-border rounded-lg hover:bg-muted transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Template</span>
              </button>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <h2 className="text-xl mb-6 flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Import Data
          </h2>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative border-2 border-dashed rounded-xl p-12 text-center transition-all
              ${
                isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }
            `}
          >
            <input
              type="file"
              accept=".csv"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <div className="pointer-events-none">
              {uploadStatus === "idle" && (
                <>
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg mb-2">Drop CSV file here</h3>
                  <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                  <p className="text-xs text-muted-foreground">
                    Supports: .csv files with soil analysis data
                  </p>
                </>
              )}

              {uploadStatus === "success" && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg text-primary mb-2">Upload Successful!</h3>
                  <p className="text-sm text-muted-foreground">Your soil data has been imported</p>
                </motion.div>
              )}

              {uploadStatus === "error" && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                  <h3 className="text-lg text-destructive mb-2">Upload Failed</h3>
                  <p className="text-sm text-muted-foreground">Please upload a valid CSV file</p>
                </motion.div>
              )}
            </div>
          </div>

          <div className="mt-6 bg-accent/10 border border-accent/30 rounded-xl p-4">
            <h4 className="font-medium mb-2 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4" />
              CSV Format Requirements
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1 ml-6 list-disc">
              <li>First row must contain column headers</li>
              <li>Required columns: Location, Depth, pH</li>
              <li>Optional columns: Latitude, Longitude, Nitrogen, Organic Carbon, Texture</li>
              <li>Use comma (,) as separator</li>
              <li>Maximum file size: 10MB</li>
            </ul>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
