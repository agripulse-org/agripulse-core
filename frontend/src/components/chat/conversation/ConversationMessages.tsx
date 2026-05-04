import { useRef, useEffect } from "react";
import { Loader2, Bot, User } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import type { ChatMessage } from "@/hooks/useChatMessages";

interface ConversationMessagesProps {
  messages: ChatMessage[];
  isStreaming: boolean;
}

export function ConversationMessages({ messages, isStreaming }: ConversationMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}
        >
          {message.role === "assistant" && (
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 text-primary" />
            </div>
          )}
          <div
            className={`max-w-[75%] rounded-2xl px-4 py-3 ${
              message.role === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground"
            }`}
          >
            {message.role === "assistant" ? (
              message.content === "" ? (
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Loader2 className="w-3 h-3 animate-spin" />
                </span>
              ) : (
                <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-p:leading-relaxed prose-headings:my-2 prose-ul:my-1 prose-ol:my-1 prose-li:my-0 prose-pre:my-1 prose-strong:font-semibold">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              )
            ) : (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            )}
            {message.content !== "" && (
              <p
                className={`text-xs mt-2 ${
                  message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>
          {message.role === "user" && (
            <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-secondary" />
            </div>
          )}
        </motion.div>
      ))}

      {isStreaming && messages[messages.length - 1]?.role !== "assistant" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div className="bg-muted rounded-2xl px-4 py-3 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          </div>
        </motion.div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
