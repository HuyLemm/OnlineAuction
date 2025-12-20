import {
  Search,
  Bell,
  User,
  Gavel,
  Shield,
  ChevronRight,
  LogOut,
  LogIn,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { NotificationDropdown } from "../components/notifications/NotificationDropdown";
import { type Notification } from "../components/notifications/NotificationCard";
import { toast } from "sonner";
import { GET_CATEGORIES_FOR_MENU_API } from "../components/utils/api";
import { useNavigate, useLocation } from "react-router-dom";

import { useAuth } from "../components/utils/AuthContext";

export function Header() {
  const { isLoggedIn, role, login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
        const res = await fetch(GET_CATEGORIES_FOR_MENU_API);
        const json = await res.json();
        setMenuCategories(json.data ?? []);
      } catch (err) {
        console.error("❌ Failed to load categories:", err);
      }
    };
    fetchCategories();
  }, []);

  /* ---------------- Notifications (mock) ---------------- */
  const [notifications, setNotifications] = useState<Notification[]>([]);
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
    if (notification.metadata?.auctionId) {
      navigate(`/product/${notification.metadata.auctionId}`);
    }
  };

  /* ---------------- Category ---------------- */
  const handleCategoryClick = (
    mainCategoryId: number,
    subcategoryId?: number
  ) => {
    const categoryId = subcategoryId ?? mainCategoryId;
    navigate(`/browse?category=${categoryId}`);
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:opacity-80"
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
              onClick={() => navigate("/browse")}
              className={`text-lg transition-colors ${
                isActive("/browse")
                  ? "text-[#fbbf24]"
                  : "text-foreground/90 hover:text-foreground"
              }`}
            >
              Live Auctions
            </button>

            {/* Category Menu */}
            <DropdownMenu
              onOpenChange={(open) => !open && setSelectedMainCategory(null)}
            >
              <DropdownMenuTrigger asChild>
                <button className="text-lg text-foreground/90 hover:text-foreground transition-colors flex items-center gap-1">
                  Menu
                  <ChevronRight className="h-3 w-3 rotate-90" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-[650px] bg-[#1a1a1a] border border-[#fbbf24]/20 p-0 shadow-2xl"
                align="start"
                sideOffset={8}
              >
                <div
                  className="grid grid-cols-2 gap-0"
                  onMouseLeave={() => setSelectedMainCategory(null)}
                >
                  {/* ================= LEFT: MAIN CATEGORIES ================= */}
                  <div className="border-r border-[#fbbf24]/10 bg-black/40">
                    <div className="p-4 border-b border-[#fbbf24]/10">
                      <p className="text-[#fbbf24] text-lg">Main Categories</p>
                    </div>

                    <div className="py-2">
                      {menuCategories.map((category) => (
                        <button
                          key={category.id}
                          onMouseEnter={() =>
                            setSelectedMainCategory(category.main)
                          }
                          onClick={() => handleCategoryClick(category.id)}
                          className={`w-full px-5 py-3.5 text-left transition-all flex items-center gap-3 group
                ${
                  selectedMainCategory === category.main
                    ? "bg-gradient-to-r from-[#fbbf24]/20 to-transparent text-[#fbbf24] border-l-2 border-[#fbbf24]"
                    : "text-gray-300 hover:bg-[#fbbf24]/5 hover:text-white border-l-2 border-transparent"
                }
              `}
                        >
                          <span className="flex-1 text-sm">
                            {category.main}
                          </span>
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

                  {/* ================= RIGHT: SUB CATEGORIES ================= */}
                  <div className="bg-[#0a0a0a]">
                    <div className="p-4 border-b border-[#fbbf24]/10">
                      <p className="text-muted-foreground text-lg">
                        {selectedMainCategory || "Select a category"}
                      </p>
                    </div>

                    <div className="max-h-[420px] overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-[#fbbf24]/20 scrollbar-track-transparent">
                      {selectedMainCategory &&
                        menuCategories
                          .find((c) => c.main === selectedMainCategory)
                          ?.subcategories.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() =>
                                handleCategoryClick(
                                  menuCategories.find(
                                    (c) => c.main === selectedMainCategory
                                  )!.id,
                                  sub.id
                                )
                              }
                              className="w-full px-5 py-3 text-left text-gray-300 hover:bg-[#fbbf24]/10 hover:text-[#fbbf24] transition-all flex items-center gap-3 group"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]/40 group-hover:bg-[#fbbf24] transition-colors" />
                              <span className="flex-1 text-sm">
                                {sub.label}
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

            {isLoggedIn && role === "seller" && (
              <button
                onClick={() => navigate("/seller")}
                className={`text-lg ${
                  isActive("/seller") ? "text-[#fbbf24]" : "text-foreground/90"
                }`}
              >
                Sell
              </button>
            )}
          </nav>

          {/* Search */}
          <div className="hidden lg:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search auctions..."
                className="pl-10"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchValue.trim()) {
                    navigate(`/search?q=${encodeURIComponent(searchValue)}`);
                    setSearchValue("");
                  }
                }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isLoggedIn && role === "bidder" && (
              <NotificationDropdown
                notifications={notifications}
                unreadCount={unreadCount}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
                onDelete={handleDeleteNotification}
                onViewAll={() => navigate("/notifications")}
                onNotificationClick={handleNotificationClick}
              />
            )}

            {isLoggedIn && role === "bidder" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/dashboard")}
              >
                <User className="h-5 w-5" />
              </Button>
            )}

            {isLoggedIn && role === "admin" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/admin")}
              >
                <Shield className="h-5 w-5" />
              </Button>
            )}

            {/* LOGOUT */}
            {isLoggedIn && (
              <Button
                variant="ghost"
                className="text-red-400 hover:text-red-500"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            )}

            {/* LOGIN */}
            {!isLoggedIn && (
              <Button
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black"
              >
                Start Bidding
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
