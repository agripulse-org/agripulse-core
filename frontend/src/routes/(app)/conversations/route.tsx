import { useState } from "react";
import { createFileRoute, Outlet, useNavigate, useParams } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { ConversationsList } from "@/components/chat/ConversationsList";
import { NewConversationDialog } from "@/components/chat/NewConversationDialog";
import { ConversationsContext } from "@/providers/conversations-provider";
import type { PendingContext } from "@/providers/conversations-provider";
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
  const { sessionId: selectedSessionId = null } = useParams({ strict: false });

  const { data: sessions } = useSuspenseQuery(getChatSessionsQueryOptions());
  const { data: soils } = useSuspenseQuery(getSoilProfilesQueryOptions());

  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [pendingContext, setPendingContext] = useState<PendingContext | null>(null);

  const handleSelectSession = (sessionId: string) => {
    setPendingContext(null);
    void navigate({ to: "/conversations/$sessionId", params: { sessionId } });
  };

  const handleCreateSession = (soilProfileId?: string) => {
    setPendingContext({ soilProfileId: soilProfileId ?? null });
    setShowNewChatModal(false);
    void navigate({ to: "/conversations" });
  };

  return (
    <ConversationsContext.Provider
      value={{ pendingContext, setPendingContext, setShowNewChatModal }}
    >
      <div className="flex h-full bg-background p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="w-80 border-r border-border flex flex-col bg-card overflow-auto">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold">{t("chat.aiConversationsTitle")}</h2>
            <button
              onClick={() => setShowNewChatModal(true)}
              className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {sessions.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-8 text-center">
              <div>
                <p className="text-muted-foreground text-sm mb-4">{t("chat.noConversations")}</p>
                <button
                  onClick={() => setShowNewChatModal(true)}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all text-sm"
                >
                  {t("chat.startConversation")}
                </button>
              </div>
            </div>
          ) : (
            <ConversationsList
              sessions={sessions}
              selectedId={selectedSessionId}
              onSelectSession={handleSelectSession}
            />
          )}
        </div>

        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>
      </div>

      {showNewChatModal && (
        <NewConversationDialog
          onClose={() => setShowNewChatModal(false)}
          onCreate={handleCreateSession}
          availableSoils={soils.map((s) => ({ id: s.id, name: s.name }))}
        />
      )}
    </ConversationsContext.Provider>
  );
}
