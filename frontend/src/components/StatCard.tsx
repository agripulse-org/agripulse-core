import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  iconColor?: string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  children?: ReactNode;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = "text-primary",
  subtitle,
  trend,
  children,
}: StatCardProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl">{value}</h3>
            {subtitle && <span className="text-sm text-muted-foreground">{subtitle}</span>}
          </div>
        </div>
        {Icon && (
          <div
            className={`w-10 h-10 bg-${iconColor}/10 rounded-lg flex items-center justify-center`}
          >
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
        )}
      </div>

      {trend && (
        <div className="flex items-center gap-1 text-sm">
          <span className={trend.isPositive ? "text-green-600" : "text-red-600"}>
            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </span>
          <span className="text-muted-foreground">{t("common.vsLastMonth")}</span>
        </div>
      )}

      {children}
    </div>
  );
}
