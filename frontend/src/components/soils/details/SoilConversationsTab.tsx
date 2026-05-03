import { Suspense, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { NewConversationDialog } from "@/components/chat/NewConversationDialog";
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
  const { data: sessions } = useSuspenseQuery(getChatSessionsQueryOptions(soilProfileId));

  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [pendingNewChat, setPendingNewChat] = useState<{ soilProfileId: string | null } | null>(
    null,
  );

  const handleCreate = (soilId?: string) => {
    setPendingNewChat({ soilProfileId: soilId ?? soilProfileId ?? null });
    setSelectedSessionId(null);
    setShowNewChatModal(false);
  };

  const handleSessionCreated = (sessionId: string) => {
    setPendingNewChat(null);
    setSelectedSessionId(sessionId);
  };

  const handleDeleted = () => {
    setSelectedSessionId(null);
  };

  const showNewChat = pendingNewChat !== null && selectedSessionId === null;

  return (
    <div className="flex h-full bg-background">
      <div className="w-80 border-r border-border flex flex-col bg-card">
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
            onSelectSession={(id) => {
              setSelectedSessionId(id);
              setPendingNewChat(null);
            }}
          />
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        {showNewChat ? (
          <NewConversationView
            soilProfileId={pendingNewChat.soilProfileId}
            onSessionCreated={handleSessionCreated}
          />
        ) : selectedSessionId ? (
          <Suspense fallback={<PageLoader />}>
            <ConversationContainer sessionId={selectedSessionId} onDeleted={handleDeleted} />
          </Suspense>
        ) : (
          <ConversationsEmptyState onCreateNew={() => setShowNewChatModal(true)} />
        )}
      </div>

      {showNewChatModal && (
        <NewConversationDialog
          onClose={() => setShowNewChatModal(false)}
          onCreate={handleCreate}
          preselectedSoilId={soilProfileId}
        />
      )}
    </div>
  );
}

interface ConversationContainerProps {
  sessionId: string;
  onDeleted: () => void;
}

function ConversationContainer({ sessionId, onDeleted }: ConversationContainerProps) {
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
