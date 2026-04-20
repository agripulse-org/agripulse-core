import { useLanguage } from "@/providers/language-provider";
import { Outlet, useRouterState } from "@tanstack/react-router";
import { Sprout, Globe } from "lucide-react";
import { motion } from "motion/react";

export function AuthLayout() {
  const { t, language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "mk" : "en");
  };

  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  return (
    <div className="min-h-screen flex bg-background">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-secondary p-12 flex-col justify-between relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 text-white">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Sprout className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl">AgriPulse</h1>
              <p className="text-white/80 text-sm">Smart Agriculture Platform</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl text-white leading-tight">{t("auth.tagline")}</h2>
          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex-1">
              <div className="text-3xl mb-2">🌱</div>
              <p className="text-white/90 text-sm">Data-driven insights</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex-1">
              <div className="text-3xl mb-2">🌾</div>
              <p className="text-white/90 text-sm">Crop recommendations</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex-1">
              <div className="text-3xl mb-2">📊</div>
              <p className="text-white/90 text-sm">Soil analysis</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex-1 flex items-center justify-center p-8 relative">
        <button
          onClick={toggleLanguage}
          className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-all"
        >
          <Globe className="w-4 h-4" />
          <span>{language === "en" ? "MK" : "EN"}</span>
        </button>

        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
