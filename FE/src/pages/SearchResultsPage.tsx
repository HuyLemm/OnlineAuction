import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

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
import { LoadingSpinner } from "../components/state";

import {
  SEARCH_PRODUCTS_API,
  GET_MAIN_CATEGORIES_API,
} from "../components/utils/api";

export function SearchResultsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  /* ---------------- URL params ---------------- */
  const query = searchParams.get("q") ?? "";
  const page = Number(searchParams.get("page") ?? 1);
  const sortBy = (searchParams.get("sort") as SortOption) ?? "default";
  const categoryIdsParam = searchParams.get("categoryIds") ?? "";

  /* ---------------- Local state ---------------- */
  const [searchQuery, setSearchQuery] = useState(query);
  const [submittedQuery, setSubmittedQuery] = useState(query);

  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [results, setResults] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);

  const limit = 20;
  const globalLoading = loadingCategories || loadingResults;

  /* ---------------- Helpers ---------------- */
  const updateParams = (updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") params.delete(key);
      else params.set(key, String(value));
    });

    setSearchParams(params);
  };

  /* ---------------- Fetch categories ---------------- */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await fetch(GET_MAIN_CATEGORIES_API);
        const json = await res.json();
        if (json.success) setCategories(json.data);
      } catch (err) {
        console.error("❌ Fetch categories error:", err);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  /* ---------------- Sync filters from URL ---------------- */
  useEffect(() => {
    if (!categoryIdsParam) {
      setActiveFilters([]);
      return;
    }

    const ids = categoryIdsParam.split(",");

    setActiveFilters(
      ids.map((id) => ({
        type: "category",
        value: id,
        label: categories.find((c) => String(c.id) === id)?.name ?? "Category",
        id: `category-${id}`,
      }))
    );
  }, [categoryIdsParam, categories]);

  /* ---------------- Fetch search results ---------------- */
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoadingResults(true);

        const url = `${SEARCH_PRODUCTS_API}?keyword=${encodeURIComponent(
          submittedQuery
        )}&page=${page}&limit=${limit}&sort=${sortBy}${
          categoryIdsParam ? `&categoryIds=${categoryIdsParam}` : ""
        }`;

        const res = await fetch(url);
        const json = await res.json();
        if (!json.success) return;

        setResults(json.data ?? []);
        setTotalPages(json.totalPages ?? 1);
        setTotalItems(json.totalItems ?? 0);
      } catch (err) {
        console.error("❌ Search API error:", err);
      } finally {
        setLoadingResults(false);
      }
    };

    fetchResults();
  }, [submittedQuery, page, sortBy, categoryIdsParam]);

  /* ---------------- Filter handlers ---------------- */
  const handleToggleCategoryFilter = (
    categoryId: string,
    categoryName: string
  ) => {
    const ids = categoryIdsParam ? categoryIdsParam.split(",") : [];

    const updated = ids.includes(categoryId)
      ? ids.filter((id) => id !== categoryId)
      : [...ids, categoryId];

    updateParams({
      categoryIds: updated.length ? updated.join(",") : null,
      page: 1,
    });
  };

  const handleRemoveFilter = (id: string) => {
    const value = id.replace("category-", "");
    const ids = categoryIdsParam.split(",").filter((c) => c !== value);

    updateParams({
      categoryIds: ids.length ? ids.join(",") : null,
      page: 1,
    });
  };

  const handleClearAllFilters = () => {
    updateParams({
      categoryIds: null,
      page: 1,
    });
  };

  const activeCategoryIds = categoryIdsParam ? categoryIdsParam.split(",") : [];

  if (globalLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-20 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] bg-clip-text text-transparent">
            Search Results
          </h1>
          <p className="text-gray-400">
            {totalItems} items found{" "}
            {submittedQuery && `for "${submittedQuery}"`}
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => {
              setSearchQuery("");
              updateParams({ q: null, page: 1 });
            }}
            onSubmit={(val) => {
              setSubmittedQuery(val);
              updateParams({ q: val, page: 1 });
            }}
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
            {/* Category dropdown */}
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
                {categories.map((cat) => (
                  <DropdownMenuItem
                    key={cat.id}
                    onClick={() =>
                      handleToggleCategoryFilter(String(cat.id), cat.name)
                    }
                    className={`cursor-pointer ${
                      activeCategoryIds.includes(String(cat.id))
                        ? "bg-[#fbbf24]/20 text-[#fbbf24]"
                        : "text-gray-300 hover:bg-[#fbbf24]/10 hover:text-white"
                    }`}
                  >
                    {cat.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort + View */}
            <div className="flex items-center gap-3">
              <SortDropdown
                value={sortBy}
                onChange={(v) => updateParams({ sort: v, page: 1 })}
              />

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
            searchQuery={submittedQuery}
            hasFilters={activeFilters.length > 0}
            onClearFilters={handleClearAllFilters}
            onBrowseAll={() => navigate("/browse")}
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
                  searchKeyword={submittedQuery}
                  viewMode={viewMode}
                  onClick={() => navigate(`/product/${item.id}`)}
                />
              ))}
            </div>

            <SearchPagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => updateParams({ page: p })}
              totalResults={totalItems}
              resultsPerPage={limit}
            />
          </>
        )}
      </div>
    </div>
  );
}
