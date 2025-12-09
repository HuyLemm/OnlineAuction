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
import { type CategoryTree } from "../../types/dto";

interface BrowseTopBarProps {
  totalItems: number;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onFilterToggle?: () => void;
  showFilterToggle?: boolean;

  selectedCategories?: string[];
  priceRange?: [number, number];
  categories?: CategoryTree[]; // NEW

  onRemoveCategory?: (id: string) => void;
  onResetPrice?: () => void;

  onSortChange?: (sort: string) => void;
  sortBy?: string;
}

export function BrowseTopBar({
  totalItems,
  viewMode,
  onViewModeChange,
  onFilterToggle,
  showFilterToggle = false,

  selectedCategories = [],
  priceRange = [0, 10000],
  categories = [],
  onRemoveCategory,
  onResetPrice,

  onSortChange,
  sortBy = "default",
}: BrowseTopBarProps) {
  const hasActivePrice = priceRange[0] > 0 || priceRange[1] < 10000;
  const hasActiveFilters = selectedCategories.length > 0 || hasActivePrice;

  // ⭐ Convert ID → Category Name
  const getCategoryName = (id: string) => {
    let found =
      categories.find((c) => String(c.id) === id) ||
      categories
        .flatMap((c) =>
          c.subcategories.map((s) => ({
            id: s.id,
            label: s.label,
          }))
        )
        .find((c) => String(c.id) === id);

    return found?.label || id;
  };

  return (
    <div className="bg-card border-b border-border">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          {/* Mobile filter toggle */}
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

            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search auctions..."
                className="pl-10 bg-secondary/50 border-border/50"
              />
            </div>
          </div>

          {/* Sort + View Mode */}
          <div className="flex items-center gap-4">
            <span className="hidden sm:flex text-muted-foreground">
              {totalItems.toLocaleString()} items
            </span>

            {/* Sorting Select */}
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-[180px] bg-secondary/50 border-border/50">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="ending-soon">Ending Soon</SelectItem>
                <SelectItem value="newly-listed">Newly Listed</SelectItem>
                <SelectItem value="price-low">Price: Low → High</SelectItem>
                <SelectItem value="price-high">Price: High → Low</SelectItem>
                <SelectItem value="most-bids">Most Bids</SelectItem>
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
                    ? "bg-[#fbbf24]/10 text-[#fbbf24] hover:bg-[#fbbf24]/20"
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
                    ? "bg-[#fbbf24]/10 text-[#fbbf24] hover:bg-[#fbbf24]/20"
                    : ""
                }`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* 🔥 Active Filters */}
        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap gap-3 items-center">
            <span className="text-muted-foreground font-medium">
              Active filters:
            </span>

            {/* Category Badges (Name visible) */}
            {selectedCategories.map((catId) => (
              <Badge
                key={catId}
                variant="outline"
                className="border-[#fbbf24]/30 bg-[#fbbf24]/10 text-[#fbbf24] px-3 py-1.5 gap-2 text-sm"
              >
                {getCategoryName(catId)}
                <button
                  onClick={() => onRemoveCategory?.(catId)}
                  className="ml-1 hover:text-[#f59e0b]"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}

            {/* Price range badge */}
            {hasActivePrice && (
              <Badge
                variant="outline"
                className="border-[#fbbf24]/30 bg-[#fbbf24]/10 text-[#fbbf24] px-3 py-1.5 gap-2 text-sm"
              >
                ${priceRange[0].toLocaleString()} – $
                {priceRange[1].toLocaleString()}
                <button
                  onClick={onResetPrice}
                  className="ml-1 hover:text-blue-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
