import { createContext, useContext } from "react";

export interface PendingContext {
  soilProfileId: string | null;
}

export interface ConversationsContextValue {
  pendingContext: PendingContext | null;
  setPendingContext: (ctx: PendingContext | null) => void;
  setShowNewChatModal: (show: boolean) => void;
}

export const ConversationsContext = createContext<ConversationsContextValue | null>(null);

export function useConversations() {
  const ctx = useContext(ConversationsContext);
  if (!ctx) throw new Error("useConversations must be used within ConversationsLayout");
  return ctx;
}
