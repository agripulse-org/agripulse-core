import { createFileRoute, Outlet, useNavigate, useParams, useMatch } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { ConversationsList } from "@/components/chat/ConversationsList";
import { getChatSessionsQueryOptions } from "@/data/chatbot";
import { getSoilProfilesQueryOptions } from "@/data/soilProfile";

export const Route = createFileRoute("/(app)/conversations")({
  loader: ({ context: { queryClient } }) =>
    Promise.all([
      queryClient.ensureQueryData(getChatSessionsQueryOptions()),
      queryClient.ensureQueryData(getSoilProfilesQueryOptions()),
    ]),
  component: ConversationsLayout,
});

function ConversationsLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const sessionMatch = useMatch({ from: "/(app)/conversations/$sessionId", shouldThrow: false });
  const newMatch = useMatch({ from: "/(app)/conversations/new", shouldThrow: false });
  const isChatActive = !!sessionMatch || !!newMatch;

  const { sessionId: selectedSessionId = null } = useParams({ strict: false });
  const { data: sessions } = useSuspenseQuery(getChatSessionsQueryOptions());

  const handleNewConversation = () => {
    void navigate({ to: "/conversations/new" });
  };

  const handleSelectSession = (sessionId: string) => {
    void navigate({ to: "/conversations/$sessionId", params: { sessionId } });
  };

  return (
    <div className="flex h-full bg-background">
      <div className="relative flex flex-1 overflow-hidden md:m-4 lg:m-6 md:rounded-xl md:border md:border-border">
        {/* Sidebar */}
        <div
          className={cn(
            "absolute inset-0 z-10 flex flex-col bg-card transition-transform duration-300 ease-in-out",
            "md:relative md:inset-auto md:z-auto md:w-80 md:shrink-0 md:border-r md:border-border md:translate-x-0",
            isChatActive ? "-translate-x-full md:translate-x-0" : "translate-x-0",
          )}
        >
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold">{t("chat.aiConversationsTitle")}</h2>
            <button
              onClick={handleNewConversation}
              className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {sessions.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-8 text-center">
              <p className="text-muted-foreground text-sm mb-4">{t("chat.noConversations")}</p>
            </div>
          ) : (
            <ConversationsList
              sessions={sessions}
              selectedId={selectedSessionId}
              onSelectSession={handleSelectSession}
            />
          )}
        </div>

        {/* Chat area */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col bg-card transition-transform duration-300 ease-in-out overflow-auto",
            "md:relative md:inset-auto md:flex-1 md:translate-x-0",
            !isChatActive ? "translate-x-full md:translate-x-0" : "translate-x-0",
          )}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
