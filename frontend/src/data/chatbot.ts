import { useCallback, useRef, useState } from "react";
import { streamMessage } from "@/services/chatbot";
import type { ChatHistoryMessage } from "@/services/chatbot";

export function useChatStream() {
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const send = useCallback(
    async (
      message: string,
      history: ChatHistoryMessage[],
      onChunk: (chunk: string) => void,
      onDone: () => void,
      onError: (error: Error) => void,
    ) => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setIsStreaming(true);
      try {
        await streamMessage(message, history, onChunk, abortControllerRef.current.signal);
        onDone();
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          onError(error as Error);
        }
      } finally {
        setIsStreaming(false);
      }
    },
    [],
  );

  const abort = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  return { send, isStreaming, abort };
}
