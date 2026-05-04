import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ConversationsEmptyState } from "@/components/chat/ConversationsEmptyState";

export const Route = createFileRoute("/(app)/conversations/")({
  component: ConversationsIndex,
});

function ConversationsIndex() {
  const navigate = useNavigate();

  const handleNewConversation = () => {
    void navigate({ to: "/conversations/new" });
  };

  return <ConversationsEmptyState onCreateNew={handleNewConversation} />;
}
