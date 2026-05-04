import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { X, Bot } from "lucide-react";
import { motion } from "motion/react";
import { useCreateChatSession } from "@/data/chatbot";
import { useChatMessages } from "@/hooks/useChatMessages";
import { ConversationInput } from "./conversation/ConversationInput";
import { ConversationMessages } from "./conversation/ConversationMessages";

export function ChatbotWidget({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();

  const sessionIdRef = useRef<string | null>(null);
  const createChatSessionMutation = useCreateChatSession();
  const { messages, sendMessage, isStreaming } = useChatMessages({
    initialMessages: [
      { id: "init", role: "assistant", content: t("chat.welcomeMessage"), timestamp: new Date() },
    ],
    replaceOnSend: true,
  });

  const handleSend = async (content: string) => {
    if (!content.trim() || isStreaming) return;

    if (!sessionIdRef.current) {
      const session = await createChatSessionMutation.mutateAsync(undefined);
      sessionIdRef.current = session.id;
    }

    sendMessage({ sessionId: sessionIdRef.current, content });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl h-[85vh] sm:h-150 flex flex-col shadow-2xl overflow-hidden"
      >
        <div className="bg-linear-to-r from-primary to-secondary p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-medium">{t("chat.title")}</h3>
              <p className="text-xs text-white/80">{t("chat.subtitle")}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 p-2 overflow-auto">
          <ConversationMessages messages={messages} isStreaming={isStreaming} />
        </div>

        <ConversationInput onSubmit={handleSend} disabled={isStreaming} />
      </motion.div>
    </motion.div>
  );
}
