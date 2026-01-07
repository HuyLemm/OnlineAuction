import { useState } from "react";
import { Bell, Settings, CheckCheck, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { NotificationList } from "./NotificationList";
import { type Notification } from "./NotificationCard";
import { ScrollArea } from "../ui/scroll-area";

interface NotificationDropdownProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onDelete?: (id: string) => void;
  onViewAll?: () => void;
  onNotificationClick?: (notification: Notification) => void;
}

export function NotificationDropdown({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onViewAll,
  onNotificationClick,
}: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Show only first 5 notifications in dropdown
  const previewNotifications = notifications.slice(0, 5);

  const handleNotificationClick = (notification: Notification) => {
    setIsOpen(false);
    onNotificationClick?.(notification);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 min-w-5 px-1 bg-[#ef4444] text-white border-0 flex items-center justify-center"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[420px] p-0 bg-[#1a1a1a] border border-[#fbbf24]/20"
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h3 className="text-[#fbbf24]">Notifications</h3>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="bg-[#fbbf24]/10 text-[#fbbf24] border-[#fbbf24]/30">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && onMarkAllAsRead && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onMarkAllAsRead}
                  className="h-8 px-2 text-gray-400 hover:text-[#fbbf24] hover:bg-[#fbbf24]/10"
                >
                  <CheckCheck className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-400 hover:text-[#fbbf24] hover:bg-[#fbbf24]/10">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Separator className="bg-[#fbbf24]/20" />

        {/* Notifications List */}
        <ScrollArea className="h-[400px] bg-[#0a0a0a]">
          <div className="p-4">
            <NotificationList
              notifications={previewNotifications}
              onMarkAsRead={onMarkAsRead}
              onDelete={onDelete}
              onClick={handleNotificationClick}
              compact
              emptyMessage="You're all caught up!"
            />
          </div>
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <Separator className="bg-[#fbbf24]/20" />
            <div className="p-3 bg-gradient-to-t from-[#1a1a1a] to-[#0a0a0a]">
              <Button
                variant="ghost"
                className="w-full justify-center text-[#fbbf24] hover:text-[#d4a446] hover:bg-[#fbbf24]/10"
                onClick={() => {
                  setIsOpen(false);
                  onViewAll?.();
                }}
              >
                View All Notifications
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
