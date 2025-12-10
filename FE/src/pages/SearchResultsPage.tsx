import { useState, useEffect } from "react";
import { SearchInput } from "../components/search/SearchInput";
import {
  FilterChips,
  type ActiveFilter,
} from "../components/search/FilterChips";
import {
  SortDropdown,
  type SortOption,
} from "../components/search/SortDropdown";
import { SearchResultCard } from "../components/search/SearchResultCard";
import { SearchPagination } from "../components/search/SearchPagination";
import { SearchEmptyState } from "../components/search/SearchEmptyState";
import { Filter, Grid, List } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

import {
  SEARCH_PRODUCTS_API,
  GET_MAIN_CATEGORIES_API,
} from "../components/utils/api";

interface SearchResultsPageProps {
  initialQuery?: string;
  onNavigate?: (page: "home" | "browse" | "detail") => void;
}

export function SearchResultsPage({
  initialQuery = "",
  onNavigate,
}: SearchResultsPageProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [results, setResults] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [categories, setCategories] = useState<any[]>([]);
  const limit = 20;

  // 🔹 Fetch Category Data
  const fetchCategories = async () => {
    try {
      const res = await fetch(GET_MAIN_CATEGORIES_API);
      const json = await res.json();
      if (json.success) {
        setCategories(json.data);
      }
    } catch (err) {
      console.error("❌ Fetch categories error:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 🔹 Fetch Product Search Results
  const fetchResults = async () => {
    try {
      const selectedCategories = activeFilters
        .filter((f) => f.type === "category")
        .map((f) => f.value)
        .join(",");

      const url = `${SEARCH_PRODUCTS_API}?keyword=${encodeURIComponent(
        searchQuery
      )}&page=${currentPage}&limit=${limit}&sort=${sortBy}${
        selectedCategories ? `&categoryIds=${selectedCategories}` : ""
      }`;

      const res = await fetch(url);
      const json = await res.json();
      if (!json.success) return;

      const updatedItems = json.data.map((item: any) => {
        const posted = new Date(item.postedDate ?? item.created_at);
        const diffMinutes = (Date.now() - posted.getTime()) / 60000;

        return {
          ...item,
          isNew: diffMinutes <= 60,
        };
      });

      setResults(updatedItems);
      setTotalPages(json.totalPages);
      setTotalItems(json.totalItems);
    } catch (err) {
      console.error("❌ Search API error:", err);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [searchQuery, activeFilters, sortBy, currentPage]);

  // 🔹 Filter Handling
  const handleRemoveFilter = (id: string) => {
    setActiveFilters((prev) => prev.filter((f) => f.id !== id));
  };

  const handleClearAllFilters = () => {
    setActiveFilters([]);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleToggleCategoryFilter = (
    categoryId: string,
    categoryName: string
  ) => {
    setActiveFilters((prev) => {
      const exists = prev.find(
        (f) => f.type === "category" && f.value === categoryId
      );
      if (exists) return prev.filter((f) => f.id !== exists.id);

      return [
        ...prev,
        {
          type: "category",
          label: categoryName,
          value: categoryId,
          id: `category-${categoryId}-${Date.now()}`,
        },
      ];
    });

    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] bg-clip-text text-transparent">
            Search Results
          </h1>
          <p className="text-gray-400">
            {totalItems} items found {searchQuery && `for "${searchQuery}"`}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={handleClearSearch}
            autoFocus
          />
        </div>

        {/* Filters & Controls */}
        <div className="mb-6 space-y-4">
          <FilterChips
            filters={activeFilters}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearAllFilters}
          />

          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Category Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-[#1a1a1a] border-[#fbbf24]/30 text-white hover:bg-[#1a1a1a]/80 hover:border-[#fbbf24]/50"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Category
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                className="bg-[#1a1a1a] border-[#fbbf24]/20 text-white min-w-[200px]"
              >
                {categories.length === 0 ? (
                  <DropdownMenuItem disabled className="text-gray-500">
                    Loading...
                  </DropdownMenuItem>
                ) : (
                  categories.map((cat) => (
                    <DropdownMenuItem
                      key={cat.id}
                      onClick={() =>
                        handleToggleCategoryFilter(String(cat.id), cat.name)
                      }
                      className="cursor-pointer text-gray-300 hover:bg-[#fbbf24]/10 hover:text-white"
                    >
                      {cat.name}
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort + View Toggle */}
            <div className="flex items-center gap-3">
              <SortDropdown value={sortBy} onChange={setSortBy} />

              <div className="hidden sm:flex gap-1">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {results.length === 0 ? (
          <SearchEmptyState
            searchQuery={searchQuery}
            hasFilters={activeFilters.length > 0}
            onClearFilters={handleClearAllFilters}
            onBrowseAll={() => onNavigate?.("browse")}
          />
        ) : (
          <>
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {results.map((item) => (
                <SearchResultCard
                  key={item.id}
                  item={item}
                  searchKeyword={searchQuery}
                  viewMode={viewMode}
                  onClick={() => onNavigate?.("detail")}
                />
              ))}
            </div>

            <SearchPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalResults={totalItems}
              resultsPerPage={limit}
            />
          </>
        )}
      </div>
    </div>
  );
}
