import { Outlet, Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import {
  Sprout,
  LayoutDashboard,
  Layers,
  MessageCircle,
  LogOut,
  Globe,
  Menu,
  X,
  StickyNote,
} from "lucide-react";
import { useState } from "react";
import { useClerk, useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import { Chatbot } from "../../Chatbot";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { isValidLanguageCode } from "@/i18n";

export function AppLayout() {
  const { t, i18n } = useTranslation();
  const { signOut } = useClerk();
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const profileDisplayName = getProfileDisplayName(user);
  const profileInitial = profileDisplayName.charAt(0).toUpperCase();

  const navItems = [
    { path: "/", icon: LayoutDashboard, label: t("nav.dashboard") },
    { path: "/soils", icon: Layers, label: t("nav.soils") },
    { path: "/notes", icon: StickyNote, label: t("nav.notes") },
  ];

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await signOut();
      navigate({ to: "/auth/login" });
    } catch {
      toast.error(t("common.unableToSignOut"));
    } finally {
      setIsLoggingOut(false);
    }
  };

  const language = isValidLanguageCode(i18n.resolvedLanguage) ? i18n.resolvedLanguage : "en";
  const toggleLanguage = () => {
    void i18n.changeLanguage(language === "en" ? "mk" : "en");
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-card border-b border-border z-40 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Sprout className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="font-semibold">AgriPulse</h1>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-muted rounded-lg transition-all"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        className={cn(
          "fixed lg:static w-64 bg-card border-r border-border flex flex-col z-50 h-full transform transition-transform duration-300 ease-out lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0">
              <Sprout className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">AgriPulse</h1>
              <p className="text-sm text-muted-foreground">{t("auth.platformSubtitle")}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-foreground hover:bg-muted"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <button
              onClick={() => {
                setIsChatOpen(true);
                setIsSidebarOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{t("nav.assistant")}</span>
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <Link
            to="/profile"
            onClick={() => setIsSidebarOpen(false)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-all"
          >
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={profileDisplayName}
                className="w-7 h-7 rounded-full object-cover"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-muted text-xs flex items-center justify-center">
                {profileInitial}
              </div>
            )}
            <span className="truncate">{profileDisplayName}</span>
          </Link>
          <button
            onClick={toggleLanguage}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-all"
          >
            <Globe className="w-5 h-5" />
            <span>{language === "en" ? "MK" : "EN"}</span>
          </button>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>{isLoggingOut ? t("common.signingOut") : t("nav.logout")}</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pt-16 lg:pt-0">
        <Outlet />
      </main>

      {/* Floating Chat Button (Mobile/Desktop) */}
      {!isChatOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-2xl flex items-center justify-center z-30 hover:bg-primary/90 transition-all"
        >
          <MessageCircle className="w-6 h-6" />
        </motion.button>
      )}

      {/* Chatbot */}
      {isChatOpen && <Chatbot onClose={() => setIsChatOpen(false)} />}
    </div>
  );
}

function getProfileDisplayName(user: ReturnType<typeof useUser>["user"]) {
  if (!user) {
    return "Profile";
  }

  const firstName =
    user.firstName?.trim() ||
    user.username?.trim() ||
    user.primaryEmailAddress?.emailAddress.split("@")[0] ||
    "Profile";
  const lastInitial = user.lastName?.trim().charAt(0).toUpperCase();

  return lastInitial ? `${firstName} ${lastInitial}.` : firstName;
}
