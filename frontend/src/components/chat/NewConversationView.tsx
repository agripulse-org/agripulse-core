import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useCreateChatSession } from "@/data/chatbot";
import { ConversationHeader, ConversationInput, ConversationMessages } from "./conversation";

interface NewConversationViewProps {
  soilProfileId?: string | null;
  onSessionCreated: (sessionId: string) => void;
  onBack?: () => void;
}

export function NewConversationView({ soilProfileId, onSessionCreated, onBack }: NewConversationViewProps) {
  const { t } = useTranslation();

  const { messages, sendMessage, isStreaming } = useChatMessages({
    initialMessages: [
      { id: "init", role: "assistant", content: t("chat.welcomeMessage"), timestamp: new Date() },
    ],
    replaceOnSend: true,
  });

  const sessionIdRef = useRef<string | null>(null);
  const createSession = useCreateChatSession();

  const handleSend = async (content: string) => {
    if (!sessionIdRef.current) {
      const session = await createSession.mutateAsync(soilProfileId ?? null);
      sessionIdRef.current = session.id;
    }

    sendMessage({ sessionId: sessionIdRef.current, content, onDone: onSessionCreated });
  };

  return (
    <div className="flex flex-col h-full">
      <ConversationHeader title={t("chat.newConversation")} onBack={onBack} />

      <ConversationMessages messages={messages} isStreaming={isStreaming} />

      <ConversationInput onSubmit={handleSend} disabled={isStreaming} />
    </div>
  );
}
