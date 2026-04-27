import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Plus, MapPin, Edit, Trash2, Layers, FlaskConical } from "lucide-react";
import { motion } from "motion/react";
import { EmptyState } from "@/components/EmptyState";
import ConfirmDialog from "@/components/ConfirmDialog";
import { getSoilProfilesQueryOptions, useDeleteSoilProfile } from "@/data/soilProfile";

export const Route = createFileRoute("/(app)/soils/")({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(getSoilProfilesQueryOptions()),
  component: SoilsRoute,
});

function SoilsRoute() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: soils } = useSuspenseQuery(getSoilProfilesQueryOptions());
  const [deletingSoilProfile, setDeletingSoilProfile] = useState<(typeof soils)[number] | null>(
    null,
  );
  const deleteSoilProfileMutation = useDeleteSoilProfile();

  const handleCreate = () => {
    navigate({ to: "/soils/create" });
  };

  const handleEdit = (soilId: string) => {
    navigate({ to: "/soils/$soilId/edit", params: { soilId } });
  };

  const handleOpenDetails = (soilId: string) => {
    navigate({ to: "/soils/$soilId", params: { soilId } });
  };

  const handleDelete = (soil: (typeof soils)[number]) => {
    setDeletingSoilProfile(soil);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl mb-2">{t("soils.title")}</h1>
          <p className="text-muted-foreground">{t("soils.manageDescription")}</p>
        </div>
        <button
          onClick={handleCreate}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>{t("soils.add")}</span>
        </button>
      </div>

      {soils.length === 0 ? (
        <EmptyState icon={Layers} title={t("soils.noSoils")} description={t("soils.addFirst")} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {soils.map((soil, index) => {
            const locationParts = [soil.city, soil.country].filter((value): value is string =>
              Boolean(value),
            );
            const locationLabel =
              locationParts.length > 0 ? locationParts.join(", ") : t("soils.unknownLocation");

            return (
              <motion.div
                key={soil.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => handleOpenDetails(soil.id)}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all group cursor-pointer"
              >
                <div className="mb-4">
                  <h3 className="text-xl mb-2">{soil.name}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{locationLabel}</span>
                  </div>
                  {soil.description && (
                    <p className="text-sm text-muted-foreground">{soil.description}</p>
                  )}
                </div>

                <div className="mb-4 pb-4 border-b border-border">
                  <p className="text-xs text-muted-foreground">{t("soils.lastAnalysis")}</p>
                  <p className="text-sm">{t("soils.never")}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate({ to: "/analysis/create" });
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
                  >
                    <FlaskConical className="w-4 h-4" />
                    <span>{t("soils.analyze")}</span>
                  </button>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      handleEdit(soil.id);
                    }}
                    className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-all"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDelete(soil);
                    }}
                    className="px-4 py-2 border border-destructive text-destructive rounded-lg hover:bg-destructive/10 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        item={deletingSoilProfile}
        open={!!deletingSoilProfile}
        onOpenChange={(open) => !open && setDeletingSoilProfile(null)}
        title={t("soils.deleteConfirmTitle")}
        description={(soil) => t("soils.deleteConfirmDescription", { name: soil?.name })}
        confirmLabel={t("soils.delete")}
        onConfirm={(soil) => {
          deleteSoilProfileMutation.mutate(soil.id, {
            onSuccess: () => {
              setDeletingSoilProfile(null);
            },
          });
        }}
      />
    </div>
  );
}
