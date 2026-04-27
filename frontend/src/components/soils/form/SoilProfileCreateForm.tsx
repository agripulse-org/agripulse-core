import { ArrowLeft, ArrowRight, Loader2, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SoilLocationPicker } from "./SoilLocationPicker";
import { useSoilProfileForm } from "./useSoilProfileForm";
import type { SoilProfileFormValues } from "./useSoilProfileForm";

type SoilProfileCreateFormProps = {
  isSubmitting?: boolean;
  onSubmit: (values: SoilProfileFormValues) => Promise<void> | void;
  onCancel: () => void;
};

export function SoilProfileCreateForm({
  isSubmitting = false,
  onSubmit,
  onCancel,
}: SoilProfileCreateFormProps) {
  const { t } = useTranslation();

  const [step, setStep] = useState(1);
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    latitude,
    longitude,
    hasCoordinates,
    setCoordinates,
  } = useSoilProfileForm();

  const handleNext = async () => {
    const isStepValid = await trigger(["latitude", "longitude"]);

    if (isStepValid) {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 1) {
      onCancel();
      return;
    }

    setStep(1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-muted/20 to-background p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
      >
        <div className="bg-linear-to-r from-primary to-secondary p-8 text-primary-foreground">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-3xl font-medium">{t("soils.newProfileTitle")}</h1>
              <p className="mt-2 max-w-2xl text-sm text-primary-foreground/80">
                {t("soils.stepLocationDescription")}
              </p>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            {[1, 2].map((currentStep) => (
              <div
                key={currentStep}
                className={`h-2 flex-1 rounded-full transition-all ${
                  currentStep <= step ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.section
                  key="soil-location-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl">{t("soils.stepLocation")}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {t("soils.stepLocationDescription")}
                    </p>
                  </div>

                  <SoilLocationPicker
                    latitude={latitude}
                    longitude={longitude}
                    onChange={({ latitude: nextLatitude, longitude: nextLongitude }) => {
                      setCoordinates(nextLatitude, nextLongitude);
                    }}
                  />

                  {(errors.latitude?.message || errors.longitude?.message) && (
                    <div className="space-y-1 text-sm text-destructive">
                      {errors.latitude?.message && <p>{errors.latitude.message}</p>}
                      {errors.longitude?.message && <p>{errors.longitude.message}</p>}
                    </div>
                  )}
                </motion.section>
              )}

              {step === 2 && (
                <motion.section
                  key="soil-details-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl">{t("soils.stepDetails")}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {t("soils.stepDetailsDescription")}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm text-foreground">
                        {t("soils.name")}
                      </label>
                      <input
                        type="text"
                        {...register("name")}
                        className="w-full rounded-xl border border-border bg-input-background px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      {errors.name?.message && (
                        <p className="mt-2 text-sm text-destructive">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-foreground">
                        {t("soils.description")}
                      </label>
                      <textarea
                        rows={5}
                        {...register("description")}
                        placeholder={t("soils.descriptionPlaceholder")}
                        className="w-full resize-none rounded-xl border border-border bg-input-background px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      {errors.description?.message && (
                        <p className="mt-2 text-sm text-destructive">
                          {errors.description.message}
                        </p>
                      )}
                    </div>

                    <div className="rounded-2xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2 text-foreground">
                        <Search className="h-4 w-4" />
                        <span>{t("soils.summaryTitle")}</span>
                      </div>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">
                            {t("soils.latitude")}
                          </p>
                          <p className="mt-1 text-foreground">{latitude || "-"}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">
                            {t("soils.longitude")}
                          </p>
                          <p className="mt-1 text-foreground">{longitude || "-"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>

          <div className="border-t border-border p-6 sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 transition-all hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{step === 1 ? t("common.cancel") : t("soils.back")}</span>
              </button>

              <div className="text-sm text-muted-foreground">
                {t("soils.stepProgress", { step, totalSteps: 2 })}
              </div>

              {step === 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!hasCoordinates || isSubmitting}
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-primary-foreground shadow-lg transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span>{t("soils.next")}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-primary-foreground shadow-lg transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{t("common.loading")}</span>
                    </>
                  ) : (
                    <span>{t("soils.create")}</span>
                  )}
                  {!isSubmitting && <ArrowRight className="h-4 w-4" />}
                </button>
              )}
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
