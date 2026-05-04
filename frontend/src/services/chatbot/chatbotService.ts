import apiClient from "@/services/apiClient";
import type {
  ChatSessionDetail,
  ChatSessionSummary,
  FavoriteStatus,
  SetFavoriteDTO,
} from "./models";

export async function createChatSession(soilProfileId?: string | null): Promise<ChatSessionDetail> {
  return apiClient
    .post("api/chat/sessions", { json: { soilProfileId: soilProfileId ?? null } })
    .json<ChatSessionDetail>();
}

export async function listChatSessions(soilProfileId?: string): Promise<ChatSessionSummary[]> {
  const searchParams = soilProfileId ? { soilProfileId } : undefined;
  return apiClient.get("api/chat/sessions", { searchParams }).json<ChatSessionSummary[]>();
}

export async function getChatSession(sessionId: string): Promise<ChatSessionDetail> {
  return apiClient.get(`api/chat/sessions/${sessionId}`).json<ChatSessionDetail>();
}

export async function deleteChatSession(sessionId: string): Promise<void> {
  await apiClient.delete(`api/chat/sessions/${sessionId}`);
}

export async function setFavorite(
  sessionId: string,
  data: SetFavoriteDTO,
): Promise<FavoriteStatus> {
  return apiClient
    .patch(`api/chat/sessions/${sessionId}/favorite`, { json: data })
    .json<FavoriteStatus>();
}

export async function streamMessage(
  sessionId: string,
  message: string,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const response = await apiClient.post(`api/chat/sessions/${sessionId}/message`, {
    json: { message },
    headers: { Accept: "text/event-stream" },
    timeout: false,
    retry: 0,
    signal,
  });

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let eventDataLines: string[] = [];

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const cleaned = line.replace(/\r$/, "");

      if (cleaned === "") {
        if (eventDataLines.length > 0) {
          const data = eventDataLines.join("\n");
          eventDataLines = [];
          if (data !== "[DONE]") {
            onChunk(data);
          }
        }
      } else if (cleaned.startsWith("data:")) {
        eventDataLines.push(cleaned.slice(5));
      }
    }
  }
}
