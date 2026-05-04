import { useCallback, useRef, useState } from "react";
import { queryOptions, useMutation, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import {
  createChatSession,
  deleteChatSession,
  getChatSession,
  listChatSessions,
  setFavorite,
  streamMessage,
} from "@/services/chatbot";
import type { ChatSessionDetail, FavoriteStatus } from "@/services/chatbot";

export const getChatSessionsQueryOptions = (soilProfileId?: string) =>
  queryOptions({
    queryKey: ["chat-sessions", { soilProfileId }] as const,
    queryFn: () => listChatSessions(soilProfileId),
  });

export const getChatSessionQueryOptions = (sessionId: string) =>
  queryOptions({
    queryKey: ["chat-sessions", sessionId] as const,
    queryFn: () => getChatSession(sessionId),
  });

export function useChatSessions(soilProfileId?: string) {
  return useSuspenseQuery(getChatSessionsQueryOptions(soilProfileId));
}

export function useChatSession(sessionId: string) {
  return useSuspenseQuery(getChatSessionQueryOptions(sessionId));
}

export function useCreateChatSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (soilProfileId?: string | null) => createChatSession(soilProfileId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
    },
  });
}

export function useDeleteChatSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => deleteChatSession(sessionId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
    },
  });
}

export function useSetFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, isFavorite }: { sessionId: string; isFavorite: boolean }) =>
      setFavorite(sessionId, { isFavorite }),
    onSuccess: (data: FavoriteStatus, { sessionId }) => {
      queryClient.setQueryData(
        getChatSessionQueryOptions(sessionId).queryKey,
        (prev: ChatSessionDetail | undefined) => prev && { ...prev, isFavorite: data.isFavorite },
      );
      queryClient.setQueriesData({ queryKey: ["chat-sessions"], exact: false }, (prev: unknown) =>
        Array.isArray(prev)
          ? prev.map((s) => (s.id === sessionId ? { ...s, isFavorite: data.isFavorite } : s))
          : prev,
      );
    },
  });
}

interface ChatStreamParams {
  sessionId: string;
  message: string;
  onChunk: (chunk: string) => void;
  onDone?: (sessionId: string) => void;
  onError?: (error: Error) => void;
}

export function useChatStream() {
  const queryClient = useQueryClient();
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const send = useCallback(
    async ({ sessionId, message, onChunk, onDone, onError }: ChatStreamParams) => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();
      setIsStreaming(true);

      try {
        await streamMessage(sessionId, message, onChunk, abortControllerRef.current.signal);
        await queryClient.fetchQuery(getChatSessionQueryOptions(sessionId));
        await queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
        onDone?.(sessionId);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          onError?.(error as Error);
        }
      } finally {
        setIsStreaming(false);
      }
    },
    [queryClient],
  );

  const abort = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  return { send, isStreaming, abort };
}
