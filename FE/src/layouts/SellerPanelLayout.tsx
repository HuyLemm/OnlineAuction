import { useState } from "react";
import {
  PlusCircle,
  List,
  CheckCircle,
  Settings,
  Package,
} from "lucide-react";

interface SellerPanelLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function SellerPanelLayout({
  children,
  activeTab,
  onTabChange,
}: SellerPanelLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      id: "profile",
      label: "Profile Settings",
      icon: Settings,
    },
    {
      id: "create",
      label: "Create Auction",
      icon: PlusCircle,
    },
    {
      id: "active",
      label: "My Auctions (Open)",
      icon: List,
    },
    {
      id: "closed",
      label: "My Auctions (Closed & Won)",
      icon: CheckCircle,
    },
  ];

  return (
    <div className="flex min-h-[calc(100vh-73px)]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-80 flex-col bg-card border-r border-border/50">
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] flex items-center justify-center">
              <Package className="h-5 w-5 text-black" />
            </div>
            <h2 className="text-foreground">Seller Panel</h2>
          </div>
          <p className="text-muted-foreground">Manage your auctions</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-[#fbbf24]/10 to-[#f59e0b]/10 text-[#fbbf24] border border-[#fbbf24]/20"
                    : "text-foreground/80 hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}
