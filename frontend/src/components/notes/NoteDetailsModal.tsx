import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { X } from "lucide-react";

import { useTranslation } from "react-i18next";
import type { SoilNoteResponse } from "@/services/soil-note";
import { Badge } from "@/components/ui/badge";
import { useFormatters } from "@/hooks/useFormatters";

interface NoteDetailsModalProps {
  note: SoilNoteResponse;
  onClose: () => void;
}

export function NoteDetailsModal({ note, onClose }: NoteDetailsModalProps) {
  const { t } = useTranslation();
  const { dateTime } = useFormatters();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-2xl p-6 max-w-3xl w-full max-h-[92vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="min-w-0">
            <h3 className="text-2xl mb-2 wrap-break-word">{note.title}</h3>
            <div className="text-sm text-muted-foreground">
              <Link
                to="/soils/$soilId"
                params={{ soilId: note.soilProfile.id }}
                className="text-primary hover:underline"
              >
                {note.soilProfile.name}
              </Link>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {note.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <div className="bg-muted/30 border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {note.description || "—"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="bg-muted/30 border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">{t("notes.details.created")}</p>
              <p>{dateTime(note.createdAt)}</p>
            </div>
            <div className="bg-muted/30 border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">{t("notes.details.updated")}</p>
              <p>{dateTime(note.updatedAt)}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
