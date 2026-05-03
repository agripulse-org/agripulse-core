import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useChatStream } from "@/data/chatbot";
import { uid } from "@/lib/utils";
import type { ChatMessageModel } from "@/services/chatbot";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

function toLocalMessage(m: ChatMessageModel): ChatMessage {
  return {
    id: m.id,
    role: m.role === "USER" ? "user" : "assistant",
    content: m.content,
    timestamp: new Date(m.createdAt),
  };
}

interface UseChatMessagesOptions {
  persistedMessages?: ChatMessageModel[];
  initialMessages?: ChatMessage[];
  replaceOnSend?: boolean;
}

export function useChatMessages(options?: UseChatMessagesOptions) {
  const { t } = useTranslation();
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>(options?.initialMessages ?? []);
  const { send, isStreaming, abort } = useChatStream();

  const messages: ChatMessage[] = options?.persistedMessages
    ? [...options.persistedMessages.map(toLocalMessage), ...localMessages]
    : localMessages;

  interface HandleSendParams {
    sessionId: string;
    content: string;
    onDone?: (sessionId: string) => void;
  }

  const handleSend = ({ sessionId, content, onDone }: HandleSendParams) => {
    const userMsg: ChatMessage = { id: uid(), role: "user", content, timestamp: new Date() };

    const assistantId = uid();
    const assistantMsg: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };

    if (options?.replaceOnSend) {
      setLocalMessages([userMsg, assistantMsg]);
    } else {
      setLocalMessages((prev) => [...prev, userMsg, assistantMsg]);
    }

    void send({
      sessionId,
      message: content,
      onChunk: (chunk) =>
        setLocalMessages((msgs) =>
          msgs.map((m) => (m.id === assistantId ? { ...m, content: m.content + chunk } : m)),
        ),
      onDone: (sid) => {
        if (options?.persistedMessages !== undefined) setLocalMessages([]);
        onDone?.(sid);
      },
      onError: () =>
        setLocalMessages((msgs) =>
          msgs.map((m) =>
            m.id === assistantId && m.content === ""
              ? { ...m, content: t("chat.errorMessage") }
              : m,
          ),
        ),
    });
  };

  return { messages, sendMessage: handleSend, isStreaming, abort };
}
