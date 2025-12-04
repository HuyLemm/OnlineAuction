import { 
  PackageOpen, 
  Search, 
  Bell, 
  Gavel, 
  ShoppingBag, 
  Heart,
  MessageSquare,
  FileText,
  TrendingUp,
  Users,
  type LucideIcon
} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { cn } from "../../lib/utils";

interface EmptyStateProps {
  variant: 
    | "no-items" 
    | "no-search-results" 
    | "no-notifications" 
    | "no-bids" 
    | "no-orders"
    | "no-watchlist"
    | "no-messages"
    | "no-listings"
    | "no-activity"
    | "no-users";
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

interface EmptyConfig {
  icon: LucideIcon;
  title: string;
  message: string;
  actionLabel?: string;
  color: string;
}

const emptyConfigs: Record<string, EmptyConfig> = {
  "no-items": {
    icon: PackageOpen,
    title: "No Items Available",
    message: "There are no auction items at the moment. Check back soon for new listings!",
    actionLabel: "Browse Categories",
    color: "text-blue-500",
  },
  "no-search-results": {
    icon: Search,
    title: "No Results Found",
    message: "We couldn't find any items matching your search. Try adjusting your filters or search terms.",
    actionLabel: "Clear Filters",
    color: "text-purple-500",
  },
  "no-notifications": {
    icon: Bell,
    title: "No Notifications",
    message: "You're all caught up! We'll notify you when there's something new.",
    color: "text-green-500",
  },
  "no-bids": {
    icon: Gavel,
    title: "No Bids Yet",
    message: "Be the first to place a bid on this item. Don't miss this opportunity!",
    actionLabel: "Place Your Bid",
    color: "text-[#d4a446]",
  },
  "no-orders": {
    icon: ShoppingBag,
    title: "No Orders Yet",
    message: "You haven't completed any purchases. Start bidding to win amazing items!",
    actionLabel: "Browse Auctions",
    color: "text-orange-500",
  },
  "no-watchlist": {
    icon: Heart,
    title: "Your Watchlist is Empty",
    message: "Save items you're interested in to keep track of them easily.",
    actionLabel: "Explore Items",
    color: "text-pink-500",
  },
  "no-messages": {
    icon: MessageSquare,
    title: "No Messages",
    message: "Your inbox is empty. Start a conversation with sellers or buyers.",
    color: "text-cyan-500",
  },
  "no-listings": {
    icon: FileText,
    title: "No Active Listings",
    message: "You don't have any active listings. Create your first auction to start selling!",
    actionLabel: "Create Listing",
    color: "text-yellow-500",
  },
  "no-activity": {
    icon: TrendingUp,
    title: "No Activity Yet",
    message: "There's no recent activity to display. Start bidding or selling to see your activity here.",
    color: "text-indigo-500",
  },
  "no-users": {
    icon: Users,
    title: "No Users Found",
    message: "No users match your current filters or search criteria.",
    actionLabel: "Clear Filters",
    color: "text-teal-500",
  },
};

export function EmptyState({
  variant,
  title,
  message,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  const config = emptyConfigs[variant] || emptyConfigs["no-items"];
  const Icon = config.icon;

  return (
    <Card className={cn(
      "flex flex-col items-center justify-center p-12 text-center space-y-6 bg-card/30 border-border/50",
      className
    )}>
      {/* Animated Icon Container */}
      <div className="relative">
        {/* Pulse Background */}
        <div className={cn(
          "absolute inset-0 rounded-full animate-pulse opacity-20",
          config.color.replace("text-", "bg-")
        )} />
        
        {/* Icon */}
        <div className={cn(
          "relative h-20 w-20 rounded-full bg-secondary/20 flex items-center justify-center",
          config.color
        )}>
          <Icon className="h-10 w-10" strokeWidth={1.5} />
        </div>
      </div>

      {/* Text Content */}
      <div className="space-y-2 max-w-md">
        <h3 className="text-foreground">
          {title || config.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {message || config.message}
        </p>
      </div>

      {/* Action Button */}
      {(onAction || config.actionLabel) && (
        <Button 
          onClick={onAction}
          variant="outline"
          className="border-[#d4a446]/50 hover:bg-[#d4a446]/10 hover:border-[#d4a446] transition-colors"
        >
          {actionLabel || config.actionLabel}
        </Button>
      )}
    </Card>
  );
}
