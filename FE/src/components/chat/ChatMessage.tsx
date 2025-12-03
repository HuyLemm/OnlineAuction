import { User, Clock, Check, CheckCheck } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";

interface ChatMessageProps {
  message: {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: Date;
    isOwn: boolean;
    read: boolean;
  };
}

export function ChatMessage({ message }: ChatMessageProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`flex gap-3 ${message.isOwn ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback className={`
          ${message.isOwn 
            ? "bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] text-black" 
            : "bg-secondary text-foreground"
          }
        `}>
          {getInitials(message.senderName)}
        </AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div className={`flex-1 max-w-[75%] ${message.isOwn ? "items-end" : ""}`}>
        {!message.isOwn && (
          <p className="text-muted-foreground mb-1 px-1">
            {message.senderName}
          </p>
        )}
        
        <div className={`
          rounded-2xl px-4 py-2.5 break-words
          ${message.isOwn 
            ? "bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black rounded-tr-sm" 
            : "bg-card border border-border/50 rounded-tl-sm"
          }
        `}>
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Timestamp and Status */}
        <div className={`
          flex items-center gap-1.5 mt-1 px-1
          ${message.isOwn ? "justify-end" : ""}
        `}>
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="text-muted-foreground">
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
          {message.isOwn && (
            message.read ? (
              <CheckCheck className="h-4 w-4 text-[#10b981]" />
            ) : (
              <Check className="h-4 w-4 text-muted-foreground" />
            )
          )}
        </div>
      </div>
    </div>
  );
}
