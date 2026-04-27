import { ArrowLeft, ArrowRight, Loader2, PencilLine } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { SoilLocationPicker } from "./SoilLocationPicker";
import { useSoilProfileForm } from "./useSoilProfileForm";
import type { SoilProfileFormValues } from "./useSoilProfileForm";

type SoilProfileEditFormProps = {
  initialValues: SoilProfileFormValues;
  isSubmitting?: boolean;
  onSubmit: (values: SoilProfileFormValues) => Promise<void> | void;
  onCancel: () => void;
};

export function SoilProfileEditForm({
  initialValues,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: SoilProfileEditFormProps) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    latitude,
    longitude,
    setCoordinates,
  } = useSoilProfileForm(initialValues);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-muted/20 to-background p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full max-w-4xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
      >
        {/* Header */}
        <div className="bg-linear-to-r from-primary to-secondary p-6 sm:p-8 text-primary-foreground">
          <div className="flex items-center gap-4">
            <div className="shrink-0 rounded-2xl bg-white/15 p-3">
              <PencilLine className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-medium leading-tight">
                {t("soils.editProfileTitle")}
              </h1>
              <p className="mt-1 text-sm text-primary-foreground/75">
                {t("soils.stepDetailsDescription")}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="p-6 sm:p-8">
            {/* Two-column layout on md+, stacks on mobile */}
            <div className="flex flex-col gap-6 md:flex-row md:items-stretch">
              {/* Left: Location */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col gap-4 md:flex-[1.2]"
              >
                <div>
                  <h2 className="text-2xl">{t("soils.stepLocation")}</h2>
                  <p className="mt-1.5 text-sm text-muted-foreground">
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
                  <div className="space-y-1 text-xs text-destructive">
                    {errors.latitude?.message && <p>{errors.latitude.message}</p>}
                    {errors.longitude?.message && <p>{errors.longitude.message}</p>}
                  </div>
                )}
              </motion.div>

              <div className="hidden md:block w-px bg-border self-stretch" />
              <div className="block md:hidden h-px bg-border" />

              {/* Right: Name + Description */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="flex flex-col gap-5 md:flex-1"
              >
                <div>
                  <h2 className="text-2xl">{t("soils.stepDetails")}</h2>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {t("soils.stepDetailsDescription")}
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    {t("soils.name")}
                  </label>
                  <input
                    type="text"
                    {...register("name")}
                    className="w-full rounded-xl border border-border bg-input-background px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
                  />
                  {errors.name?.message && (
                    <p className="mt-1.5 text-xs text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="flex flex-col flex-1">
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    {t("soils.description")}
                  </label>
                  <textarea
                    {...register("description")}
                    placeholder={t("soils.descriptionPlaceholder")}
                    className="flex-1 w-full min-h-45 resize-none rounded-xl border border-border bg-input-background px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
                  />
                  {errors.description?.message && (
                    <p className="mt-1.5 text-xs text-destructive">{errors.description.message}</p>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border bg-muted/30 px-6 py-5 sm:px-8">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={onCancel}
                className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-medium transition-all hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{t("common.cancel")}</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-md transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{t("common.loading")}</span>
                  </>
                ) : (
                  <>
                    <span>{t("soils.update")}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
