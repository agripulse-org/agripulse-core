import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCreateSoilProfile } from "@/data/soilProfile";
import { geocodingService } from "@/services/geocoding";
import { useLanguage } from "@/providers/language-provider";
import { toast } from "sonner";
import { SoilProfileCreateForm } from "@/components/soils/form/SoilProfileCreateForm";
import type { SoilProfileFormValues } from "@/components/soils/form/useSoilProfileForm";

export const Route = createFileRoute("/(app)/soils/create")({
  component: CreateSoilProfileRoute,
});

function CreateSoilProfileRoute() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const createSoilProfileMutation = useCreateSoilProfile();

  const handleSubmit = async (values: SoilProfileFormValues) => {
    const resolvedLocation = await geocodingService.reverseGeocodeLocation(
      Number(values.latitude),
      Number(values.longitude),
    );

    await createSoilProfileMutation.mutateAsync({
      name: values.name.trim(),
      description: values.description?.trim() || undefined,
      latitude: Number(values.latitude),
      longitude: Number(values.longitude),
      city: resolvedLocation?.city.trim() || "",
      country: resolvedLocation?.country.trim() || "",
    });

    toast.success(t("soils.createSuccess"));
    navigate({ to: "/soils" });
  };

  return (
    <SoilProfileCreateForm
      onSubmit={handleSubmit}
      onCancel={() => navigate({ to: "/soils" })}
      isSubmitting={createSoilProfileMutation.isPending}
    />
  );
}
