import { formatDistanceToNow } from "date-fns";
import { Eye, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { NotificationBadge, type NotificationCategory, getCategoryConfig } from "./NotificationBadge";

export interface Notification {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
  metadata?: {
    auctionId?: string;
    auctionTitle?: string;
    bidAmount?: number;
    orderNumber?: string;
    rating?: number;
  };
}

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (notification: Notification) => void;
  compact?: boolean;
}

export function NotificationCard({
  notification,
  onMarkAsRead,
  onDelete,
  onClick,
  compact = false,
}: NotificationCardProps) {
  const config = getCategoryConfig(notification.category);
  const Icon = config.icon;
  
  const handleClick = () => {
    if (!notification.isRead && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
    onClick?.(notification);
  };

  return (
    <div
      className={`group relative bg-[#1a1a1a] border rounded-lg p-4 transition-all ${
        !notification.isRead 
          ? "border-[#fbbf24]/40 border-l-4 border-l-[#fbbf24] shadow-lg shadow-[#fbbf24]/5" 
          : "border-[#fbbf24]/10 hover:border-[#fbbf24]/30"
      } ${onClick ? "cursor-pointer hover:bg-[#1a1a1a]/80" : ""}`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full ${config.bgColor} flex items-center justify-center ring-1 ring-white/10`}>
          <Icon className={`h-5 w-5 ${config.color}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex-1">
              <h4 className="text-white line-clamp-1">{notification.title}</h4>
            </div>
            {!compact && (
              <NotificationBadge category={notification.category} size="sm" showIcon={false} />
            )}
          </div>
          
          <p className={`text-gray-400 ${compact ? "line-clamp-2" : "line-clamp-3"} mb-2`}>
            {notification.message}
          </p>

          {/* Metadata */}
          {!compact && notification.metadata && (
            <div className="space-y-1 mb-2 bg-[#0a0a0a]/50 rounded p-2 border border-[#fbbf24]/10">
              {notification.metadata.auctionTitle && (
                <p className="text-gray-300 text-sm">
                  <span className="text-gray-500">Item:</span> {notification.metadata.auctionTitle}
                </p>
              )}
              {notification.metadata.bidAmount && (
                <p className="text-[#fbbf24] text-sm">
                  <span className="text-gray-500">Amount:</span> ${notification.metadata.bidAmount.toLocaleString()}
                </p>
              )}
              {notification.metadata.orderNumber && (
                <p className="text-gray-300 text-sm">
                  <span className="text-gray-500">Order:</span> #{notification.metadata.orderNumber}
                </p>
              )}
              {notification.metadata.rating !== undefined && (
                <p className="text-gray-300 text-sm">
                  <span className="text-gray-500">Rating:</span> {notification.metadata.rating}/5 ⭐
                </p>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-gray-500 text-xs">
              {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
            </span>
            
            {!compact && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!notification.isRead && onMarkAsRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkAsRead(notification.id);
                    }}
                    className="h-7 px-2 text-xs text-[#fbbf24] hover:text-[#d4a446] hover:bg-[#fbbf24]/10"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Mark read
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(notification.id);
                    }}
                    className="h-7 px-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Unread Indicator */}
        {!notification.isRead && compact && (
          <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[#fbbf24] mt-2 shadow-lg shadow-[#fbbf24]/50" />
        )}
      </div>
    </div>
  );
}
