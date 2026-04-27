import { useClerk, useUser } from "@clerk/clerk-react";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Globe, ShieldAlert } from "lucide-react";
import { ProfilePersonalInfoSection } from "@/components/profile/ProfilePersonalInfoSection";
import { motion } from "motion/react";
import { ProfileDeleteAccountSection } from "@/components/profile/ProfileDeleteAccountSection";
import { isValidLanguageCode } from "@/i18n";

export const Route = createFileRoute("/(app)/profile")({
  component: ProfileRoute,
});

function ProfileRoute() {
  const { isLoaded, isSignedIn } = useUser();
  const { openUserProfile } = useClerk();
  const { t, i18n } = useTranslation();
  const language = isValidLanguageCode(i18n.resolvedLanguage) ? i18n.resolvedLanguage : "en";

  if (!isLoaded) {
    return (
      <div className="p-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <p className="text-muted-foreground">{t("profile.loadingProfile")}</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">{t("profile.settingsTitle")}</h1>
        <p className="text-muted-foreground">{t("profile.settingsSubtitle")}</p>
      </div>

      <div className="space-y-6">
        <ProfilePersonalInfoSection />

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <h2 className="text-xl mb-6 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" />
            {t("profile.securityTitle")}
          </h2>

          <p className="text-muted-foreground">{t("profile.securityDescription")}</p>

          <button
            type="button"
            onClick={() => openUserProfile()}
            className="mt-4 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-all"
          >
            {t("profile.manageSecurity")}
          </button>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <h2 className="text-xl mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            {t("profile.preferencesTitle")}
          </h2>

          <div>
            <label className="block text-sm mb-2">{t("profile.language")}</label>
            <div className="flex gap-3">
              <button
                onClick={() => void i18n.changeLanguage("en")}
                className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all ${
                  language === "en"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {t("profile.language.en")}
              </button>
              <button
                onClick={() => void i18n.changeLanguage("mk")}
                className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all ${
                  language === "mk"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {t("profile.language.mk")}
              </button>
            </div>
          </div>
        </motion.section>

        <ProfileDeleteAccountSection />
      </div>
    </div>
  );
}
