import { useState, useEffect } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { X, Filter, ChevronDown, ChevronRight } from "lucide-react";

interface FilterSidebarProps {
  onClose?: () => void;
  selectedMainCategory?: string | null;
  selectedSubCategory?: string | null;
}

export function FilterSidebar({ onClose, selectedMainCategory, selectedSubCategory }: FilterSidebarProps) {
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<string[]>([]);

  // Category structure with parent-child relationships - Only main categories with subcategories
  const categoryHierarchy = [
    {
      id: "electronics",
      label: "Electronic Devices",
      count: 312,
      subcategories: [
        { id: "smartphones", label: "Smartphones", count: 145 },
        { id: "laptops", label: "Laptops", count: 89 },
        { id: "tablets", label: "Tablets", count: 45 },
        { id: "accessories", label: "Accessories", count: 33 }
      ]
    },
    {
      id: "fashion",
      label: "Fashion & Accessories",
      count: 428,
      subcategories: [
        { id: "watches", label: "Watches", count: 101 },
        { id: "handbags", label: "Handbags", count: 156 },
        { id: "shoes", label: "Shoes", count: 134 },
        { id: "clothing", label: "Clothing", count: 37 }
      ]
    },
    {
      id: "art",
      label: "Art & Collectibles",
      count: 189,
      subcategories: [
        { id: "paintings", label: "Paintings", count: 67 },
        { id: "sculptures", label: "Sculptures", count: 45 },
        { id: "photography", label: "Photography", count: 34 },
        { id: "antiques", label: "Antiques", count: 43 }
      ]
    },
    {
      id: "vehicles",
      label: "Vehicles",
      count: 67,
      subcategories: [
        { id: "vintage-cars", label: "Vintage Cars", count: 32 },
        { id: "sports-cars", label: "Sports Cars", count: 18 },
        { id: "motorcycles", label: "Motorcycles", count: 12 },
        { id: "auto-parts", label: "Auto Parts", count: 5 }
      ]
    },
    {
      id: "jewelry",
      label: "Jewelry",
      count: 156,
      subcategories: [
        { id: "rings", label: "Rings", count: 56 },
        { id: "necklaces", label: "Necklaces", count: 45 },
        { id: "bracelets", label: "Bracelets", count: 34 },
        { id: "earrings", label: "Earrings", count: 21 }
      ]
    },
    {
      id: "collectibles",
      label: "Collectibles",
      count: 312,
      subcategories: [
        { id: "stamps", label: "Stamps", count: 89 },
        { id: "coins", label: "Coins", count: 123 },
        { id: "toys", label: "Toys", count: 67 },
        { id: "sports-memorabilia", label: "Sports Memorabilia", count: 33 }
      ]
    }
  ];

  // Map menu categories to filter categories
  const categoryMapping: Record<string, string> = {
    "Electronic Devices": "electronics",
    "Smartphones": "smartphones",
    "Laptops": "laptops",
    "Tablets": "tablets",
    "Accessories": "accessories",
    
    "Fashion & Accessories": "fashion",
    "Watches": "watches",
    "Handbags": "handbags",
    "Shoes": "shoes",
    "Clothing": "clothing",
    
    "Art & Collectibles": "art",
    "Paintings": "paintings",
    "Sculptures": "sculptures",
    "Photography": "photography",
    "Antiques": "antiques",
    
    "Vehicles": "vehicles",
    "Vintage Cars": "vintage-cars",
    "Sports Cars": "sports-cars",
    "Motorcycles": "motorcycles",
    "Auto Parts": "auto-parts",
    
    "Jewelry": "jewelry",
    "Rings": "rings",
    "Necklaces": "necklaces",
    "Bracelets": "bracelets",
    "Earrings": "earrings",
    
    "Collectibles": "collectibles",
    "Stamps": "stamps",
    "Coins": "coins",
    "Toys": "toys",
    "Sports Memorabilia": "sports-memorabilia"
  };

  // Auto-select and expand categories when menu selection changes
  useEffect(() => {
    const categoriesToSelect: string[] = [];
    const categoriesToExpand: string[] = [];
    
    if (selectedMainCategory) {
      const mainCategoryId = categoryMapping[selectedMainCategory];
      if (mainCategoryId) {
        categoriesToSelect.push(mainCategoryId);
        categoriesToExpand.push(mainCategoryId);
      }
    }
    
    if (selectedSubCategory) {
      const subCategoryId = categoryMapping[selectedSubCategory];
      if (subCategoryId && !categoriesToSelect.includes(subCategoryId)) {
        categoriesToSelect.push(subCategoryId);
      }
    }
    
    if (categoriesToSelect.length > 0) {
      setSelectedCategories(categoriesToSelect);
    }
    
    if (categoriesToExpand.length > 0) {
      setExpandedCategories(categoriesToExpand);
    }
  }, [selectedMainCategory, selectedSubCategory]);

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

  const toggleExpand = (id: string) => {
    setExpandedCategories(prev =>
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
    setExpandedCategories([]);
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
        {/* Always reserve space for active filters - use opacity instead of conditional rendering */}
        <div className={`flex items-center justify-between mt-3 transition-opacity duration-200 ${
          activeFiltersCount > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
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
      </div>

      {/* Scrollable Filters */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Categories */}
        <div className="space-y-4">
          <h4 className="text-foreground">Categories</h4>
          <div className="space-y-1">
            {categoryHierarchy.map((category) => {
              const isExpanded = expandedCategories.includes(category.id);
              const isSelected = selectedCategories.includes(category.id);
              const hasSubcategories = category.subcategories.length > 0;

              return (
                <div key={category.id}>
                  {/* Parent Category */}
                  <div className="flex items-center justify-between group hover:bg-secondary/30 rounded-lg px-2 py-1.5 transition-colors">
                    <div className="flex items-center gap-2 flex-1">
                      <Checkbox
                        id={category.id}
                        checked={isSelected}
                        onCheckedChange={() => toggleCategory(category.id)}
                        className="data-[state=checked]:bg-[#fbbf24] data-[state=checked]:border-[#fbbf24]"
                      />
                      <Label
                        htmlFor={category.id}
                        className="flex-1 cursor-pointer text-foreground/90 hover:text-foreground transition-colors"
                      >
                        {category.label}
                      </Label>
                      {hasSubcategories && (
                        <button
                          onClick={() => toggleExpand(category.id)}
                          className="p-1 rounded hover:bg-[#fbbf24]/10 text-foreground transition-all"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </div>
                    <span className="text-muted-foreground text-sm">{category.count}</span>
                  </div>

                  {/* Subcategories - Only show if expanded */}
                  {isExpanded && hasSubcategories && (
                    <div className="ml-8 mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
                      {category.subcategories.map((subcategory) => (
                        <div 
                          key={subcategory.id} 
                          className="flex items-center justify-between group hover:bg-secondary/30 rounded-lg px-2 py-1.5 transition-colors"
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <Checkbox
                              id={subcategory.id}
                              checked={selectedCategories.includes(subcategory.id)}
                              onCheckedChange={() => toggleCategory(subcategory.id)}
                              className="data-[state=checked]:bg-[#fbbf24] data-[state=checked]:border-[#fbbf24]"
                            />
                            <Label
                              htmlFor={subcategory.id}
                              className="flex-1 cursor-pointer text-foreground/80 hover:text-foreground transition-colors text-sm"
                            >
                              {subcategory.label}
                            </Label>
                          </div>
                          <span className="text-muted-foreground text-sm">{subcategory.count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
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