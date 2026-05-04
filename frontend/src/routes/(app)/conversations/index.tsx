import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ConversationsEmptyState } from "@/components/chat/ConversationsEmptyState";
import { useConversations } from "@/providers/conversations-provider";
import { NewConversationView } from "@/components/chat/NewConversationView";

export const Route = createFileRoute("/(app)/conversations/")({
  component: ConversationsIndex,
});

function ConversationsIndex() {
  const navigate = useNavigate();

  const { pendingContext, setPendingContext, setShowNewChatModal } = useConversations();

  if (pendingContext === null) {
    return <ConversationsEmptyState onCreateNew={() => setShowNewChatModal(true)} />;
  }

  return (
    <NewConversationView
      soilProfileId={pendingContext.soilProfileId}
      onSessionCreated={(sessionId) => {
        setPendingContext(null);
        void navigate({ to: "/conversations/$sessionId", params: { sessionId } });
      }}
      onBack={() => {
        setPendingContext(null);
        void navigate({ to: "/conversations" });
      }}
    />
  );
}
