import { useState } from "react";
import { Layers, X, Check, Search, MessageSquare, Plus, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ConversationContextSelectorProps {
  soilProfileId: string | null;
  availableSoils: Array<{ id: string; name: string }>;
  onChange: (soilProfileId: string | null) => void;
  onClose?: () => void;
}

export function ConversationContextSelector({
  soilProfileId,
  availableSoils,
  onChange,
  onClose,
}: ConversationContextSelectorProps) {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [soilListExpanded, setSoilListExpanded] = useState(!!soilProfileId);

  const selectedSoil = availableSoils.find((s) => s.id === soilProfileId) ?? null;
  const filteredSoils = availableSoils.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleOpenChange = (next: boolean) => {
    if (next) setSoilListExpanded(!!soilProfileId);
    if (!next) setSearch("");
    setOpen(next);
  };

  const close = () => {
    setOpen(false);
    setSearch("");
    onClose?.();
  };

  const handleSelectGeneral = () => {
    onChange(null);
    setSoilListExpanded(false);
    close();
  };

  const handleSelectSoil = (id: string) => {
    onChange(id);
    close();
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        {selectedSoil ? (
          <button
            type="button"
            className="h-full inline-flex items-center gap-1 px-3 bg-primary/5 text-xs text-primary hover:bg-primary/10 transition-all"
          >
            <Layers className="w-3 h-3 shrink-0" />
            <span className="max-w-12 truncate">{selectedSoil.name}</span>
            <span
              role="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
                setSoilListExpanded(false);
              }}
              className="ml-0.5 p-0.5 rounded hover:bg-primary/20 transition-all"
            >
              <X className="w-3 h-3" />
            </span>
          </button>
        ) : (
          <button
            type="button"
            className="h-full inline-flex items-center gap-1 px-3 text-xs text-muted-foreground hover:text-primary hover:bg-muted transition-all"
          >
            <Plus className="w-3 h-3" />
            <span>{t("chat.addContext")}</span>
          </button>
        )}
      </PopoverTrigger>

      <PopoverContent align="start" className="w-80 p-0 gap-0 overflow-hidden">
        {/* General option */}
        <button
          type="button"
          onClick={handleSelectGeneral}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-all",
            !soilProfileId && "bg-muted/60",
          )}
        >
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium">{t("chat.generalConversation")}</div>
          </div>
          {!soilProfileId && <Check className="w-4 h-4 text-primary shrink-0" />}
        </button>

        {/* Soil Profile option */}
        <div className="border-t border-border">
          <button
            type="button"
            onClick={() => setSoilListExpanded(true)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-all",
              soilProfileId && "bg-muted/60",
            )}
          >
            <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4 text-secondary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">{t("chat.soilProfile")}</div>
              <div className="text-xs text-muted-foreground">
                {t("chat.soilProfileContextHint")}
              </div>
            </div>
            {soilListExpanded && <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />}
          </button>

          {soilListExpanded && (
            <>
              <div className="px-2 py-2.5">
                <div className="relative border border-border rounded-lg overflow-hidden">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t("chat.searchSoilProfiles")}
                    className="pl-8 h-9 text-sm border-0 focus-visible:ring-0 rounded-none"
                    autoFocus
                  />
                </div>
              </div>

              <div className="max-h-44 overflow-y-auto border-t border-border/50">
                {filteredSoils.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-muted-foreground">{t("chat.noResults")}</p>
                ) : (
                  filteredSoils.map((soil) => (
                    <button
                      key={soil.id}
                      type="button"
                      onClick={() => handleSelectSoil(soil.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 text-left text-sm hover:bg-muted transition-all",
                        soilProfileId === soil.id && "bg-primary/5 text-primary",
                      )}
                    >
                      <span className="flex-1 truncate">{soil.name}</span>
                      {soilProfileId === soil.id && <Check className="w-4 h-4 shrink-0" />}
                    </button>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
