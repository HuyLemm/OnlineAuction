import { useState, useMemo } from "react";
import { ArrowLeft, CheckCheck, Trash2, Filter } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { NotificationList } from "../components/notifications/NotificationList";
import { NotificationFilters } from "../components/notifications/NotificationFilters";
import { type Notification } from "../components/notifications/NotificationCard";
import { type NotificationCategory } from "../components/notifications/NotificationBadge";
import { Separator } from "../components/ui/separator";
import { toast } from "sonner";

interface NotificationsPageProps {
  onBack?: () => void;
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: "1",
    category: "auction_won",
    title: "Congratulations! You Won the Auction",
    message:
      "You have won the auction for 'Rolex Submariner Date - Stainless Steel'. Please proceed to checkout to complete your purchase.",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    isRead: false,
    metadata: {
      auctionId: "AUC-2024-1234",
      auctionTitle: "Rolex Submariner Date - Stainless Steel",
      bidAmount: 15000,
    },
  },
  {
    id: "2",
    category: "bid_update",
    title: "You've Been Outbid",
    message:
      "Another user has placed a higher bid on 'Vintage Ferrari 250 GTO'. Your current bid: $850,000.",
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    isRead: false,
    metadata: {
      auctionId: "AUC-2024-5678",
      auctionTitle: "Vintage Ferrari 250 GTO",
      bidAmount: 850000,
    },
  },
  {
    id: "3",
    category: "auction_ending",
    title: "Auction Ending Soon",
    message:
      "The auction for 'Patek Philippe Nautilus 5711' is ending in 2 hours. Place your final bid now!",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    isRead: false,
    metadata: {
      auctionId: "AUC-2024-9012",
      auctionTitle: "Patek Philippe Nautilus 5711",
    },
  },
  {
    id: "4",
    category: "seller_response",
    title: "Seller Responded to Your Question",
    message:
      "The seller has answered your question about 'Diamond Ring 2.5ct'. Check the Q&A section for details.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: true,
    metadata: {
      auctionId: "AUC-2024-3456",
      auctionTitle: "Diamond Ring 2.5ct",
    },
  },
  {
    id: "5",
    category: "order_status",
    title: "Your Order Has Shipped",
    message:
      "Your order #ORD-2024-789 has been shipped and is on its way. Track your package for delivery updates.",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    isRead: true,
    metadata: {
      orderNumber: "ORD-2024-789",
    },
  },
  {
    id: "6",
    category: "rating",
    title: "You Received a New Rating",
    message:
      "A seller has rated you 5 stars for your recent purchase. Thank you for being a great buyer!",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    isRead: true,
    metadata: {
      rating: 5,
    },
  },
  {
    id: "7",
    category: "bid_rejection",
    title: "Your Bid Was Rejected",
    message:
      "Your bid on 'Antique Vase Ming Dynasty' was rejected. The minimum bid increment was not met.",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    isRead: true,
    metadata: {
      auctionId: "AUC-2024-1111",
      auctionTitle: "Antique Vase Ming Dynasty",
      bidAmount: 25000,
    },
  },
  {
    id: "8",
    category: "auction_lost",
    title: "Auction Ended - You Did Not Win",
    message:
      "The auction for 'Omega Seamaster Professional' has ended. Unfortunately, you were outbid.",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isRead: true,
    metadata: {
      auctionId: "AUC-2024-2222",
      auctionTitle: "Omega Seamaster Professional",
      bidAmount: 8500,
    },
  },
  {
    id: "9",
    category: "bid_update",
    title: "Your Auto-Bid is Active",
    message:
      "Your auto-bid has been activated for 'TAG Heuer Carrera'. Current bid: $6,200.",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    isRead: true,
    metadata: {
      auctionId: "AUC-2024-3333",
      auctionTitle: "TAG Heuer Carrera",
      bidAmount: 6200,
    },
  },
  {
    id: "10",
    category: "order_status",
    title: "Payment Confirmed",
    message:
      "Your payment for order #ORD-2024-456 has been confirmed. Your item will be shipped within 24 hours.",
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    isRead: true,
    metadata: {
      orderNumber: "ORD-2024-456",
    },
  },
];

