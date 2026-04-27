import { useClerk, useUser } from "@clerk/clerk-react";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function ProfileDeleteAccountSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteAccount = async () => {
    if (!user) {
      return;
    }

    setIsDeleting(true);

    try {
      await user.delete();
      await signOut();
      toast.success(t("profile.delete.success"));
      navigate({ to: "/auth/register" });
    } catch {
      toast.error(t("profile.delete.securityVerificationRequired"));
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-destructive/5 border border-destructive/30 rounded-2xl p-6"
      >
        <h2 className="text-xl mb-2 text-destructive flex items-center gap-2">
          <Trash2 className="w-5 h-5" />
          {t("profile.delete.dangerZoneTitle")}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t("profile.delete.dangerZoneDescription")}
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-4 py-2 border border-destructive text-destructive rounded-lg hover:bg-destructive hover:text-destructive-foreground transition-all"
        >
          {t("profile.delete.deleteAccount")}
        </button>
      </motion.section>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl mb-4 text-destructive">{t("profile.delete.confirmTitle")}</h3>
            <p className="text-muted-foreground mb-6">{t("profile.delete.confirmDescription")}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-all"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-all"
              >
                {isDeleting ? t("common.deleting") : t("profile.delete.deleteForever")}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
