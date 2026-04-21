import { useClerk, useUser } from "@clerk/clerk-react";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

export function ProfileDeleteAccountSection() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteAccount = async () => {
    if (!user) {
      return;
    }

    setIsDeleting(true);

    try {
      await user.delete();
      await signOut();
      toast.success("Your account was deleted.");
      navigate({ to: "/auth/register" });
    } catch {
      toast.error("Account deletion needs additional Clerk security verification.");
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-destructive/5 border border-destructive/30 rounded-2xl p-6"
      >
        <h2 className="text-xl mb-2 text-destructive flex items-center gap-2">
          <Trash2 className="w-5 h-5" />
          Danger Zone
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-4 py-2 border border-destructive text-destructive rounded-lg hover:bg-destructive hover:text-destructive-foreground transition-all"
        >
          Delete Account
        </button>
      </motion.section>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl mb-4 text-destructive">Delete Account?</h3>
            <p className="text-muted-foreground mb-6">
              This action is permanent and cannot be undone. All your data, analyses, and soils will
              be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-all"
              >
                {isDeleting ? "Deleting..." : "Delete Forever"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
