import { useState } from "react";
import { Search, Star, MessageSquare } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { useFormatters } from "@/hooks/useFormatters";
import type { ChatSessionSummary } from "@/services/chatbot";

interface ConversationsListProps {
  sessions: ChatSessionSummary[];
  selectedId: string | null;
  onSelectSession: (id: string) => void;
}

export function ConversationsList({
  sessions,
  selectedId,
  onSelectSession,
}: ConversationsListProps) {
  const { t } = useTranslation();
  const { relativeTime } = useFormatters();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSessions = sessions.filter(
    (session) =>
      (session.title ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (session.lastMessageContent ?? "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sortedSessions = [...filteredSessions].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime();
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("chat.searchPlaceholder")}
            className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto not-hover:no-scrollbar">
        {sortedSessions.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            {searchQuery ? t("chat.noResults") : t("chat.noConversations")}
          </div>
        ) : (
          <div>
            {sortedSessions.map((session) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`
                  relative px-4 py-3 cursor-pointer transition-all group
                  border-b border-border/50 last:border-b-0 border-l-[3px]
                  ${
                    selectedId === session.id
                      ? "bg-primary/10 border-l-primary"
                      : "border-l-transparent hover:bg-muted"
                  }
                `}
                onClick={() => onSelectSession(session.id)}
              >
                {session.isFavorite && (
                  <Star className="absolute top-2 right-2 w-3 h-3 text-accent fill-accent" />
                )}

                <div className="flex items-start gap-2 mb-1">
                  <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <h4 className="text-sm font-medium line-clamp-1 flex-1 pr-6">
                    {session.title ?? t("chat.newConversation")}
                  </h4>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-1 ml-6 mb-2">
                  {session.lastMessageContent ?? ""}
                </p>

                {session.soilProfile && (
                  <div className="ml-6 mb-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary/20 text-secondary-foreground rounded text-xs">
                      {session.soilProfile.name}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground ml-6">
                  <span>{relativeTime(session.lastActiveAt)}</span>
                  <span>{t("chat.messagesCount", { count: session.messageCount })}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
