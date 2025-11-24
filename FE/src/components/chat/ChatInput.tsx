import { useState, type KeyboardEvent } from "react";
import { Send, Paperclip, Smile } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-border/50 p-4 bg-card">
      <div className="flex gap-2 items-end">
        {/* Attachment Button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="flex-shrink-0"
          disabled={disabled}
        >
          <Paperclip className="h-5 w-5 text-muted-foreground" />
        </Button>

        {/* Message Input */}
        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={disabled}
            className="bg-input border-border/50 resize-none pr-12 min-h-[44px] max-h-[120px]"
            rows={1}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 bottom-2 h-8 w-8"
            disabled={disabled}
          >
            <Smile className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className="flex-shrink-0 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90"
          size="icon"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
      
      <p className="text-muted-foreground mt-2 px-1">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
}
