import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useLanguage } from "@/providers/language-provider";
import { Mail, Lock, User } from "lucide-react";

export const Route = createFileRoute("/auth/register")({
  component: RegisterRoute,
});

function RegisterRoute() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/" });
  };

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-3xl mb-2">{t("auth.getStarted")}</h2>
        <p className="text-muted-foreground">Create an account to start analyzing your soil</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm mb-2 text-foreground">{t("auth.name")}</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full pl-11 pr-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-2 text-foreground">{t("auth.email")}</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-11 pr-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-2 text-foreground">{t("auth.password")}</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full pl-11 pr-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground py-3 rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
        >
          {t("auth.register")}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link to="/auth/login" className="text-primary hover:underline">
          Already have an account? Login
        </Link>
      </div>
    </>
  );
}
