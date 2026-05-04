import { Suspense, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import {
  getChatSessionQueryOptions,
  getChatSessionsQueryOptions,
  useDeleteChatSession,
  useSetFavorite,
} from "@/data/chatbot";
import { useChatMessages } from "@/hooks/useChatMessages";
import ConfirmDialog from "@/components/ConfirmDialog";
import { PageLoader } from "@/components/layout/PageLoader";
import { NewConversationView } from "@/components/chat/NewConversationView";
import {
  ConversationHeader,
  ConversationMessages,
  ConversationInput,
} from "@/components/chat/conversation";
import { ConversationsEmptyState } from "@/components/chat/ConversationsEmptyState";
import { ConversationsList } from "@/components/chat/ConversationsList";

interface SoilConversationsTabProps {
  soilProfileId?: string;
}

export function SoilConversationsTab({ soilProfileId }: SoilConversationsTabProps) {
  return (
    <Suspense fallback={<PageLoader />}>
      <TabContent soilProfileId={soilProfileId} />
    </Suspense>
  );
}

interface TabContentProps {
  soilProfileId?: string;
}

function TabContent({ soilProfileId }: TabContentProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: sessions } = useSuspenseQuery(getChatSessionsQueryOptions(soilProfileId));

  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [pendingNewChat, setPendingNewChat] = useState<{ soilProfileId: string | null } | null>(
    null,
  );

  const isMobile = () => window.innerWidth < 768;

  const handleNewChat = () => {
    if (isMobile()) {
      void navigate({
        to: "/conversations/new",
        search: { soilProfileId: soilProfileId ?? undefined },
      });
      return;
    }

    setPendingNewChat({ soilProfileId: soilProfileId ?? null });
    setSelectedSessionId(null);
  };

  const handleSessionCreated = (sessionId: string) => {
    setPendingNewChat(null);

    if (isMobile()) {
      void navigate({ to: "/conversations/$sessionId", params: { sessionId } });
      return;
    }

    setSelectedSessionId(sessionId);
  };

  const handleSelectSession = (id: string) => {
    if (isMobile()) {
      void navigate({ to: "/conversations/$sessionId", params: { sessionId: id } });
      return;
    }

    setSelectedSessionId(id);
    setPendingNewChat(null);
  };

  const handleDeleted = () => {
    setSelectedSessionId(null);
  };

  const handleBack = () => {
    setSelectedSessionId(null);
    setPendingNewChat(null);
  };

  const showNewChat = pendingNewChat !== null && selectedSessionId === null;

  return (
    <div className="relative flex h-full min-h-162 overflow-hidden bg-card md:border md:border-border md:rounded-xl">
      <div
        className={cn(
          "absolute inset-0 z-10 flex flex-col bg-card transition-transform duration-300 ease-in-out",
          "md:relative md:inset-auto md:z-auto md:w-80 md:shrink-0 md:border-r md:border-border md:translate-x-0",
        )}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold">{t("chat.aiConversationsTitle")}</h2>
          <button
            onClick={handleNewChat}
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
                onClick={handleNewChat}
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

      <div
        className={cn(
          "absolute inset-0 flex flex-col bg-card transition-transform duration-300 ease-in-out overflow-auto",
          "md:relative md:inset-auto md:flex-1 md:translate-x-0",
        )}
      >
        {showNewChat ? (
          <NewConversationView
            soilProfileId={pendingNewChat.soilProfileId}
            onSessionCreated={handleSessionCreated}
            onBack={handleBack}
          />
        ) : selectedSessionId ? (
          <Suspense fallback={<PageLoader />}>
            <ConversationContainer
              sessionId={selectedSessionId}
              onDeleted={handleDeleted}
              onBack={handleBack}
            />
          </Suspense>
        ) : (
          <ConversationsEmptyState onCreateNew={handleNewChat} />
        )}
      </div>
    </div>
  );
}

interface ConversationContainerProps {
  sessionId: string;
  onDeleted: () => void;
  onBack?: () => void;
}

function ConversationContainer({ sessionId, onDeleted, onBack }: ConversationContainerProps) {
  const { t } = useTranslation();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: session } = useSuspenseQuery(getChatSessionQueryOptions(sessionId));
  const { messages, sendMessage, isStreaming } = useChatMessages({
    persistedMessages: session.messages,
  });

  const { mutate: setFav } = useSetFavorite();
  const { mutateAsync: deleteSession } = useDeleteChatSession();

  const handleSend = (content: string) => sendMessage({ sessionId, content });

  const handleConfirmDelete = async () => {
    try {
      await deleteSession(sessionId);
      toast.success(t("chat.deleteSuccess"));
      onDeleted();
    } catch {
      toast.error(t("common.unexpectedError"));
    }
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <ConversationHeader
          title={session.title ?? t("chat.newConversation")}
          isFavorite={session.isFavorite}
          onBack={onBack}
          onToggleFavorite={() => setFav({ sessionId, isFavorite: !session.isFavorite })}
          onDelete={() => setDeleteDialogOpen(true)}
        />

        <ConversationMessages messages={messages} isStreaming={isStreaming} />

        <ConversationInput onSubmit={handleSend} disabled={isStreaming} />
      </div>

      <ConfirmDialog
        item={session}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={t("chat.deleteTitle")}
        description={(s) => (
          <span>
            {t("chat.deleteDescription", { title: s?.title ?? t("chat.newConversation") })}
          </span>
        )}
        confirmLabel={t("common.delete")}
        cancelLabel={t("common.cancel")}
        onConfirm={() => void handleConfirmDelete()}
      />
    </>
  );
}
