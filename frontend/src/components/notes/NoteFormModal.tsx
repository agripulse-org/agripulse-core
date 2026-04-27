import { useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";

import { useCreateSoilNote, useUpdateSoilNote } from "@/data/soilNote";
import { APIError } from "@/services/apiClient";
import type { SoilNoteResponse } from "@/services/soil-note";
import { Badge } from "@/components/ui/badge";

const buildNoteFormSchema = (t: TFunction) =>
  z.object({
    soilProfileId: z.string().min(1, t("notes.soilRequired")),
    title: z
      .string()
      .trim()
      .min(1, t("notes.validation.titleRequired"))
      .max(255, t("notes.validation.titleMax")),
    description: z.string(),
    tags: z.array(z.object({ value: z.string() })),
  });

type NoteFormValues = z.infer<ReturnType<typeof buildNoteFormSchema>>;

interface NoteFormModalProps {
  soilProfileId?: string;
  soils?: { id: string; name: string }[];
  initial: SoilNoteResponse | null;
  onClose: () => void;
}

export function NoteFormModal({
  soilProfileId: initialSoilId,
  soils,
  initial,
  onClose,
}: NoteFormModalProps) {
  const { t } = useTranslation();

  const canSelectSoil = !initialSoilId;

  const [tagInput, setTagInput] = useState("");

  const noteFormSchema = useMemo(() => buildNoteFormSchema(t), [t]);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      title: initial?.title ?? "",
      description: initial?.description ?? "",
      soilProfileId: initialSoilId ?? initial?.soilProfile.id ?? soils?.[0]?.id ?? "",
      tags: (initial?.tags ?? []).map((tag) => ({ value: tag })),
    },
  });

  const {
    fields: tagFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "tags",
  });

  const createMutation = useCreateSoilNote();
  const updateMutation = useUpdateSoilNote();

  const isEdit = Boolean(initial);
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const addTagsFromInput = (raw: string) => {
    const parts = raw.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return;
    const existing = new Set(tagFields.map((tag) => tag.value.toLowerCase()));
    for (const p of parts) {
      const normalized = p.toLowerCase();
      if (!existing.has(normalized)) {
        existing.add(normalized);
        append({ value: p });
      }
    }
  };

  const onSubmit = async (values: NoteFormValues) => {
    try {
      if (isEdit && initial) {
        await updateMutation.mutateAsync({
          soilProfileId: values.soilProfileId,
          noteId: initial.id,
          title: values.title,
          description: values.description,
          tags: values.tags.map((tag) => tag.value),
        });
        toast.success(t("soils.details.notes.saveSuccess"));
      } else {
        await createMutation.mutateAsync({
          soilProfileId: values.soilProfileId,
          title: values.title,
          description: values.description,
          tags: values.tags.map((tag) => tag.value),
        });
        toast.success(t("soils.details.notes.createSuccess"));
      }
      onClose();
    } catch (error) {
      if (error instanceof APIError) toast.error(error.message);
      else toast.error(t("soils.details.notes.saveFailed"));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-2xl p-6 max-w-2xl w-full max-h-[92vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl">
            {isEdit ? t("soils.details.notes.edit") : t("soils.details.notes.newTitle")}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {canSelectSoil && (
            <div>
              <label htmlFor="note-form-soil" className="block text-sm font-medium mb-2">
                {t("notes.soil")}
              </label>
              <select
                id="note-form-soil"
                {...register("soilProfileId")}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {soils?.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              {errors.soilProfileId?.message && (
                <p className="mt-2 text-sm text-destructive">{errors.soilProfileId.message}</p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="note-form-title" className="block text-sm font-medium mb-2">
              {t("soils.details.notes.noteTitle")}
            </label>
            <input
              id="note-form-title"
              type="text"
              {...register("title")}
              className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
              maxLength={255}
              autoFocus
            />
            {errors.title?.message && (
              <p className="mt-2 text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="note-form-description" className="block text-sm font-medium mb-2">
              {t("soils.details.notes.noteDescription")}
            </label>
            <textarea
              id="note-form-description"
              {...register("description")}
              rows={8}
              className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y min-h-50"
            />
          </div>

          <div>
            <label htmlFor="note-form-tags" className="block text-sm font-medium mb-2">
              {t("soils.details.notes.tags")}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    addTagsFromInput(tagInput);
                    setTagInput("");
                  }
                }}
                placeholder={t("soils.details.notes.tagsPlaceholder")}
                className="flex-1 px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                type="button"
                onClick={() => {
                  addTagsFromInput(tagInput);
                  setTagInput("");
                }}
                className="px-4 py-3 border border-border rounded-xl hover:bg-muted transition-all"
              >
                {t("soils.details.notes.addTag")}
              </button>
            </div>

            {tagFields.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tagFields.map((tag, index) => (
                  <Badge key={tag.id} variant="secondary" className="gap-2">
                    {tag.value}
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-muted-foreground hover:text-foreground"
                      aria-label={t("soils.details.notes.removeTag")}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-border rounded-xl hover:bg-muted transition-all"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              {isSubmitting ? t("common.loading") : t("common.save")}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
