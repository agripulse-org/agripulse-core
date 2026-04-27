import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";

type SoilCoordinateLabelKey = "soils.latitude" | "soils.longitude";

const coordinateSchema = (
  t: ReturnType<typeof useTranslation>["t"],
  fieldLabelKey: SoilCoordinateLabelKey,
  min: number,
  max: number,
) =>
  z
    .string()
    .trim()
    .min(1, t("soils.validation.fieldRequired", { field: t(fieldLabelKey) }))
    .refine(
      (value) => {
        const parsedValue = Number(value);
        return Number.isFinite(parsedValue) && parsedValue >= min && parsedValue <= max;
      },
      t("soils.validation.fieldRange", { field: t(fieldLabelKey), min, max }),
    );

export const buildSoilProfileFormSchema = (t: TFunction) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(1, t("soils.validation.nameRequired"))
      .max(255, t("soils.validation.nameMax")),
    description: z
      .string()
      .trim()
      .max(1000, t("soils.validation.descriptionMax"))
      .optional()
      .or(z.literal("")),
    latitude: coordinateSchema(t, "soils.latitude", -90, 90),
    longitude: coordinateSchema(t, "soils.longitude", -180, 180),
  });

export type SoilProfileFormValues = z.infer<ReturnType<typeof buildSoilProfileFormSchema>>;

export function useSoilProfileForm(initialValues?: SoilProfileFormValues) {
  const { t } = useTranslation();

  const soilProfileFormSchema = useMemo(() => buildSoilProfileFormSchema(t), [t]);
  const form = useForm<SoilProfileFormValues>({
    resolver: zodResolver(soilProfileFormSchema),
    defaultValues: initialValues ?? {
      name: "",
      description: "",
      latitude: "",
      longitude: "",
    },
  });

  const { setValue, watch } = form;

  useEffect(() => {
    if (!initialValues) {
      return;
    }

    setValue("name", initialValues.name);
    setValue("description", initialValues.description ?? "");
    setValue("latitude", initialValues.latitude);
    setValue("longitude", initialValues.longitude);
  }, [initialValues, setValue]);

  const latitude = watch("latitude");
  const longitude = watch("longitude");
  const hasCoordinates = latitude.trim().length > 0 && longitude.trim().length > 0;

  const setCoordinates = (nextLatitude: string, nextLongitude: string) => {
    setValue("latitude", nextLatitude, { shouldDirty: true, shouldValidate: true });
    setValue("longitude", nextLongitude, { shouldDirty: true, shouldValidate: true });
  };

  return {
    ...form,
    latitude,
    longitude,
    hasCoordinates,
    setCoordinates,
  };
}
