import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface AnalysisMetricCardProps {
  label: string;
  value?: string | undefined;
  unit?: string;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function AnalysisMetricCard({
  label,
  value,
  unit,
  icon,
  children,
  className,
}: AnalysisMetricCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all">
      {icon ? (
        <div className="flex items-center gap-3 mb-4">
          {icon}
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground mb-2">{label}</p>
      )}

      <div className={cn("flex items-baseline gap-2", children && "mb-4")}>
        <span className={cn("text-3xl", className)}>{value ?? "—"}</span>
        {value !== undefined && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>

      {children}
    </div>
  );
}
