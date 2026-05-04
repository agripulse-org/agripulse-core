import { useState } from "react";
import { createFileRoute, Outlet, useNavigate, useParams } from "@tanstack/react-router";
import { z } from "zod";
import { Plus } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { ConversationsList } from "@/components/chat/ConversationsList";
import { NewConversationDialog } from "@/components/chat/NewConversationDialog";
import { ConversationsContext } from "@/providers/conversations-provider";
import type { PendingContext } from "@/providers/conversations-provider";
import { getChatSessionsQueryOptions } from "@/data/chatbot";
import { getSoilProfilesQueryOptions } from "@/data/soilProfile";

const conversationsSearchSchema = z.object({
  soilProfileId: z.string().optional(),
});

export const Route = createFileRoute("/(app)/conversations")({
  validateSearch: conversationsSearchSchema,
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
  const { soilProfileId: initialSoilId } = Route.useSearch();

  const { data: sessions } = useSuspenseQuery(getChatSessionsQueryOptions());
  const { data: soils } = useSuspenseQuery(getSoilProfilesQueryOptions());

  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [pendingContext, setPendingContext] = useState<PendingContext | null>(
    initialSoilId ? { soilProfileId: initialSoilId } : null,
  );

  const isChatActive = !!selectedSessionId || pendingContext !== null;

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
      <div className="flex h-full bg-background">
        <div className="relative flex flex-1 overflow-hidden md:m-4 lg:m-6 md:rounded-xl md:border md:border-border">
          {/* Sidebar  */}
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

          {/* Chat area */}
          <div
            className={cn(
              "absolute inset-0 flex flex-col bg-card transition-transform duration-300 ease-in-out",
              "md:relative md:inset-auto md:flex-1 md:translate-x-0",
              !isChatActive ? "translate-x-full md:translate-x-0" : "translate-x-0",
            )}
          >
            <Outlet />
          </div>
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
