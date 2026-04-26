import { useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Edit, Plus, StickyNote, Trash2 } from "lucide-react";

import { useLanguage } from "@/providers/language-provider";
import { useDeleteSoilNote, useSoilNotes } from "@/data/soilNote";
import { APIError } from "@/services/apiClient";
import type { SoilNoteResponse } from "@/services/soil-note";
import { EmptyState } from "@/components/EmptyState";
import { Badge } from "@/components/ui/badge";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useFormatters } from "@/hooks/useFormatters";
import { NoteFormModal } from "@/components/notes/NoteFormModal";

interface SoilNotesTabProps {
  soilProfileId: string;
}

export function SoilNotesTab({ soilProfileId }: SoilNotesTabProps) {
  const { t } = useLanguage();
  const { dateTime } = useFormatters();
  const [formOpen, setFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<SoilNoteResponse | null>(null);
  const [deletingNote, setDeletingNote] = useState<SoilNoteResponse | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: notes = [], isPending, isError, refetch } = useSoilNotes(soilProfileId);
  const deleteMutation = useDeleteSoilNote(soilProfileId);

  const handleDelete = async (note: SoilNoteResponse) => {
    try {
      await deleteMutation.mutateAsync(note.id);
      toast.success(t("soils.details.notes.deleted"));
    } catch (error) {
      if (error instanceof APIError) {
        toast.error(error.message);
      } else {
        toast.error(t("soils.details.notes.deleteFailed"));
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl mb-1">{t("soils.details.notes.title")}</h2>
          <p className="text-muted-foreground text-sm">{t("soils.details.notes.subtitle")}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingNote(null);
            setFormOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>{t("soils.details.notes.add")}</span>
        </button>
      </div>

      {isPending && (
        <div className="text-center py-16 text-muted-foreground">{t("common.loading")}</div>
      )}

      {isError && (
        <div className="text-center py-16 space-y-4">
          <p className="text-muted-foreground">{t("soils.details.notes.loadError")}</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90"
          >
            {t("common.retry")}
          </button>
        </div>
      )}

      {!isPending && !isError && notes.length === 0 && (
        <EmptyState
          icon={StickyNote}
          title={t("soils.details.notes.emptyTitle")}
          description={t("soils.details.notes.emptyDescription")}
          action={{
            label: t("soils.details.notes.createFirst"),
            onClick: () => {
              setEditingNote(null);
              setFormOpen(true);
            },
          }}
        />
      )}

      {!isPending && !isError && notes.length > 0 && (
        <div className="space-y-3">
          {notes.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium mb-2">{note.title}</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap wrap-break-word">
                    {note.description || "—"}
                  </p>
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {note.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-3">
                    {t("soils.details.notes.lastUpdated")} {dateTime(note.updatedAt)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingNote(note);
                      setFormOpen(true);
                    }}
                    className="p-2 hover:bg-muted rounded-lg transition-all text-muted-foreground hover:text-foreground"
                    aria-label={t("soils.details.notes.edit")}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeletingNote(note);
                      setDeleteDialogOpen(true);
                    }}
                    disabled={deleteMutation.isPending}
                    className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-all disabled:opacity-50"
                    aria-label={t("common.delete")}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {formOpen && (
        <NoteFormModal
          soilProfileId={soilProfileId}
          initial={editingNote}
          onClose={() => {
            setFormOpen(false);
            setEditingNote(null);
          }}
        />
      )}

      <ConfirmDialog
        item={deletingNote}
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setDeletingNote(null);
        }}
        title={t("notes.deleteTitle")}
        description={(item) => (
          <span>{t("notes.deleteDescription").replace("{title}", item?.title ?? "")}</span>
        )}
        confirmLabel={t("common.delete")}
        cancelLabel={t("common.cancel")}
        onConfirm={(item) => void handleDelete(item)}
      />
    </motion.div>
  );
}