export function NotificationsPage({ onBack }: NotificationsPageProps) {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [selectedCategories, setSelectedCategories] = useState<
    NotificationCategory[]
  >([]);
  const [showFilters, setShowFilters] = useState(false);

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    // Filter by read/unread
    if (activeTab === "unread") {
      filtered = filtered.filter((n) => !n.isRead);
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((n) =>
        selectedCategories.includes(n.category)
      );
    }

    return filtered;
  }, [notifications, activeTab, selectedCategories]);

  // Count notifications by category
  const notificationCounts = useMemo(() => {
    const counts: Partial<Record<NotificationCategory, number>> = {};
    notifications.forEach((n) => {
      if (!n.isRead) {
        counts[n.category] = (counts[n.category] || 0) + 1;
      }
    });
    return counts as Record<NotificationCategory, number>;
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    toast.success("Notification marked as read");
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success("All notifications marked as read");
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notification deleted");
  };

  const handleDeleteAll = () => {
    if (window.confirm("Are you sure you want to delete all notifications?")) {
      setNotifications([]);
      toast.success("All notifications deleted");
    }
  };

  const handleCategoryToggle = (category: NotificationCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
  };

  const handleNotificationClick = (notification: Notification) => {
    // Navigate to relevant page based on notification
    console.log("Clicked notification:", notification);
    // In real app, you would navigate here
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-gray-400 hover:text-[#fbbf24] hover:bg-[#fbbf24]/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-[#fbbf24] text-3xl">Notifications</h1>
              <p className="text-gray-400">
                {unreadCount > 0
                  ? `${unreadCount} unread notification${
                      unreadCount > 1 ? "s" : ""
                    }`
                  : "No unread notifications"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="bg-[#1a1a1a] border-[#fbbf24]/20 text-gray-300 hover:border-[#fbbf24]/40 hover:bg-[#1a1a1a]/80"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {selectedCategories.length > 0 && (
                <span className="ml-2 px-1.5 py-0.5 rounded-full bg-[#fbbf24] text-black text-xs">
                  {selectedCategories.length}
                </span>
              )}
            </Button>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="bg-[#1a1a1a] border-[#fbbf24]/20 text-[#fbbf24] hover:border-[#fbbf24]/40 hover:bg-[#fbbf24]/10"
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark all as read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteAll}
                className="bg-[#1a1a1a] border-red-500/20 text-red-400 hover:text-red-300 hover:border-red-500/40 hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete all
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-6 p-6 bg-[#1a1a1a] border border-[#fbbf24]/20 rounded-xl shadow-xl shadow-[#fbbf24]/5">
            <NotificationFilters
              selectedCategories={selectedCategories}
              onCategoryToggle={handleCategoryToggle}
              onClearAll={handleClearFilters}
              notificationCounts={notificationCounts}
            />
          </div>
        )}

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "all" | "unread")}
        >
          <TabsList className="w-full sm:w-auto bg-[#1a1a1a] border border-[#fbbf24]/20">
            <TabsTrigger
              value="all"
              className="min-w-[120px] data-[state=active]:bg-[#fbbf24] data-[state=active]:text-black text-gray-400"
            >
              All ({notifications.length})
            </TabsTrigger>
            <TabsTrigger
              value="unread"
              className="min-w-[120px] data-[state=active]:bg-[#fbbf24] data-[state=active]:text-black text-gray-400"
            >
              Unread ({unreadCount})
            </TabsTrigger>
          </TabsList>

          <Separator className="my-6 bg-[#fbbf24]/20" />

          <TabsContent value="all" className="mt-0">
            <NotificationList
              notifications={filteredNotifications}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
              onClick={handleNotificationClick}
              emptyMessage={
                selectedCategories.length > 0
                  ? "No notifications match your filters"
                  : "You have no notifications"
              }
            />
          </TabsContent>

          <TabsContent value="unread" className="mt-0">
            <NotificationList
              notifications={filteredNotifications}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
              onClick={handleNotificationClick}
              emptyMessage={
                selectedCategories.length > 0
                  ? "No unread notifications match your filters"
                  : "All caught up! You have no unread notifications."
              }
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
