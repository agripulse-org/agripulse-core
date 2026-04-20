import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useLanguage } from "@/providers/language-provider";
import { MapPin, Search, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ANALYSIS_DEPTH_OPTIONS } from "@/lib/constants";

export const Route = createFileRoute("/(app)/analysis/create")({
  component: NewAnalysisRoute,
});

function NewAnalysisRoute() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [formData, setFormData] = useState({
    location: "",
    latitude: "",
    longitude: "",
    soilName: "",
    description: "",
    depth: "",
  });

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleStartAnalysis();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      navigate({
        to: "/analysis/$id",
        params: { id: "new" },
      });
    }, 2500);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.location || (formData.latitude && formData.longitude);
      case 2:
        return formData.soilName;
      case 3:
        return formData.depth;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-background via-muted/20 to-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-card border border-border rounded-3xl shadow-xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-primary to-secondary p-8 text-white">
          <h1 className="text-3xl mb-2">{t("analysis.new.title")}</h1>
          <p className="text-white/80">
            Follow the steps to analyze your soil and get personalized recommendations
          </p>

          <div className="mt-6 flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full transition-all ${
                  s <= step ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl mb-6">{t("analysis.new.step1")}</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2">
                        {t("analysis.new.searchLocation")}
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder="e.g., Skopje, North Macedonia"
                          className="w-full pl-11 pr-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-card text-muted-foreground">
                          {t("analysis.new.orCoordinates")}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-2">{t("analysis.new.latitude")}</label>
                        <input
                          type="number"
                          step="any"
                          value={formData.latitude}
                          onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                          placeholder="41.9973"
                          className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2">{t("analysis.new.longitude")}</label>
                        <input
                          type="number"
                          step="any"
                          value={formData.longitude}
                          onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                          placeholder="21.4280"
                          className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                    </div>

                    <div className="aspect-video bg-muted rounded-xl flex items-center justify-center border border-border">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Map preview</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-xl mb-6">{t("analysis.new.step2")}</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2">{t("analysis.new.soilName")}</label>
                    <input
                      type="text"
                      value={formData.soilName}
                      onChange={(e) => setFormData({ ...formData, soilName: e.target.value })}
                      placeholder="e.g., North Field"
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">{t("analysis.new.description")}</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Add notes about this soil sample..."
                      rows={4}
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-xl mb-6">{t("analysis.new.selectDepth")}</h3>

                <div className="space-y-3">
                  {ANALYSIS_DEPTH_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFormData({ ...formData, depth: option.value })}
                      className={`
                        w-full p-4 rounded-xl border-2 transition-all text-left
                        ${
                          formData.depth === option.value
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
                        {formData.depth === option.value && (
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-xl mb-6">Review & Analyze</h3>

                <div className="space-y-4 bg-muted/50 rounded-xl p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Location</p>
                      <p className="font-medium">
                        {formData.location || `${formData.latitude}, ${formData.longitude}`}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Depth</p>
                      <p className="font-medium">
                        {ANALYSIS_DEPTH_OPTIONS.find((d) => d.value === formData.depth)?.label}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Soil Name</p>
                      <p className="font-medium">{formData.soilName}</p>
                    </div>
                    {formData.description && (
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground mb-1">Description</p>
                        <p className="font-medium">{formData.description}</p>
                      </div>
                    )}
                  </div>
                </div>

                {isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-primary/10 border border-primary/20 rounded-xl p-6 text-center"
                  >
                    <Loader2 className="w-8 h-8 text-primary mx-auto mb-3 animate-spin" />
                    <p className="text-primary">{t("analysis.new.analyzing")}</p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-8 border-t border-border flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border hover:bg-muted transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t("analysis.new.previous")}</span>
          </button>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Step {step} of 4</span>
          </div>

          <button
            onClick={handleNext}
            disabled={!canProceed() || isAnalyzing}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <span>{step === 4 ? t("analysis.new.startAnalysis") : t("analysis.new.next")}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
