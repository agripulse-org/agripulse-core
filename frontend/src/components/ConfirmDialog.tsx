import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmDialogProps<T> {
  item: T | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: (item: T | null) => React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: (item: T) => void;
}

/**
 * Generic confirmation dialog that accepts any item and renders a description via a callback.
 * Keeps the implementation small and re-usable across the app (courses, students, etc.).
 */
export function ConfirmDialog<T>({
  item,
  open,
  onOpenChange,
  title = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
}: ConfirmDialogProps<T>) {
  const handleConfirm = () => {
    if (item) {
      onConfirm(item);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description(item)}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            autoFocus
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ConfirmDialog;
