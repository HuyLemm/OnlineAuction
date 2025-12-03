import { Bell } from "lucide-react";
import { NotificationCard, type Notification } from "./NotificationCard";

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (notification: Notification) => void;
  compact?: boolean;
  emptyMessage?: string;
}

export function NotificationList({
  notifications,
  onMarkAsRead,
  onDelete,
  onClick,
  compact = false,
  emptyMessage = "No notifications yet",
}: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-[#fbbf24]/10 flex items-center justify-center mb-4 ring-1 ring-[#fbbf24]/20">
          <Bell className="h-8 w-8 text-[#fbbf24]" />
        </div>
        <p className="text-white mb-2">All Caught Up!</p>
        <p className="text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
          onDelete={onDelete}
          onClick={onClick}
          compact={compact}
        />
      ))}
    </div>
  );
}
