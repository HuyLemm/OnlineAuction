import { Badge } from "../ui/badge";
import { 
  Gavel, 
  XCircle, 
  Clock, 
  Trophy, 
  XOctagon, 
  MessageCircle, 
  Package, 
  Star 
} from "lucide-react";

export type NotificationCategory = 
  | "bid_update" 
  | "bid_rejection" 
  | "auction_ending" 
  | "auction_won" 
  | "auction_lost" 
  | "seller_response" 
  | "order_status" 
  | "rating";

interface NotificationBadgeProps {
  category: NotificationCategory;
  showIcon?: boolean;
  size?: "sm" | "md";
}

const categoryConfig: Record<NotificationCategory, {
  label: string;
  color: string;
  bgColor: string;
  icon: any;
}> = {
  bid_update: {
    label: "Bid Update",
    color: "text-[#3b82f6]",
    bgColor: "bg-[#3b82f6]/10 border-[#3b82f6]/30",
    icon: Gavel,
  },
  bid_rejection: {
    label: "Bid Rejected",
    color: "text-[#ef4444]",
    bgColor: "bg-[#ef4444]/10 border-[#ef4444]/30",
    icon: XCircle,
  },
  auction_ending: {
    label: "Ending Soon",
    color: "text-[#f59e0b]",
    bgColor: "bg-[#f59e0b]/10 border-[#f59e0b]/30",
    icon: Clock,
  },
  auction_won: {
    label: "Won",
    color: "text-[#10b981]",
    bgColor: "bg-[#10b981]/10 border-[#10b981]/30",
    icon: Trophy,
  },
  auction_lost: {
    label: "Lost",
    color: "text-[#6b7280]",
    bgColor: "bg-[#6b7280]/10 border-[#6b7280]/30",
    icon: XOctagon,
  },
  seller_response: {
    label: "Q&A Reply",
    color: "text-[#8b5cf6]",
    bgColor: "bg-[#8b5cf6]/10 border-[#8b5cf6]/30",
    icon: MessageCircle,
  },
  order_status: {
    label: "Order Update",
    color: "text-[#06b6d4]",
    bgColor: "bg-[#06b6d4]/10 border-[#06b6d4]/30",
    icon: Package,
  },
  rating: {
    label: "Rating",
    color: "text-[#fbbf24]",
    bgColor: "bg-[#fbbf24]/10 border-[#fbbf24]/30",
    icon: Star,
  },
};

export function NotificationBadge({ 
  category, 
  showIcon = true,
  size = "md" 
}: NotificationBadgeProps) {
  const config = categoryConfig[category];
  const Icon = config.icon;
  
  return (
    <Badge 
      variant="outline" 
      className={`${config.bgColor} ${config.color} border ${size === "sm" ? "text-xs" : ""}`}
    >
      {showIcon && <Icon className={`${size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} mr-1`} />}
      {config.label}
    </Badge>
  );
}

export function getCategoryConfig(category: NotificationCategory) {
  return categoryConfig[category];
}
