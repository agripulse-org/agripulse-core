import { useState, useImperativeHandle, useRef } from "react";
import { Send, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface ConversationInputProps {
  disabled: boolean;
  onSubmit: (content: string) => void;
  prefix?: React.ReactNode;
  placeholder?: string;
  ref?: React.Ref<ConversationInputHandle>;
}

export interface ConversationInputHandle {
  focus: () => void;
}

export function ConversationInput({
  disabled,
  onSubmit,
  prefix,
  placeholder,
  ref,
}: ConversationInputProps) {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => ({ focus: () => textareaRef.current?.focus() }));

  const handleSend = () => {
    if (!input.trim() || disabled) return;
    onSubmit(input.trim());
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-border bg-card">
      <div className="flex gap-3 items-end">
        <div className="flex flex-1 min-w-0">
          {prefix && (
            <div className="flex items-stretch border border-border border-r-0 rounded-l-xl shrink-0 self-stretch overflow-hidden">
              {prefix}
            </div>
          )}
          <div
            className={cn(
              "flex flex-1 min-w-0 bg-input-background border border-border overflow-hidden transition-all focus-within:ring-2 focus-within:ring-primary/50",
              prefix ? "rounded-r-xl" : "rounded-xl",
            )}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={placeholder ?? t("chat.placeholder")}
              rows={1}
              className="flex-1 min-w-0 px-4 py-3 bg-transparent focus:outline-none resize-none placeholder:truncate"
              style={{ minHeight: "48px", maxHeight: "120px" }}
              disabled={disabled}
              autoFocus
            />
          </div>
        </div>

        <button
          onClick={handleSend}
          disabled={!input.trim() || disabled}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg self-end"
        >
          {disabled ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
