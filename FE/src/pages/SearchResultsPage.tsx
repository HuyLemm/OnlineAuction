import { useState, useEffect } from "react";
import { SearchInput } from "../components/search/SearchInput";
import { FilterChips, type ActiveFilter } from "../components/search/FilterChips";
import { SortDropdown, type SortOption } from "../components/search/SortDropdown";
import { SearchResultCard, type SearchResult } from "../components/search/SearchResultCard";
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

interface SearchResultsPageProps {
  initialQuery?: string;
  onNavigate?: (page: "home" | "browse" | "detail") => void;
}

export function SearchResultsPage({ initialQuery = "", onNavigate }: SearchResultsPageProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("ending_soon");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const resultsPerPage = 12;

  // Update search query when initialQuery changes (e.g., when searching from header while on search page)
  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  // Helper to create dates relative to now
  const daysAgo = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
  };

  // Mock data - in real app, this would come from API
  const mockResults: SearchResult[] = [
    {
      id: "1",
      title: "Rolex Submariner Date - Vintage Gold Edition",
      image: "https://images.unsplash.com/photo-1726981407933-06fe96c4cefa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaCUyMGdvbGR8ZW58MXx8fHwxNzY0Njc0NTkzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 15000,
      bidCount: 24,
      endTime: new Date(Date.now() + 1.5 * 60 * 60 * 1000),
      category: "Watches",
      postedDate: daysAgo(5),
      seller: "LuxuryTimepieces",
    },
    {
      id: "2",
      title: "Vintage Leica M3 Camera - Rare Gold Plated Limited Edition",
      image: "https://images.unsplash.com/photo-1495121553079-4c61bcce1894?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY2FtZXJhfGVufDF8fHx8MTc2NDc3NDQxOXww&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 4500,
      bidCount: 18,
      endTime: new Date(Date.now() + 5 * 60 * 60 * 1000),
      category: "Collectibles",
      postedDate: daysAgo(3),
      seller: "VintageCollector",
    },
    {
      id: "3",
      title: "3 Carat Diamond Ring - 18K Gold Setting",
      image: "https://images.unsplash.com/photo-1629201688905-697730d24490?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWFtb25kJTIwcmluZyUyMGpld2Vscnl8ZW58MXx8fHwxNzY0NzUwOTE1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 25000,
      bidCount: 42,
      endTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
      category: "Jewelry",
      postedDate: daysAgo(12),
      seller: "DiamondVault",
    },
    {
      id: "4",
      title: "Original Oil Painting - Golden Sunset Masterpiece",
      image: "https://images.unsplash.com/photo-1552832036-5ce6f9568f9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbnRpcXVlJTIwcGFpbnRpbmclMjBhcnR8ZW58MXx8fHwxNzY0Nzg0MDkxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 8900,
      bidCount: 15,
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      category: "Art & Collectibles",
      postedDate: daysAgo(2),
      seller: "ArtGalleryPro",
    },
    {
      id: "5",
      title: "Louis Vuitton Gold Edition Handbag - Limited Collection",
      image: "https://images.unsplash.com/photo-1601924928357-22d3b3abfcfb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMGhhbmRiYWd8ZW58MXx8fHwxNzY0NzA3NDIzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 3200,
      bidCount: 31,
      endTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
      category: "Fashion & Accessories",
      postedDate: daysAgo(18),
      seller: "FashionLux",
    },
    {
      id: "6",
      title: "1959 Fender Stratocaster - Gold Hardware Vintage Guitar",
      image: "https://images.unsplash.com/photo-1567532935988-6191412871e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwZ3VpdGFyfGVufDF8fHx8MTc2NDc0ODA4MHww&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 12500,
      bidCount: 28,
      endTime: new Date(Date.now() + 12 * 60 * 60 * 1000),
      category: "Collectibles",
      postedDate: daysAgo(1),
      seller: "MusicVintage",
    },
    {
      id: "7",
      title: "Cartier Tank Gold Watch - Classic Elegance",
      image: "https://images.unsplash.com/photo-1726981407933-06fe96c4cefa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaCUyMGdvbGR8ZW58MXx8fHwxNzY0Njc0NTkzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 18500,
      bidCount: 35,
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      category: "Watches",
      postedDate: daysAgo(22),
      seller: "LuxuryTimepieces",
    },
    {
      id: "8",
      title: "Antique Gold Pocket Watch - Victorian Era",
      image: "https://images.unsplash.com/photo-1726981407933-06fe96c4cefa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaCUyMGdvbGR8ZW58MXx8fHwxNzY0Njc0NTkzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 2800,
      bidCount: 12,
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000),
      category: "Collectibles",
      postedDate: daysAgo(4),
      seller: "AntiqueCollector",
    },
  ];

  // Filter results based on search and filters
  const getFilteredResults = () => {
    let filtered = [...mockResults];

    // Apply search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    const categoryFilter = activeFilters.find((f) => f.type === "category");
    if (categoryFilter) {
      filtered = filtered.filter((item) => item.category === categoryFilter.value);
    }

    // Apply price filter
    const priceFilter = activeFilters.find((f) => f.type === "price");
    if (priceFilter) {
      if (priceFilter.value === "Under $5,000") {
        filtered = filtered.filter((item) => item.currentBid < 5000);
      } else if (priceFilter.value === "$5,000 - $15,000") {
        filtered = filtered.filter((item) => item.currentBid >= 5000 && item.currentBid <= 15000);
      } else if (priceFilter.value === "Over $15,000") {
        filtered = filtered.filter((item) => item.currentBid > 15000);
      }
    }

    // Apply sorting
    switch (sortBy) {
      case "ending_soon":
        filtered.sort((a, b) => a.endTime.getTime() - b.endTime.getTime());
        break;
      case "price_asc":
        filtered.sort((a, b) => a.currentBid - b.currentBid);
        break;
      case "price_desc":
        filtered.sort((a, b) => b.currentBid - a.currentBid);
        break;
      case "newest":
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case "oldest":
        filtered.sort((a, b) => (a.isNew ? 1 : 0) - (b.isNew ? 1 : 0));
        break;
    }

    return filtered;
  };

  const filteredResults = getFilteredResults();
  const totalResults = filteredResults.length;
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilters, sortBy]);

  const handleRemoveFilter = (id: string) => {
    setActiveFilters((prev) => prev.filter((f) => f.id !== id));
  };

  const handleClearAllFilters = () => {
    setActiveFilters([]);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleAddCategoryFilter = (category: string) => {
    // Remove existing category filter
    setActiveFilters((prev) => prev.filter((f) => f.type !== "category"));
    // Add new category filter
    setActiveFilters((prev) => [
      ...prev,
      {
        type: "category",
        label: "Category",
        value: category,
        id: `category-${Date.now()}`,
      },
    ]);
  };

  const handleAddPriceFilter = (priceRange: string) => {
    // Remove existing price filter
    setActiveFilters((prev) => prev.filter((f) => f.type !== "price"));
    // Add new price filter
    setActiveFilters((prev) => [
      ...prev,
      {
        type: "price",
        label: "Price",
        value: priceRange,
        id: `price-${Date.now()}`,
      },
    ]);
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
            {totalResults} {totalResults === 1 ? "item" : "items"} found
            {searchQuery && ` for "${searchQuery}"`}
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
          {/* Filter Chips */}
          <FilterChips
            filters={activeFilters}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearAllFilters}
          />

          {/* Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Category Filter Dropdown */}
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
                <DropdownMenuContent className="bg-[#1a1a1a] border-[#fbbf24]/20 text-white">
                  <DropdownMenuItem
                    onClick={() => handleAddCategoryFilter("Watches")}
                    className="text-gray-300 hover:bg-[#fbbf24]/10 hover:text-white cursor-pointer"
                  >
                    Watches
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleAddCategoryFilter("Jewelry")}
                    className="text-gray-300 hover:bg-[#fbbf24]/10 hover:text-white cursor-pointer"
                  >
                    Jewelry
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleAddCategoryFilter("Collectibles")}
                    className="text-gray-300 hover:bg-[#fbbf24]/10 hover:text-white cursor-pointer"
                  >
                    Collectibles
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleAddCategoryFilter("Art & Collectibles")}
                    className="text-gray-300 hover:bg-[#fbbf24]/10 hover:text-white cursor-pointer"
                  >
                    Art & Collectibles
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleAddCategoryFilter("Fashion & Accessories")}
                    className="text-gray-300 hover:bg-[#fbbf24]/10 hover:text-white cursor-pointer"
                  >
                    Fashion & Accessories
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Price Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-[#1a1a1a] border-[#fbbf24]/30 text-white hover:bg-[#1a1a1a]/80 hover:border-[#fbbf24]/50"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Price Range
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#1a1a1a] border-[#fbbf24]/20 text-white">
                  <DropdownMenuItem
                    onClick={() => handleAddPriceFilter("Under $5,000")}
                    className="text-gray-300 hover:bg-[#fbbf24]/10 hover:text-white cursor-pointer"
                  >
                    Under $5,000
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleAddPriceFilter("$5,000 - $15,000")}
                    className="text-gray-300 hover:bg-[#fbbf24]/10 hover:text-white cursor-pointer"
                  >
                    $5,000 - $15,000
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleAddPriceFilter("Over $15,000")}
                    className="text-gray-300 hover:bg-[#fbbf24]/10 hover:text-white cursor-pointer"
                  >
                    Over $15,000
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <SortDropdown value={sortBy} onChange={setSortBy} />

              {/* View Mode Toggle */}
              <div className="hidden sm:flex items-center gap-1 bg-[#1a1a1a] border border-[#fbbf24]/30 rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={
                    viewMode === "grid"
                      ? "bg-[#fbbf24]/20 text-[#fbbf24] hover:bg-[#fbbf24]/30"
                      : "text-gray-400 hover:text-white"
                  }
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={
                    viewMode === "list"
                      ? "bg-[#fbbf24]/20 text-[#fbbf24] hover:bg-[#fbbf24]/30"
                      : "text-gray-400 hover:text-white"
                  }
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {paginatedResults.length === 0 ? (
          <SearchEmptyState
            searchQuery={searchQuery}
            hasFilters={activeFilters.length > 0}
            onClearFilters={handleClearAllFilters}
            onBrowseAll={() => onNavigate?.("browse")}
          />
        ) : (
          <>
            {/* Results Grid */}
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {paginatedResults.map((item) => (
                <SearchResultCard
                  key={item.id}
                  item={item}
                  searchKeyword={searchQuery}
                  onClick={() => onNavigate?.("detail")}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <SearchPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalResults={totalResults}
                resultsPerPage={resultsPerPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}