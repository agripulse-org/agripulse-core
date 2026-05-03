import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ConversationInputProps {
  disabled: boolean;
  onSubmit: (content: string) => void;
}

export function ConversationInput({ disabled, onSubmit }: ConversationInputProps) {
  const { t } = useTranslation();
  const [input, setInput] = useState("");

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
    <div className="p-4 border-t border-border bg-background">
      <div className="flex gap-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={t("chat.placeholder")}
          rows={1}
          className="flex-1 px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
          style={{ minHeight: "48px", maxHeight: "120px" }}
          disabled={disabled}
          autoFocus
        />

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
