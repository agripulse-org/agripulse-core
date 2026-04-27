import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Edit, Plus, Search, StickyNote, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { getSoilProfilesQueryOptions } from "@/data/soilProfile";
import { useDeleteSoilNote, useFilterSoilNotes } from "@/data/soilNote";
import type { SoilNoteResponse } from "@/services/soil-note";
import { APIError } from "@/services/apiClient";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ConfirmDialog from "@/components/ConfirmDialog";
import { NoteDetailsModal } from "@/components/notes/NoteDetailsModal";
import { NoteFormModal } from "@/components/notes/NoteFormModal";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";
import { PageLoader } from "@/components/layout/PageLoader";

const notesSearchSchema = z.object({
  q: z.string().optional(),
  tag: z.string().optional(),
});

export const Route = createFileRoute("/(app)/notes")({
  validateSearch: notesSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(getSoilProfilesQueryOptions()),
  component: NotesRoute,
});

function NotesRoute() {
  const { t } = useTranslation();
  const navigate = Route.useNavigate();
  const searchParams = Route.useSearch();

  const { data: soils } = useSuspenseQuery(getSoilProfilesQueryOptions());

  const {
    data: notes = [],
    isPending,
    isError,
    refetch,
  } = useFilterSoilNotes({ search: searchParams.q, tag: searchParams.tag });

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<SoilNoteResponse | null>(null);
  const [detailsNote, setDetailsNote] = useState<SoilNoteResponse | null>(null);
  const [deleting, setDeleting] = useState<SoilNoteResponse | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const deleteMutation = useDeleteSoilNote(deleting?.soilProfile.id ?? "missing");

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const n of notes) {
      for (const tag of n.tags) set.add(tag);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [notes]);

  const {
    inputValue: localQ,
    debouncedValue: debouncedSearchValue,
    setInputValue: setLocalQ,
  } = useDebouncedSearch(searchParams.q || "", { delay: 300, minLength: 0 });

  // Update URL when debounced value changes
  useEffect(() => {
    if (debouncedSearchValue !== searchParams.q) {
      navigate({
        search: (prev) => ({ ...prev, q: debouncedSearchValue || undefined }),
        replace: true,
      });
    }
  }, [debouncedSearchValue, searchParams.q, navigate]);

  const handleSelectTag = (value: string) => {
    void navigate({
      to: "/notes",
      search: (prev) => ({ ...prev, tag: value || undefined }),
      replace: true,
    });
  };

  async function handleConfirmDelete(item: SoilNoteResponse) {
    try {
      await deleteMutation.mutateAsync(item.id);
      toast.success(t("notes.deleted"));
      setDeleteDialogOpen(false);
      setDeleting(null);
    } catch (error) {
      if (error instanceof APIError) toast.error(error.message);
      else toast.error(t("notes.deleteFailed"));
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl mb-2">{t("notes.title")}</h1>
          <p className="text-muted-foreground">{t("notes.subtitle")}</p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>{t("notes.new")}</span>
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-3 md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={localQ}
            onChange={(e) => setLocalQ(e.target.value)}
            placeholder={t("notes.searchPlaceholder")}
            className="w-full pl-10 pr-3 py-2 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="flex gap-2 items-center">
          <label className="text-sm text-muted-foreground">{t("notes.filterTag")}</label>
          <select
            value={searchParams.tag ?? ""}
            onChange={(e) => handleSelectTag(e.target.value)}
            className="min-w-44 px-3 py-2 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">{t("notes.allTags")}</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isPending && <PageLoader />}

      {isError && (
        <div className="text-center py-16 space-y-4">
          <p className="text-muted-foreground">{t("notes.loadError")}</p>
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
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <StickyNote className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl mb-2">{t("notes.emptyTitle")}</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {t("notes.emptyDescription")}
          </p>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-lg"
          >
            {t("notes.new")}
          </button>
        </div>
      )}

      {!isPending && !isError && notes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <NoteCard
                note={note}
                onOpen={() => setDetailsNote(note)}
                onEdit={() => setEditing(note)}
                onDelete={() => {
                  setDeleting(note);
                  setDeleteDialogOpen(true);
                }}
              />
            </motion.div>
          ))}
        </div>
      )}

      {createOpen && (
        <NoteFormModal soils={soils} onClose={() => setCreateOpen(false)} initial={null} />
      )}

      {editing && (
        <NoteFormModal soils={soils} onClose={() => setEditing(null)} initial={editing} />
      )}

      {detailsNote && <NoteDetailsModal note={detailsNote} onClose={() => setDetailsNote(null)} />}

      <ConfirmDialog
        item={deleting}
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setDeleting(null);
        }}
        title={t("notes.deleteTitle")}
        description={(item) => (
          <span>{t("notes.deleteDescription", { title: item?.title ?? "" })}</span>
        )}
        confirmLabel={t("common.delete")}
        cancelLabel={t("common.cancel")}
        onConfirm={(item) => void handleConfirmDelete(item)}
      />
    </div>
  );
}

function NoteCard({
  note,
  onOpen,
  onEdit,
  onDelete,
}: {
  note: SoilNoteResponse;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Card className="h-full cursor-pointer hover:shadow-md transition-all" onClick={onOpen}>
      <CardHeader className="border-b border-border">
        <CardTitle className="line-clamp-2">{note.title}</CardTitle>
        <CardDescription>
          <Link
            to="/soils/$soilId"
            params={{ soilId: note.soilProfile.id }}
            className="text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {note.soilProfile.name}
          </Link>
        </CardDescription>
        <CardAction>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-2 hover:bg-muted rounded-lg transition-all text-muted-foreground hover:text-foreground"
              aria-label={t("common.edit")}
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-all disabled:opacity-50"
              aria-label={t("common.delete")}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-3">
          {note.description || "—"}
        </p>

        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {note.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
