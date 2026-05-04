import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { NewConversationView } from "@/components/chat/NewConversationView";

export const Route = createFileRoute("/(app)/conversations/new")({
  validateSearch: z.object({
    soilProfileId: z.string().optional(),
  }),
  component: NewConversationPage,
});

function NewConversationPage() {
  const navigate = useNavigate();
  const { soilProfileId } = Route.useSearch();

  const handleSessionCreated = (sessionId: string) => {
    void navigate({ to: "/conversations/$sessionId", params: { sessionId } });
  };

  const handleBack = () => {
    void navigate({ to: "/conversations" });
  };

  return (
    <NewConversationView
      soilProfileId={soilProfileId}
      onSessionCreated={handleSessionCreated}
      onBack={handleBack}
      showContextSelector
    />
  );
}
