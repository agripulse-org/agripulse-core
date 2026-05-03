import { useState } from "react";
import { X, Layers, FlaskConical } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

type ContextType = "none" | "soil" | "analysis";

interface NewConversationDialogProps {
  onClose: () => void;
  onCreate: (soilProfileId?: string) => void;
  availableSoils?: Array<{ id: string; name: string }>;
  preselectedSoilId?: string;
}

export function NewConversationDialog({
  onClose,
  onCreate,
  availableSoils = [],
  preselectedSoilId,
}: NewConversationDialogProps) {
  const { t } = useTranslation();
  const [contextType, setContextType] = useState<ContextType>(preselectedSoilId ? "soil" : "none");
  const [selectedId, setSelectedId] = useState<string>(preselectedSoilId ?? "");

  const handleCreate = () => {
    if (contextType === "soil" && selectedId) {
      onCreate(selectedId);
    } else {
      onCreate();
    }
  };

  const canCreate = contextType === "none" || selectedId !== "";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-2xl p-6 max-w-md w-full"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl">{t("chat.newConversation")}</h3>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-3">{t("chat.contextOptional")}</label>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setContextType("none");
                  setSelectedId("");
                }}
                disabled={!!preselectedSoilId}
                className={`
                  w-full p-3 rounded-xl border-2 transition-all text-left
                  ${
                    contextType === "none"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }
                  ${preselectedSoilId ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                <div className="font-medium text-sm">{t("chat.generalConversation")}</div>
                <div className="text-xs text-muted-foreground">{t("chat.noSpecificContext")}</div>
              </button>

              <button
                onClick={() => setContextType("soil")}
                disabled={!preselectedSoilId && availableSoils.length === 0}
                className={`
                  w-full p-3 rounded-xl border-2 transition-all text-left
                  ${
                    contextType === "soil"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }
                  ${availableSoils.length === 0 && !preselectedSoilId ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  <div className="font-medium text-sm">{t("chat.soilProfile")}</div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {availableSoils.length > 0 || preselectedSoilId
                    ? t("chat.soilProfileContextHint")
                    : t("chat.noSoilProfilesAvailable")}
                </div>
              </button>

              {/* Analysis */}
              <div
                title={t("chat.comingSoon")}
                className="w-full p-3 rounded-xl border-2 border-border opacity-50 cursor-not-allowed text-left"
              >
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-4 h-4" />
                  <div className="font-medium text-sm">{t("chat.analysisContext")}</div>
                </div>
                <div className="text-xs text-muted-foreground">{t("chat.comingSoon")}</div>
              </div>
            </div>
          </div>

          {contextType === "soil" && availableSoils.length > 0 && !preselectedSoilId && (
            <div>
              <label className="block text-sm mb-2">{t("chat.selectSoilProfile")}</label>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">{t("chat.chooseSoil")}</option>
                {availableSoils.map((soil) => (
                  <option key={soil.id} value={soil.id}>
                    {soil.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-border rounded-xl hover:bg-muted transition-all"
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={handleCreate}
            disabled={!canCreate}
            className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 shadow-lg"
          >
            {t("common.create")}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
