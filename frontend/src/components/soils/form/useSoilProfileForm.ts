import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const coordinateSchema = (fieldLabel: string, min: number, max: number) =>
  z
    .string()
    .trim()
    .min(1, `${fieldLabel} is required`)
    .refine((value) => {
      const parsedValue = Number(value);
      return Number.isFinite(parsedValue) && parsedValue >= min && parsedValue <= max;
    }, `${fieldLabel} must be between ${min} and ${max}`);

export const soilProfileFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(255, "Name must not exceed 255 characters"),
  description: z
    .string()
    .trim()
    .max(1000, "Description must not exceed 1000 characters")
    .optional()
    .or(z.literal("")),
  latitude: coordinateSchema("Latitude", -90, 90),
  longitude: coordinateSchema("Longitude", -180, 180),
});

export type SoilProfileFormValues = z.infer<typeof soilProfileFormSchema>;

export function useSoilProfileForm(initialValues?: SoilProfileFormValues) {
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
