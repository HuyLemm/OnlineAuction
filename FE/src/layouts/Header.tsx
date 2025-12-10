import {
  Search,
  Bell,
  User,
  Gavel,
  Shield,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { NotificationDropdown } from "../components/notifications/NotificationDropdown";
import { type Notification } from "../components/notifications/NotificationCard";
import { toast } from "sonner";

interface HeaderProps {
  onNavigate?: (
    page:
      | "home"
      | "browse"
      | "detail"
      | "dashboard"
      | "seller"
      | "admin"
      | "login"
      | "notifications"
      | "search"
  ) => void;
  currentPage?: string;
  isAuthenticated?: boolean;
  onLogout?: () => void;
  onCategorySelect?: (category: string) => void;
  onSearch?: (query: string) => void;
  currentSearchQuery?: string;
}

export function Header({
  onNavigate,
  currentPage = "home",
  isAuthenticated = false,
  onLogout,
  onCategorySelect,
  onSearch,
  currentSearchQuery = "",
}: HeaderProps) {
  const [selectedMainCategory, setSelectedMainCategory] = useState<
    string | null
  >(null);
  const [searchValue, setSearchValue] = useState("");

  const [menuCategories, setMenuCategories] = useState<
    {
      id: number;
      main: string;
      subcategories: { id: number; label: string }[];
    }[]
  >([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/categories/get-categories-for-menu"
        );
        const json = await res.json();
        setMenuCategories(json.data ?? []);
      } catch (err) {
        console.error("❌ Failed to load categories:", err);
      }
    };

    fetchCategories();
  }, []);
  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      category: "auction_won",
      title: "Congratulations! You Won",
      message: "You won the auction for 'Rolex Submariner Date'.",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isRead: false,
      metadata: {
        auctionTitle: "Rolex Submariner Date",
        bidAmount: 15000,
      },
    },
    {
      id: "2",
      category: "bid_update",
      title: "You've Been Outbid",
      message: "Another user placed a higher bid on 'Vintage Ferrari'.",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isRead: false,
      metadata: {
        auctionTitle: "Vintage Ferrari 250 GTO",
        bidAmount: 850000,
      },
    },
    {
      id: "3",
      category: "auction_ending",
      title: "Auction Ending Soon",
      message: "The auction for 'Patek Philippe' ends in 2 hours!",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      isRead: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success("All notifications marked as read");
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notification deleted");
  };

  const handleNotificationClick = (notification: Notification) => {
    // Navigate based on notification type
    if (notification.metadata?.auctionId) {
      onNavigate?.("detail");
    }
  };

  const handleCategoryClick = (
    mainCategoryId: number,
    subcategoryId?: number
  ) => {
    if (subcategoryId) {
      onCategorySelect?.(subcategoryId.toString());
    } else {
      onCategorySelect?.(mainCategoryId.toString());
    }
    onNavigate?.("browse");
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <button
            onClick={() => onNavigate?.("home")}
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#fbbf24] to-[#f59e0b]">
              <Gavel className="h-5 w-5 text-black" />
            </div>
            <span className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-2xl bg-clip-text text-transparent">
              LuxeAuction
            </span>
          </button>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => onNavigate?.("browse")}
              className={`transition-colors text-lg ${
                currentPage === "browse"
                  ? "text-[#fbbf24]"
                  : "text-foreground/90 hover:text-foreground"
              }`}
            >
              Live Auctions
            </button>

            {/* Hierarchical Menu Dropdown */}
            <DropdownMenu
              onOpenChange={(open) => !open && setSelectedMainCategory(null)}
            >
              <DropdownMenuTrigger asChild>
                <button className="text-foreground/90 hover:text-foreground text-lg transition-colors flex items-center gap-1">
                  Menu
                  <ChevronRight className="h-3 w-3 rotate-90" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[650px] bg-[#1a1a1a] border-[#fbbf24]/20 p-0 shadow-2xl"
                align="start"
                sideOffset={8}
                onMouseLeave={() => setSelectedMainCategory(null)}
              >
                <div className="grid grid-cols-2 gap-0">
                  {/* Main Categories List */}
                  <div className="border-r border-[#fbbf24]/10 bg-black/40">
                    <div className="p-4 border-b border-[#fbbf24]/10">
                      <p className="text-[#fbbf24]">Main Categories</p>
                    </div>
                    <div className="py-2">
                      {menuCategories.map((category) => (
                        <button
                          key={category.main}
                          onMouseEnter={() =>
                            setSelectedMainCategory(category.main)
                          }
                          onClick={() => handleCategoryClick(category.id)}
                          className={`w-full px-5 py-3.5 text-left transition-all flex items-center gap-3 group ${
                            selectedMainCategory === category.main
                              ? "bg-gradient-to-r from-[#fbbf24]/20 to-transparent text-[#fbbf24] border-l-2 border-[#fbbf24]"
                              : "text-gray-300 hover:bg-[#fbbf24]/5 hover:text-white border-l-2 border-transparent"
                          }`}
                        >
                          <span className="flex-1">{category.main}</span>
                          <ChevronRight
                            className={`h-4 w-4 transition-transform ${
                              selectedMainCategory === category.main
                                ? "text-[#fbbf24] translate-x-1"
                                : "text-gray-500 group-hover:translate-x-0.5 group-hover:text-gray-400"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Subcategories List */}
                  <div className="bg-[#0a0a0a]">
                    <div className="p-4 border-b border-[#fbbf24]/10">
                      <p className="text-muted-foreground">
                        {selectedMainCategory || "Select a category"}
                      </p>
                    </div>
                    <div className="max-h-[420px] overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-[#fbbf24]/20 scrollbar-track-transparent">
                      {selectedMainCategory &&
                        menuCategories
                          .find((cat) => cat.main === selectedMainCategory)
                          ?.subcategories.map((subcategory) => (
                            <button
                              key={subcategory.id}
                              onClick={() =>
                                handleCategoryClick(
                                  menuCategories.find(
                                    (c) => c.main === selectedMainCategory
                                  )?.id!,
                                  subcategory.id
                                )
                              }
                              className="w-full px-5 py-3 text-left text-gray-300 hover:bg-[#fbbf24]/10 hover:text-[#fbbf24] transition-all flex items-center gap-3 group"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]/40 group-hover:bg-[#fbbf24] transition-colors" />
                              <span className="flex-1">
                                {subcategory.label}
                              </span>
                              <ChevronRight className="h-3 w-3 text-[#fbbf24]/0 group-hover:text-[#fbbf24]/60 transition-colors" />
                            </button>
                          ))}
                      {!selectedMainCategory && (
                        <div className="p-12 text-center text-gray-400">
                          <p className="text-sm">Hover over a category</p>
                          <p className="text-sm mt-1 opacity-60">
                            to view subcategories
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <button className="text-foreground/90 hover:text-foreground text-lg transition-colors">
              How It Works
            </button>
            <button
              onClick={() => onNavigate?.("seller")}
              className={`transition-colors text-lg ${
                currentPage === "seller"
                  ? "text-[#fbbf24]"
                  : "text-foreground/90 hover:text-foreground"
              }`}
            >
              Sell
            </button>
          </nav>

          {/* Search */}
          <div className="hidden lg:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search auctions..."
                className="pl-10 bg-secondary/50 border-border/50 "
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchValue.trim() && onSearch) {
                    onSearch(searchValue);
                    onNavigate?.("search");
                    setSearchValue(""); // Clear input after search
                  }
                }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <NotificationDropdown
                  notifications={notifications}
                  unreadCount={unreadCount}
                  onMarkAsRead={handleMarkAsRead}
                  onMarkAllAsRead={handleMarkAllAsRead}
                  onDelete={handleDeleteNotification}
                  onViewAll={() => onNavigate?.("notifications")}
                  onNotificationClick={handleNotificationClick}
                />

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onNavigate?.("dashboard")}
                  className={
                    currentPage === "dashboard" ? "text-[#fbbf24]" : ""
                  }
                >
                  <User className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onNavigate?.("admin")}
                  className={`relative ${
                    currentPage === "admin" ? "text-[#fbbf24]" : ""
                  }`}
                  title="Admin Panel"
                >
                  <Shield className="h-5 w-5" />
                </Button>

                <Button
                  onClick={() => onNavigate?.("login")}
                  className="hidden md:inline-flex bg-gradient-to-r from-[#fbbf24] text-sm to-[#f59e0b] text-black hover:opacity-90"
                >
                  Start Bidding
                </Button>
              </>
            ) : (
              <>
                {/* Test access buttons - always visible for testing */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onNavigate?.("dashboard")}
                  className="text-muted-foreground hover:text-foreground"
                  title="Dashboard (Test)"
                >
                  <User className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onNavigate?.("admin")}
                  className="text-muted-foreground hover:text-foreground"
                  title="Admin (Test)"
                >
                  <Shield className="h-5 w-5" />
                </Button>

                <Button
                  onClick={() => onNavigate?.("login")}
                  className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90"
                >
                  Login
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
