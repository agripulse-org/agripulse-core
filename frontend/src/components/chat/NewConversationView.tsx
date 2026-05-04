import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useCreateChatSession } from "@/data/chatbot";
import {
  ConversationHeader,
  ConversationInput,
  ConversationMessages,
  ConversationContextSelector,
} from "./conversation";
import type { ConversationInputHandle } from "./conversation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getSoilProfilesQueryOptions } from "@/data/soilProfile";

interface NewConversationViewProps {
  soilProfileId?: string | null;
  showContextSelector?: boolean;
  onSessionCreated: (sessionId: string) => void;
  onBack?: () => void;
}

export function NewConversationView({
  soilProfileId,
  showContextSelector = false,
  onSessionCreated,
  onBack,
}: NewConversationViewProps) {
  const { t } = useTranslation();

  const sessionIdRef = useRef<string | null>(null);
  const inputRef = useRef<ConversationInputHandle>(null);
  const [selectedSoilId, setSelectedSoilId] = useState<string | null>(soilProfileId ?? null);

  const { data: soils } = useSuspenseQuery(getSoilProfilesQueryOptions());

  const createSession = useCreateChatSession();
  const { messages, sendMessage, isStreaming } = useChatMessages({
    initialMessages: [
      { id: "init", role: "assistant", content: t("chat.welcomeMessage"), timestamp: new Date() },
    ],
    replaceOnSend: true,
  });

  const handleSend = async (content: string) => {
    if (!sessionIdRef.current) {
      const session = await createSession.mutateAsync(selectedSoilId);
      sessionIdRef.current = session.id;
    }

    sendMessage({ sessionId: sessionIdRef.current, content, onDone: onSessionCreated });
  };

  const selectedSoilName = soils.find((s) => s.id === selectedSoilId)?.name;
  const inputPlaceholder = selectedSoilName
    ? t("chat.placeholderSoil", { name: selectedSoilName })
    : t("chat.placeholderGeneral");

  const contextSelector = showContextSelector ? (
    <ConversationContextSelector
      soilProfileId={selectedSoilId}
      availableSoils={soils}
      onChange={setSelectedSoilId}
      onClose={() => inputRef.current?.focus()}
    />
  ) : null;

  return (
    <div className="flex flex-col h-full">
      <ConversationHeader title={t("chat.newConversation")} onBack={onBack} />

      <ConversationMessages messages={messages} isStreaming={isStreaming} />

      <ConversationInput
        ref={inputRef}
        onSubmit={handleSend}
        disabled={isStreaming}
        prefix={contextSelector}
        placeholder={inputPlaceholder}
      />
    </div>
  );
}
