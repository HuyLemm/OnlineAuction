import { useState, useEffect, useRef } from "react";
import { MessageCircle, User, X } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";

import { GET_MESSAGE_ORDER_API, SEND_MESSAGE_ORDER_API } from "../utils/api";
import { fetchWithAuth } from "../utils/fetchWithAuth";

/* ===============================
 * Types
 * =============================== */

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
}

interface ChatInterfaceProps {
  orderId: string;
  otherParty: {
    id: string;
    name: string;
    role: "buyer" | "seller";
  };
  currentUserId: string;
  currentUserName: string;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

/* ===============================
 * Component
 * =============================== */

export function ChatInterface({
  orderId,
  otherParty,
  currentUserId,
  currentUserName,
  isMinimized = false,
  onToggleMinimize,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* ===============================
   * Load messages
   * =============================== */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchWithAuth(GET_MESSAGE_ORDER_API(orderId));
        const json = await res.json();
        console.log(json);

        if (!json.success) {
          throw new Error(json.message || "Failed to load messages");
        }

        const mapped: Message[] = json.data.map((m: any) => ({
          id: m.id,
          senderId: m.senderId,
          senderName: m.senderName,
          content: m.content,
          timestamp: new Date(m.timestamp),
          isOwn: m.senderId === currentUserId,
        }));

        setMessages(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId, currentUserId]);

  /* ===============================
   * Send message
   * =============================== */
  const handleSendMessage = async (content: string) => {
    try {
      const res = await fetchWithAuth(SEND_MESSAGE_ORDER_API(orderId), {
        method: "POST",
        body: JSON.stringify({ content }),
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.message || "Send message failed");
      }

      const newMessage: Message = {
        id: json.data.id,
        senderId: currentUserId,
        senderName: currentUserName,
        content: json.data.content,
        timestamp: new Date(json.data.created_at),
        isOwn: true,
      };

      setMessages((prev) => [...prev, newMessage]);
    } catch (err) {
      console.error(err);
    }
  };

  /* ===============================
   * Minimized view
   * =============================== */
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onToggleMinimize}
          className="h-14 px-6 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90 shadow-lg"
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          Chat with {otherParty.name}
        </Button>
      </div>
    );
  }

  /* ===============================
   * Full chat UI
   * =============================== */
  return (
    <div className="bg-card border border-border/50 rounded-xl overflow-hidden flex flex-col h-[600px]">
      {/* Header */}
      <div className="p-4 border-b border-border/50 bg-gradient-to-r from-[#fbbf24]/10 to-[#f59e0b]/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] flex items-center justify-center">
              <User className="h-5 w-5 text-black" />
            </div>
            <div>
              <h4 className="text-foreground">{otherParty.name}</h4>
              <p className="text-muted-foreground capitalize">
                {otherParty.role}
              </p>
            </div>
          </div>

          {onToggleMinimize && (
            <Button variant="ghost" size="icon" onClick={onToggleMinimize}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="bg-secondary/50 rounded-full px-4 py-2 text-muted-foreground">
              Order #{orderId}
            </div>
          </div>

          {loading && (
            <p className="text-center text-muted-foreground">
              Loading messages...
            </p>
          )}

          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
}
