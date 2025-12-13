import { useState, useEffect } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { X, Filter, ChevronDown, ChevronRight } from "lucide-react";
import { type CategoryTreeDTO } from "../../types/dto";

interface FilterSidebarProps {
  onClose?: () => void;
  categories: CategoryTreeDTO[];
  selectedMainCategory?: string | null;
  selectedSubCategory?: string | null;

  selectedCategories?: string[];
  priceRange?: [number, number];

  expandedCategories: string[];
  onExpandedChange: (expanded: string[]) => void;

  onApplyFilters: (filters: {
    categories: string[];
    price: [number, number];
  }) => void;

  onClearAll?: () => void;
}

export function FilterSidebar({
  onClose,
  onApplyFilters,
  categories,
  selectedMainCategory,
  selectedSubCategory,
  expandedCategories,
  onExpandedChange,
  onClearAll,
  selectedCategories: externalSelected = [],
  priceRange: externalPrice = [0, 10000],
}: FilterSidebarProps) {
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(externalSelected);
  const [priceRange, setPriceRange] = useState<[number, number]>(externalPrice);

  useEffect(() => {
    setSelectedCategories(externalSelected);
    setPriceRange(externalPrice);
  }, [externalSelected, externalPrice]);

  useEffect(() => {
    if (!selectedMainCategory) return;

    let newSel = [...selectedCategories];
    let newExp = [...expandedCategories];

    categories.forEach((main) => {
      const mainId = String(main.id);

      if (mainId === selectedMainCategory) {
        const subIds = main.subcategories.map((s) => String(s.id));
        newSel.push(mainId);
        newSel.push(...subIds);
        newExp.push(mainId);
      }

      main.subcategories.forEach((sub) => {
        const subId = String(sub.id);
        if (subId === selectedMainCategory) {
          newSel.push(subId);
          newExp.push(mainId);

          const allChecked = main.subcategories.every((s) =>
            newSel.includes(String(s.id))
          );
          if (allChecked) newSel.push(mainId);
        }
      });
    });

    setSelectedCategories([...new Set(newSel)]);
    onExpandedChange([...new Set(newExp)]);
  }, [selectedMainCategory]);

  const toggleCategory = (id: string, isParent = false, parentId?: string) => {
    setSelectedCategories((prev) => {
      let updated = [...prev];

      if (isParent) {
        const parent = categories.find((c) => String(c.id) === id);
        if (!parent) return prev;

        const subIds = parent.subcategories.map((s) => String(s.id));
        const includeAll = !subIds.every((sid) => prev.includes(sid));

        updated = includeAll
          ? [...new Set([...updated, id, ...subIds])]
          : updated.filter((x) => x !== id && !subIds.includes(x));

        if (!expandedCategories.includes(id)) {
          onExpandedChange([...expandedCategories, id]);
        }
      } else {
        updated = updated.includes(id)
          ? updated.filter((x) => x !== id)
          : [...updated, id];

        if (parentId) {
          const parent = categories.find((c) => String(c.id) === parentId);
          if (parent) {
            const subIds = parent.subcategories.map((s) => String(s.id));
            const allSelected = subIds.every((sid) => updated.includes(sid));

            updated = allSelected
              ? [...new Set([...updated, parentId])]
              : updated.filter((x) => x !== parentId);

            if (!expandedCategories.includes(parentId)) {
              onExpandedChange([...expandedCategories, parentId]);
            }
          }
        }
      }
      return [...new Set(updated)];
    });
  };

  const toggleExpand = (id: string) => {
    const updated = expandedCategories.includes(id)
      ? expandedCategories.filter((x) => x !== id)
      : [...expandedCategories, id];

    onExpandedChange(updated);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 10000]);
    onExpandedChange([]);
    onClearAll?.();
  };

  const activeFiltersCount =
    selectedCategories.length +
    (priceRange[0] !== 0 || priceRange[1] !== 10000 ? 1 : 0);

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

        <div
          className={`flex items-center justify-between mt-3 transition-opacity duration-200 ${
            activeFiltersCount > 0
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <Badge
            variant="secondary"
            className="bg-[#fbbf24]/10 text-[#fbbf24] border-[#fbbf24]/20"
          >
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
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Categories */}
        <div className="space-y-4">
          <h4 className="text-foreground">Categories</h4>

          <div className="space-y-1">
            {categories.map((category) => {
              const id = category.id.toString();
              const selected = selectedCategories.includes(id);
              const expanded = expandedCategories.includes(id);

              return (
                <div key={category.id}>
                  {/* Parent Category */}
                  <div className="flex items-center justify-between group hover:bg-secondary/30 rounded-lg px-2 py-1.5 transition-colors">
                    <div className="flex items-center gap-2 flex-1">
                      <Checkbox
                        id={`cat-${category.id}`}
                        checked={selected}
                        onCheckedChange={() => toggleCategory(id, true)}
                        className="data-[state=checked]:bg-[#fbbf24] data-[state=checked]:border-[#fbbf24]"
                      />

                      <Label
                        htmlFor={`cat-${category.id}`}
                        className="flex-1 cursor-pointer text-foreground/90 hover:text-foreground transition-colors"
                      >
                        {category.label}
                      </Label>
                    </div>

                    <button
                      onClick={() => toggleExpand(id)}
                      className="p-1 rounded hover:bg-[#fbbf24]/10 text-foreground transition-all"
                    >
                      {expanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>

                    <span className="text-muted-foreground text-sm">
                      {category.count}
                    </span>
                  </div>

                  {/* Subcategories */}
                  {expanded && category.subcategories?.length > 0 && (
                    <div className="ml-8 mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
                      {category.subcategories.map((subcategory) => (
                        <div
                          key={subcategory.id}
                          className="flex items-center justify-between group hover:bg-secondary/30 rounded-lg px-2 py-1.5 transition-colors"
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <Checkbox
                              id={`sub-${subcategory.id}`}
                              checked={selectedCategories.includes(
                                subcategory.id.toString()
                              )}
                              onCheckedChange={() =>
                                toggleCategory(
                                  subcategory.id.toString(),
                                  false,
                                  id
                                )
                              }
                            />
                            <Label
                              htmlFor={`subcat-${subcategory.id}`}
                              className="flex-1 cursor-pointer text-foreground/80 hover:text-foreground transition-colors text-sm"
                            >
                              {subcategory.label}
                            </Label>
                          </div>

                          <span className="text-muted-foreground text-sm">
                            {subcategory.count}
                          </span>
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
              max={10000}
              step={1000}
              value={priceRange}
              onValueChange={(v) => setPriceRange(v as [number, number])}
              className="w-full"
            />
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 rounded-lg bg-secondary/50 border border-border/50 px-3 py-2">
                <p className="text-muted-foreground">Min</p>
                <p className="text-foreground">
                  ${priceRange[0].toLocaleString()}
                </p>
              </div>
              <span className="text-muted-foreground">—</span>
              <div className="flex-1 rounded-lg bg-secondary/50 border border-border/50 px-3 py-2">
                <p className="text-muted-foreground">Max</p>
                <p className="text-foreground">
                  ${priceRange[1].toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-border">
        <Button
          onClick={() =>
            onApplyFilters({
              categories: selectedCategories,
              price: priceRange,
            })
          }
          className="w-full bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90"
        >
          Apply Filters
        </Button>
      </div>
    </aside>
  );
}
