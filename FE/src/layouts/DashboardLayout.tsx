import { type ReactNode, useState } from "react";
import {
  Gavel,
  Heart,
  TrendingUp,
  Trophy,
  History,
  Star,
  Settings,
  Store,
  Menu,
  X,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

interface DashboardLayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  badge?: number;
}

export function DashboardLayout({
  children,
  activeTab,
  onTabChange,
}: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      id: "profile",
      label: "Profile Settings",
      icon: Settings,
    },
    {
      id: "reviews",
      label: "Ratings & Reviews",
      icon: Star,
    },
    {
      id: "watchlist",
      label: "Watchlist",
      icon: Heart,
    },
    {
      id: "active-bids",
      label: "My Active Bids",
      icon: Gavel,
    },
    {
      id: "won-auctions",
      label: "Won Auctions",
      icon: Trophy,
    },
    {
      id: "become-seller",
      label: "Become a Seller",
      icon: Store,
    },
  ];

  const NavContent = () => (
    <>
      <div className="p-6 border-b border-border/50">
        <h2 className="text-foreground mb-1">Dashboard</h2>
        <p className="text-muted-foreground">
          Manage your auctions and profile
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-gradient-to-r from-[#fbbf24]/10 to-[#f59e0b]/10 text-[#fbbf24] border border-[#fbbf24]/20"
                  : "text-foreground/80 hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <Badge
                  variant="secondary"
                  className="bg-[#fbbf24]/10 text-[#fbbf24] border-0"
                >
                  {item.badge}
                </Badge>
              )}
            </button>
          );
        })}
      </nav>
    </>
  );

  return (
    <div className="flex min-h-[calc(100vh-73px)]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-80 flex-col bg-card border-r border-border/50">
        <NavContent />
      </aside>

      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed bottom-6 right-6 lg:hidden z-50 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black border-0"
      >
        {mobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-80 bg-card border-r border-border/50 flex flex-col animate-in slide-in-from-left">
            <NavContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}
