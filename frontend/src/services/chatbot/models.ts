export type ChatRole = "user" | "assistant";

export type ChatHistoryMessage = {
  role: ChatRole;
  content: string;
};

export type ChatMessageRequest = {
  message: string;
  history: ChatHistoryMessage[];
};
