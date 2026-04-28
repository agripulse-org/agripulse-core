import ky from "ky";
import { env } from "@/env";
import { getAuthToken } from "@/lib/tokenRegistry";
import type { ChatHistoryMessage } from "./models";

export async function streamMessage(
  message: string,
  history: ChatHistoryMessage[],
  onChunk: (chunk: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const token = await getAuthToken();

  const searchParams = new URLSearchParams();
  if (token) searchParams.set("access_token", token);

  const response = await ky.post(`${env.VITE_API_BASE_URL}/api/v1/chat/message?${searchParams}`, {
    json: { message, history },
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
        // Blank line = end of SSE event; join accumulated data lines with \n
        if (eventDataLines.length > 0) {
          const data = eventDataLines.join("\n");
          eventDataLines = [];
          if (data !== "[DONE]") {
            onChunk(data);
          }
        }
      } else if (cleaned.startsWith("data:")) {
        // Spring writes data:<content> with no separator space, so slice(5) is the raw content
        eventDataLines.push(cleaned.slice(5));
      }
    }
  }
}
