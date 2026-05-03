import { MessageSquare, Plus } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

interface ConversationsEmptyStateProps {
  onCreateNew: () => void;
}

export function ConversationsEmptyState({ onCreateNew }: ConversationsEmptyStateProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex items-center justify-center p-8"
    >
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <MessageSquare className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl mb-3">{t("chat.aiConversationsTitle")}</h2>
        <p className="text-muted-foreground mb-8">{t("chat.welcomeDescription")}</p>
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-lg mx-auto"
        >
          <Plus className="w-5 h-5" />
          <span>{t("chat.startNewConversation")}</span>
        </button>
      </div>
    </motion.div>
  );
}
