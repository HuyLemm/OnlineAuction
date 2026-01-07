import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";

import { FilterSidebar } from "../components/browse/FilterSidebar";
import { BrowseTopBar } from "../components/browse/BrowseTopBar";
import { BrowseContentSection } from "../components/browse/BrowseContentSection";
import type { AuctionItemDTO, CategoryTreeDTO } from "../types/dto";
import { LoadingSpinner } from "../components/state";
import {
  GET_BROWSE_PRODUCT_API,
  GET_CATEGORIES_FOR_SIDEBAR_API,
  GET_WATCHLIST_ID_API,
} from "../components/utils/api";

import { fetchWithAuth } from "../components/utils/fetchWithAuth";

export function BrowseItemsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [watchlistIds, setWatchlistIds] = useState<Set<string>>(new Set());

  /* ---------------- URL params ---------------- */
  const pageParam = Number(searchParams.get("page") ?? 1);
  const sortParam = searchParams.get("sort") ?? "default";
  const categoryParam = searchParams.get("category"); // can be main OR sub id
  const minPriceParam = Number(searchParams.get("minPrice") ?? 0);
  const maxPriceParam = Number(searchParams.get("maxPrice") ?? 10000);

  /* ---------------- State ---------------- */
  const [items, setItems] = useState<AuctionItemDTO[]>([]);
  const [categories, setCategories] = useState<CategoryTreeDTO[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const hasUserInteractedRef = useRef(false);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [expanded, setExpanded] = useState<string[]>([]);

  const [filters, setFilters] = useState<{
    categories: string[];
    price: [number, number];
  }>({
    categories: categoryParam ? [categoryParam] : [],
    price: [minPriceParam, maxPriceParam],
  });

  const itemsPerPage = 20;

  useEffect(() => {
    const loadWatchlistIds = async () => {
      try {
        const res = await fetchWithAuth(GET_WATCHLIST_ID_API);
        const data = await res.json();
        setWatchlistIds(new Set(data.data));
      } catch {}
    };

    loadWatchlistIds();
  }, []);

  /* ---------------- Fetch categories ---------------- */
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      const res = await fetch(GET_CATEGORIES_FOR_SIDEBAR_API);
      const json = await res.json();
      setCategories(json.data ?? []);
      setLoadingCategories(false);
    };
    fetchCategories();
  }, []);

  /* ---------------- Sync URL -> filters + expanded (MAIN or SUB) ---------------- */
  useEffect(() => {
    // luôn sync price từ URL
    setFilters((prev) => ({
      ...prev,
      price: [minPriceParam, maxPriceParam],
    }));

    if (!categoryParam) {
      setFilters((prev) => ({ ...prev, categories: [] }));
      setExpanded([]);
      return;
    }

    if (hasUserInteractedRef.current) return;

    if (categories.length === 0) {
      setFilters((prev) => ({ ...prev, categories: [categoryParam] }));
      return;
    }

    const catId = String(categoryParam);

    const main = categories.find((c) => String(c.id) === catId);
    if (main) {
      const subIds = main.subcategories?.map((s) => String(s.id)) ?? [];
      const newCats = subIds.length ? [catId, ...subIds] : [catId];

      setFilters((prev) => ({ ...prev, categories: newCats }));
      setExpanded([catId]);
      return;
    }

    const parent = categories.find((c) =>
      c.subcategories?.some((s) => String(s.id) === catId)
    );

    if (parent) {
      setFilters((prev) => ({ ...prev, categories: [catId] }));
      setExpanded([String(parent.id)]);
      return;
    }

    setFilters((prev) => ({ ...prev, categories: [catId] }));
  }, [categoryParam, categories, minPriceParam, maxPriceParam]);

  /* ---------------- Auto scroll top when params change ---------------- */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pageParam, sortParam, categoryParam, minPriceParam, maxPriceParam]);

  /* ---------------- Fetch products ---------------- */
  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);

    const query = new URLSearchParams({
      page: String(pageParam),
      limit: String(itemsPerPage),
      ...(sortParam !== "default" && { sort: sortParam }),
      ...(filters.categories.length && {
        categories: filters.categories.join(","),
      }),
      minPrice: String(filters.price[0]),
      maxPrice: String(filters.price[1]),
    });

    const res = await fetch(`${GET_BROWSE_PRODUCT_API}?${query.toString()}`);
    const json = await res.json();

    setItems(json.data ?? []);
    setTotalItems(json.totalItems ?? 0);
    setTotalPages(json.totalPages ?? 1);
    setLoadingProducts(false);
  }, [pageParam, sortParam, filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /* ---------------- Helpers ---------------- */
  const updateParams = (updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) params.delete(key);
      else params.set(key, String(value));
    });

    setSearchParams(params);
  };

  const isMainCategoryId = (id: string) =>
    categories.some((c) => String(c.id) === String(id));

  const pickCategoryForUrl = (cats: string[]) => {
    const firstSub = cats.find((id) => !isMainCategoryId(String(id)));
    return firstSub ?? cats[0] ?? null;
  };

  /* ---------------- Handlers ---------------- */
  const handleSort = (sort: string) => {
    updateParams({ sort, page: 1 });
  };

  const handleApplyFilters = (newFilters: {
    categories: string[];
    price: [number, number];
  }) => {
    hasUserInteractedRef.current = true;
    setFilters(newFilters);

    updateParams({
      category: pickCategoryForUrl(newFilters.categories),
      minPrice: newFilters.price[0],
      maxPrice: newFilters.price[1],
      page: 1,
    });

    setShowMobileFilters(false);
  };

  const handleClearFilters = () => {
    hasUserInteractedRef.current = true;
    setFilters({ categories: [], price: [0, 10000] });
    setExpanded([]);
    updateParams({
      category: null,
      minPrice: 0,
      maxPrice: 10000,
      page: 1,
    });
  };

  if (loadingProducts || loadingCategories) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-73px)]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-73px)]">
      {/* Sidebar Desktop */}
      <div className="hidden lg:block w-80 flex-shrink-0">
        <FilterSidebar
          categories={categories}
          onApplyFilters={handleApplyFilters}
          selectedCategories={filters.categories}
          priceRange={filters.price}
          expandedCategories={expanded}
          onExpandedChange={setExpanded}
          onClearAll={handleClearFilters}
        />
      </div>

      {/* Sidebar Mobile */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-80">
            <FilterSidebar
              onClose={() => setShowMobileFilters(false)}
              categories={categories}
              selectedCategories={filters.categories}
              priceRange={filters.price}
              expandedCategories={expanded}
              onExpandedChange={setExpanded}
              onApplyFilters={handleApplyFilters}
              onClearAll={handleClearFilters}
            />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <BrowseTopBar
          totalItems={totalItems}
          viewMode={viewMode}
          sortBy={sortParam}
          onViewModeChange={setViewMode}
          onFilterToggle={() => setShowMobileFilters(true)}
          showFilterToggle
          categories={categories}
          selectedCategories={filters.categories}
          priceRange={filters.price}
          onRemoveCategory={(cat) => {
            hasUserInteractedRef.current = true;
            const updated = filters.categories.filter((c) => c !== cat);
            handleApplyFilters({ ...filters, categories: updated });
          }}
          onResetPrice={() =>
            handleApplyFilters({ ...filters, price: [0, 10000] })
          }
          onSortChange={handleSort}
        />

        <div className="flex-1 overflow-y-auto">
          <BrowseContentSection
            auctions={items}
            viewMode={viewMode}
            currentPage={pageParam}
            totalPages={totalPages}
            startIndex={(pageParam - 1) * itemsPerPage}
            endIndex={pageParam * itemsPerPage}
            totalItems={totalItems}
            onPageChange={(p) => updateParams({ page: p })}
            watchlistIds={watchlistIds}
            setWatchlistIds={setWatchlistIds}
          />
        </div>
      </div>
    </div>
  );
}
