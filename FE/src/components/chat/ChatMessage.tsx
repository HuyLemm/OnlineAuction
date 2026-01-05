import { Clock } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";

interface ChatMessageProps {
  message: {
    id: string;
    senderId: string;
    senderName?: string;
    content: string;
    timestamp: Date;
    isOwn: boolean;
  };
}

export function ChatMessage({ message }: ChatMessageProps) {
  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={`flex w-full ${
        message.isOwn ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex gap-3 max-w-[75%] ${
          message.isOwn ? "flex-row-reverse" : ""
        }`}
      >
        {/* Avatar */}
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback
            className={
              message.isOwn
                ? "bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] text-black"
                : "bg-secondary text-foreground"
            }
          >
            {getInitials(message.senderName)}
          </AvatarFallback>
        </Avatar>

        {/* Bubble */}
        <div className="flex flex-col">
          {!message.isOwn && (
            <span className="text-xs text-muted-foreground mb-1">
              {message.senderName}
            </span>
          )}

          <div
            className={`px-4 py-2 rounded-2xl w-fit break-words
              ${
                message.isOwn
                  ? "bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black rounded-tr-sm ml-auto"
                  : "bg-card border border-white rounded-tl-sm text-white"
              }
            `}
          >
            <p className="whitespace-pre-wrap font-semibold">
              {message.content}
            </p>
          </div>

          {/* Time */}
          <span
            className={`text-xs text-muted-foreground mt-1 ${
              message.isOwn ? "text-right" : "text-left"
            }`}
          >
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
