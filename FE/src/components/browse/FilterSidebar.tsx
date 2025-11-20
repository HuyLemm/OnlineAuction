import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { X, Filter } from "lucide-react";

interface FilterSidebarProps {
  onClose?: () => void;
}

export function FilterSidebar({ onClose }: FilterSidebarProps) {
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<string[]>([]);

  const categories = [
    { id: "watches", label: "Watches", count: 234 },
    { id: "art", label: "Art", count: 189 },
    { id: "vintage-cars", label: "Vintage Cars", count: 67 },
    { id: "jewelry", label: "Jewelry", count: 156 },
    { id: "collectibles", label: "Collectibles", count: 312 },
    { id: "fashion", label: "Fashion", count: 428 },
    { id: "furniture", label: "Furniture", count: 145 },
    { id: "sports", label: "Sports", count: 98 }
  ];

  const statusOptions = [
    { id: "live", label: "Live Auction", count: 456 },
    { id: "ending-soon", label: "Ending Soon", count: 89 },
    { id: "hot", label: "Hot Items", count: 123 },
    { id: "new", label: "New Listings", count: 234 }
  ];

  const ratingOptions = [
    { id: "5", label: "5 Stars", count: 234 },
    { id: "4", label: "4+ Stars", count: 567 },
    { id: "3", label: "3+ Stars", count: 890 },
  ];

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleStatus = (id: string) => {
    setSelectedStatus(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const toggleRating = (id: string) => {
    setSelectedRating(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedStatus([]);
    setSelectedRating([]);
    setPriceRange([0, 100000]);
  };

  const activeFiltersCount = selectedCategories.length + selectedStatus.length + selectedRating.length;

  return (
    <aside className="h-full flex flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-[#fbbf24]" />
            <h3 className="text-foreground">Filters</h3>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <div className="flex items-center justify-between mt-3">
            <Badge variant="secondary" className="bg-[#fbbf24]/10 text-[#fbbf24] border-[#fbbf24]/20">
              {activeFiltersCount} active
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-auto p-0 text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Scrollable Filters */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Categories */}
        <div className="space-y-4">
          <h4 className="text-foreground">Categories</h4>
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <Checkbox
                    id={category.id}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => toggleCategory(category.id)}
                  />
                  <Label
                    htmlFor={category.id}
                    className="flex-1 cursor-pointer text-foreground/90 hover:text-foreground transition-colors"
                  >
                    {category.label}
                  </Label>
                </div>
                <span className="text-muted-foreground">{category.count}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Price Range */}
        <div className="space-y-4">
          <h4 className="text-foreground">Price Range</h4>
          <div className="space-y-4">
            <Slider
              min={0}
              max={100000}
              step={1000}
              value={priceRange}
              onValueChange={setPriceRange}
              className="w-full"
            />
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 rounded-lg bg-secondary/50 border border-border/50 px-3 py-2">
                <p className="text-muted-foreground">Min</p>
                <p className="text-foreground">${priceRange[0].toLocaleString()}</p>
              </div>
              <span className="text-muted-foreground">—</span>
              <div className="flex-1 rounded-lg bg-secondary/50 border border-border/50 px-3 py-2">
                <p className="text-muted-foreground">Max</p>
                <p className="text-foreground">${priceRange[1].toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Auction Status */}
        <div className="space-y-4">
          <h4 className="text-foreground">Auction Status</h4>
          <div className="space-y-3">
            {statusOptions.map((status) => (
              <div key={status.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <Checkbox
                    id={status.id}
                    checked={selectedStatus.includes(status.id)}
                    onCheckedChange={() => toggleStatus(status.id)}
                  />
                  <Label
                    htmlFor={status.id}
                    className="flex-1 cursor-pointer text-foreground/90 hover:text-foreground transition-colors"
                  >
                    {status.label}
                  </Label>
                </div>
                <span className="text-muted-foreground">{status.count}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Seller Rating */}
        <div className="space-y-4">
          <h4 className="text-foreground">Seller Rating</h4>
          <div className="space-y-3">
            {ratingOptions.map((rating) => (
              <div key={rating.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <Checkbox
                    id={`rating-${rating.id}`}
                    checked={selectedRating.includes(rating.id)}
                    onCheckedChange={() => toggleRating(rating.id)}
                  />
                  <Label
                    htmlFor={`rating-${rating.id}`}
                    className="flex-1 cursor-pointer text-foreground/90 hover:text-foreground transition-colors"
                  >
                    {rating.label}
                  </Label>
                </div>
                <span className="text-muted-foreground">{rating.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-border">
        <Button 
          className="w-full bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90"
        >
          Apply Filters
        </Button>
      </div>
    </aside>
  );
}
