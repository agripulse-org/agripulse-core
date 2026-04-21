import { useClerk, useUser } from "@clerk/clerk-react";
import { createFileRoute } from "@tanstack/react-router";
import { useLanguage } from "@/providers/language-provider";
import { Globe, ShieldAlert } from "lucide-react";
import { ProfilePersonalInfoSection } from "@/components/profile/ProfilePersonalInfoSection";
import { motion } from "motion/react";
import { ProfileDeleteAccountSection } from "@/components/profile/ProfileDeleteAccountSection";

export const Route = createFileRoute("/(app)/profile")({
  component: ProfileRoute,
});

function ProfileRoute() {
  const { isLoaded, isSignedIn } = useUser();
  const { openUserProfile } = useClerk();
  const { language, setLanguage } = useLanguage();

  if (!isLoaded) {
    return (
      <div className="p-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <p className="text-muted-foreground">Loading profile...</p>
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
        <h1 className="text-3xl mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account information and preferences</p>
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
            Security
          </h2>

          <p className="text-muted-foreground">
            Account settings to manage email addresses, password, active sessions, and other
            security options.
          </p>

          <button
            type="button"
            onClick={() => openUserProfile()}
            className="mt-4 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-all"
          >
            Manage Email, Password, and Security
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
            Preferences
          </h2>

          <div>
            <label className="block text-sm mb-2">Language</label>
            <div className="flex gap-3">
              <button
                onClick={() => setLanguage("en")}
                className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all ${
                  language === "en"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage("mk")}
                className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all ${
                  language === "mk"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                Македонски
              </button>
            </div>
          </div>
        </motion.section>

        <ProfileDeleteAccountSection />
      </div>
    </div>
  );
}
