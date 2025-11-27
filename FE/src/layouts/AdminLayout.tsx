import { ReactNode, useState } from "react";
import { 
  LayoutDashboard, 
  FolderTree, 
  Package, 
  Users, 
  UserCheck, 
  Settings,
  Shield,
  Menu,
  X,
  BarChart3
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

interface AdminLayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  badge?: number;
  badgeVariant?: "default" | "destructive" | "warning";
}

export function AdminLayout({ children, activeTab, onTabChange }: AdminLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { id: "overview", label: "System Overview", icon: LayoutDashboard },
    { id: "analytics", label: "Analytics & Reports", icon: BarChart3 },
    { id: "categories", label: "Category Management", icon: FolderTree },
    { id: "products", label: "Product Moderation", icon: Package, badge: 8, badgeVariant: "warning" },
    { id: "users", label: "User Management", icon: Users },
    { id: "seller-approvals", label: "Seller Approvals", icon: UserCheck, badge: 5, badgeVariant: "destructive" },
    { id: "settings", label: "System Settings", icon: Settings },
  ];

  const NavContent = () => (
    <>
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#fbbf24] to-[#f59e0b]">
            <Shield className="h-5 w-5 text-black" />
          </div>
          <div>
            <h2 className="text-foreground">Admin Panel</h2>
            <p className="text-muted-foreground text-sm">System management</p>
          </div>
        </div>
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
                  className={
                    item.badgeVariant === "destructive" 
                      ? "bg-red-500/10 text-red-500 border-0"
                      : item.badgeVariant === "warning"
                      ? "bg-[#f59e0b]/10 text-[#f59e0b] border-0"
                      : "bg-[#fbbf24]/10 text-[#fbbf24] border-0"
                  }
                >
                  {item.badge}
                </Badge>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/50">
        <div className="rounded-lg bg-gradient-to-br from-[#fbbf24]/10 to-[#f59e0b]/10 border border-[#fbbf24]/20 p-4">
          <p className="text-sm text-muted-foreground mb-2">System Status</p>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-foreground">All systems operational</span>
          </div>
        </div>
      </div>
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
        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
