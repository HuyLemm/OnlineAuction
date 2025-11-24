import { useState, useEffect, useRef } from "react";
import { MessageCircle, User, X } from "lucide-react";
import { ChatMessage } from "./ChatMassage";
import { ChatInput } from "./ChatInput";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
  read: boolean;
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

export function ChatInterface({ 
  orderId, 
  otherParty, 
  currentUserId, 
  currentUserName,
  isMinimized = false,
  onToggleMinimize
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      senderId: otherParty.id,
      senderName: otherParty.name,
      content: "Hello! Thank you for winning the auction. I'll process your payment shortly.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isOwn: false,
      read: true
    },
    {
      id: "2",
      senderId: currentUserId,
      senderName: currentUserName,
      content: "Great! I've submitted the payment proof. Please let me know once you confirm.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
      isOwn: true,
      read: true
    },
    {
      id: "3",
      senderId: otherParty.id,
      senderName: otherParty.name,
      content: "Payment confirmed! I'm preparing the item for shipment. You'll receive tracking information soon.",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      isOwn: false,
      read: true
    }
  ]);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      senderName: currentUserName,
      content,
      timestamp: new Date(),
      isOwn: true,
      read: false
    };

    setMessages([...messages, newMessage]);

    // Simulate response after 2 seconds
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        senderId: otherParty.id,
        senderName: otherParty.name,
        content: "Thanks for your message. I'll get back to you soon!",
        timestamp: new Date(),
        isOwn: false,
        read: true
      };
      setMessages(prev => [...prev, response]);
      
      // Mark previous message as read
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, read: true } : msg
      ));
    }, 2000);
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onToggleMinimize}
          className="h-14 px-6 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90 shadow-lg"
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          Chat with {otherParty.name}
          {messages.filter(m => !m.isOwn && !m.read).length > 0 && (
            <Badge className="ml-2 bg-[#ef4444] text-white">
              {messages.filter(m => !m.isOwn && !m.read).length}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

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
              <p className="text-muted-foreground capitalize">{otherParty.role}</p>
            </div>
          </div>
          {onToggleMinimize && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleMinimize}
              className="flex-shrink-0"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {/* Order Context */}
          <div className="flex justify-center">
            <div className="bg-secondary/50 rounded-full px-4 py-2 text-muted-foreground">
              Order #{orderId}
            </div>
          </div>

          {/* Message List */}
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
