export type ChatRole = "USER" | "ASSISTANT";

export type FavoriteStatus = {
  isFavorite: boolean;
};

export type ChatMessageModel = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
};

export type ChatSessionSummary = {
  id: string;
  title: string | null;
  soilProfile: { id: string; name: string } | null;
  isFavorite: boolean;
  createdAt: string;
  lastActiveAt: string;
  messageCount: number;
  lastMessageContent: string | null;
};

export type ChatSessionDetail = {
  id: string;
  title: string | null;
  soilProfile: { id: string; name: string } | null;
  isFavorite: boolean;
  createdAt: string;
  lastActiveAt: string;
  messages: ChatMessageModel[];
};

export type SetFavoriteDTO = {
  isFavorite: boolean;
};
