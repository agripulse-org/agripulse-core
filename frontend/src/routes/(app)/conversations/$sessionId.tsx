import { useState } from "react";
import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ConfirmDialog";
import { getChatSessionQueryOptions, useDeleteChatSession, useSetFavorite } from "@/data/chatbot";
import { APIError } from "@/services/apiClient";
import { useChatMessages } from "@/hooks/useChatMessages";
import {
  ConversationHeader,
  ConversationMessages,
  ConversationInput,
} from "@/components/chat/conversation";

export const Route = createFileRoute("/(app)/conversations/$sessionId")({
  loader: async ({ params, context: { queryClient } }) => {
    try {
      await queryClient.ensureQueryData(getChatSessionQueryOptions(params.sessionId));
    } catch (error) {
      if (error instanceof APIError && error.statusCode === 404) throw notFound();
      throw error;
    }
  },
  component: ConversationSession,
});

function ConversationSession() {
  const { t } = useTranslation();
  const { sessionId } = Route.useParams();
  const navigate = useNavigate();

  const { data: session } = useSuspenseQuery(getChatSessionQueryOptions(sessionId));
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
      void navigate({ to: "/conversations" });
    } catch {
      toast.error(t("common.unexpectedError"));
    }
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <ConversationHeader
          title={session.title ?? t("chat.newConversation")}
          soilProfile={session.soilProfile}
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
        description={(s) =>
          t("chat.deleteDescription", { title: s?.title ?? t("chat.newConversation") })
        }
        confirmLabel={t("common.delete")}
        cancelLabel={t("common.cancel")}
        onConfirm={() => void handleConfirmDelete()}
      />
    </>
  );
}
