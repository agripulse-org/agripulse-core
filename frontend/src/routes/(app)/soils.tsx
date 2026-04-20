import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useLanguage } from "@/providers/language-provider";
import { Plus, MapPin, Edit, Trash2, FlaskConical } from "lucide-react";
import { motion } from "motion/react";
import { EmptyState } from "@/components/EmptyState";
import { SOILS_MOCK_DATA } from "@/lib/constants";
import { toast } from "sonner";

export const Route = createFileRoute("/(app)/soils")({
  component: SoilsRoute,
});

function SoilsRoute() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [soils, setSoils] = useState(SOILS_MOCK_DATA);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      setSoils(soils.filter((s) => s.id !== id));
      toast.success("Soil deleted successfully");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl mb-2">{t("soils.title")}</h1>
          <p className="text-muted-foreground">Manage your saved soil locations and samples</p>
        </div>
        <button
          onClick={() => navigate({ to: "/analysis/create" })}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>{t("soils.add")}</span>
        </button>
      </div>

      {soils.length === 0 ? (
        <EmptyState
          icon={FlaskConical}
          title={t("soils.noSoils")}
          description={t("soils.addFirst")}
          action={{
            label: t("soils.add"),
            onClick: () => navigate({ to: "/analysis/create" }),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {soils.map((soil, index) => (
            <motion.div
              key={soil.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all group"
            >
              <div className="mb-4">
                <h3 className="text-xl mb-2">{soil.name}</h3>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{soil.location}</span>
                </div>
                {soil.description && (
                  <p className="text-sm text-muted-foreground">{soil.description}</p>
                )}
              </div>

              {soil.lastAnalysis && (
                <div className="mb-4 pb-4 border-b border-border">
                  <p className="text-xs text-muted-foreground">Last Analysis</p>
                  <p className="text-sm">{new Date(soil.lastAnalysis).toLocaleDateString()}</p>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => navigate({ to: "/analysis/create" })}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
                >
                  <FlaskConical className="w-4 h-4" />
                  <span>{t("soils.analyze")}</span>
                </button>
                <button
                  onClick={() => alert("Edit functionality would be implemented")}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-all"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(soil.id, soil.name)}
                  className="px-4 py-2 border border-destructive text-destructive rounded-lg hover:bg-destructive/10 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
