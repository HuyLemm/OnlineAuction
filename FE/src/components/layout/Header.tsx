import { Search, Bell, User, Gavel } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface HeaderProps {
  onNavigate?: (page: "home" | "browse" | "detail") => void;
  currentPage?: string;
}

export function Header({ onNavigate, currentPage = "home" }: HeaderProps) {
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
            <span className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] bg-clip-text text-transparent">
              LuxeAuction
            </span>
          </button>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => onNavigate?.("browse")}
              className={`transition-colors ${
                currentPage === "browse"
                  ? "text-[#fbbf24]"
                  : "text-foreground/90 hover:text-foreground"
              }`}
            >
              Live Auctions
            </button>
            <button className="text-foreground/90 hover:text-foreground transition-colors">
              Categories
            </button>
            <button className="text-foreground/90 hover:text-foreground transition-colors">
              How It Works
            </button>
            <button className="text-foreground/90 hover:text-foreground transition-colors">
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
                className="pl-10 bg-secondary/50 border-border/50"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#ef4444] text-[10px] flex items-center justify-center">
                3
              </span>
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Button className="hidden md:inline-flex bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90">
              Start Bidding
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}