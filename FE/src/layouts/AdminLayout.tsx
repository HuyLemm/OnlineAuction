import { type ReactNode, useState } from "react";
import {
  FolderTree,
  Package,
  Users,
  Shield,
  Menu,
  X,
  User,
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
}

export function AdminLayout({
  children,
  activeTab,
  onTabChange,
}: AdminLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { id: "profile", label: "Profile Settings", icon: User },
    { id: "categories", label: "Category Management", icon: FolderTree },
    { id: "products", label: "Product Management", icon: Package },
    { id: "users", label: "User Management", icon: Users },
  ];

  const NavContent = () => (
    <>
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#fbbf24] to-[#f59e0b]">
            <Shield className="h-5 w-5 text-black" />
          </div>
          <div>
            <h2 className="text-foreground">Administrator</h2>
            <p className="text-muted-foreground text-sm">
              System control panel
            </p>
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
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition ${
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
                <Badge className="bg-red-500/10 text-green-500 border-0">
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
      <aside className="hidden lg:flex lg:w-80 flex-col bg-card border-r">
        <NavContent />
      </aside>

      <Button
        size="icon"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed bottom-6 right-6 lg:hidden z-50 rounded-full bg-[#fbbf24] text-black"
      >
        {mobileMenuOpen ? <X /> : <Menu />}
      </Button>

      {mobileMenuOpen && (
        <aside className="fixed inset-y-0 left-0 w-80 bg-card z-40">
          <NavContent />
        </aside>
      )}

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
