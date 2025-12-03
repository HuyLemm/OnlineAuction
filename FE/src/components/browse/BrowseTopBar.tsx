import { useState } from "react";
import { Search, SlidersHorizontal, Grid3x3, List, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface BrowseTopBarProps {
  totalItems: number;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onFilterToggle?: () => void;
  showFilterToggle?: boolean;
  selectedCategory?: string | null;
  onClearCategory?: () => void;
}

export function BrowseTopBar({
  totalItems,
  viewMode,
  onViewModeChange,
  onFilterToggle,
  showFilterToggle = false,
  selectedCategory,
  onClearCategory,
}: BrowseTopBarProps) {
  const [sortBy, setSortBy] = useState("ending-soon");

  return (
    <div className="bg-card border-b border-border">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          {/* Left: Search & Filter Toggle */}
          <div className="flex items-center gap-3 flex-1 max-w-2xl">
            {showFilterToggle && (
              <Button
                variant="outline"
                size="icon"
                onClick={onFilterToggle}
                className="lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            )}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search auctions..."
                className="pl-10 bg-secondary/50 border-border/50"
              />
            </div>
          </div>

          {/* Right: Results Count, Sort, View Mode */}
          <div className="flex items-center gap-4">
            {/* Results Count */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-muted-foreground">
                {totalItems.toLocaleString()} items
              </span>
            </div>

            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-secondary/50 border-border/50">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ending-soon">Ending Soon</SelectItem>
                <SelectItem value="newly-listed">Newly Listed</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="most-bids">Most Bids</SelectItem>
                <SelectItem value="most-watched">Most Watched</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 rounded-lg bg-secondary/50 border border-border/50 p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => onViewModeChange("grid")}
                className={`h-8 w-8 ${
                  viewMode === "grid"
                    ? "bg-[#fbbf24]/10 text-[#fbbf24] hover:bg-[#fbbf24]/20 hover:text-[#fbbf24]"
                    : ""
                }`}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => onViewModeChange("list")}
                className={`h-8 w-8 ${
                  viewMode === "list"
                    ? "bg-[#fbbf24]/10 text-[#fbbf24] hover:bg-[#fbbf24]/20 hover:text-[#fbbf24]"
                    : ""
                }`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Selected Category Badge */}
        {selectedCategory && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-muted-foreground">Filtered by:</span>
            <Badge
              variant="outline"
              className="border-[#fbbf24]/30 bg-[#fbbf24]/10 text-[#fbbf24] hover:bg-[#fbbf24]/20 px-3 py-1.5 gap-2"
            >
              {selectedCategory}
              <button
                onClick={onClearCategory}
                className="ml-1 hover:text-[#f59e0b] transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}