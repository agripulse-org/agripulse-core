import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { getSoilProfileByIdQueryOptions, useUpdateSoilProfile } from "@/data/soilProfile";
import { reverseGeocodeLocation } from "@/services/geocoding/geocodingService";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { SoilProfileEditForm } from "@/components/soils/form/SoilProfileEditForm";
import type { SoilProfileFormValues } from "@/components/soils/form/useSoilProfileForm";

export const Route = createFileRoute("/(app)/soils/$soilId/edit")({
  loader: ({ params, context: { queryClient } }) =>
    queryClient.ensureQueryData(getSoilProfileByIdQueryOptions(params.soilId)),
  component: EditSoilProfileRoute,
});

function EditSoilProfileRoute() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { soilId } = Route.useParams();
  const { data: soilProfile } = useSuspenseQuery(getSoilProfileByIdQueryOptions(soilId));
  const updateSoilProfileMutation = useUpdateSoilProfile();

  const handleSubmit = async (values: SoilProfileFormValues) => {
    const resolvedLocation = await reverseGeocodeLocation(
      Number(values.latitude),
      Number(values.longitude),
    );

    await updateSoilProfileMutation.mutateAsync({
      id: soilId,
      name: values.name.trim(),
      description: values.description?.trim() || undefined,
      latitude: Number(values.latitude),
      longitude: Number(values.longitude),
      city: resolvedLocation?.city || undefined,
      country: resolvedLocation?.country || undefined,
    });

    toast.success(t("soils.updateSuccess"));
    navigate({ to: "/soils" });
  };

  return (
    <SoilProfileEditForm
      initialValues={{
        name: soilProfile.name,
        description: soilProfile.description ?? "",
        latitude: String(soilProfile.latitude),
        longitude: String(soilProfile.longitude),
      }}
      onSubmit={handleSubmit}
      onCancel={() => navigate({ to: "/soils" })}
      isSubmitting={updateSoilProfileMutation.isPending}
    />
  );
}
