import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, Star, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ConversationHeaderProps {
  title: string;
  soilProfile?: { id: string; name: string } | null;
  isFavorite?: boolean;
  onBack?: () => void;
  onToggleFavorite?: () => void;
  onDelete?: () => void;
}

export function ConversationHeader({
  title,
  isFavorite,
  soilProfile,
  onBack,
  onToggleFavorite,
  onDelete,
}: ConversationHeaderProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="p-4 border-b border-border flex items-center justify-between min-h-17.25">
      {onBack && (
        <button
          onClick={onBack}
          className="md:hidden mr-2 p-2 hover:bg-muted rounded-lg transition-all text-muted-foreground flex-shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-medium mb-1 truncate">{title}</h2>

        {soilProfile && (
          <button
            onClick={() => navigate({ to: "/soils/$soilId", params: { soilId: soilProfile.id } })}
            className="inline-flex items-center gap-1 px-2 py-1 bg-secondary/20 hover:bg-secondary/30 text-secondary-foreground rounded text-xs transition-all"
          >
            <span>{t("chat.soilContext", { name: soilProfile.name })}</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {onToggleFavorite && (
          <button
            onClick={onToggleFavorite}
            className={cn("p-2 rounded-lg transition-all", {
              "bg-accent/20 text-accent hover:bg-accent/30": isFavorite,
              "hover:bg-muted text-muted-foreground": !isFavorite,
            })}
          >
            <Star className={cn("w-5 h-5", { "fill-accent": isFavorite })} />
          </button>
        )}

        {onDelete && (
          <button
            onClick={onDelete}
            className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-all"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
