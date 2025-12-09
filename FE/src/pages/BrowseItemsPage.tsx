import { useEffect, useState, useCallback } from "react";
import { FilterSidebar } from "../components/browse/FilterSidebar";
import { BrowseTopBar } from "../components/browse/BrowseTopBar";
import { BrowseContentSection } from "../components/browse/BrowseContentSection";
import { type AuctionItem, type CategoryTree } from "../types/dto";
import { LoadingSpinner } from "../components/state";

const API_URL = "http://localhost:3000/products/get-browse-product";
const CAT_URL = "http://localhost:3000/categories/get-categories-for-sidebar";

interface BrowseItemsPageProps {
  onNavigate?: (
    page: "home" | "browse" | "detail" | "dashboard" | "seller"
  ) => void;
  selectedCategory?: string | null;
  onCategorySelect?: (category: string) => void;
}

export function BrowseItemsPage({
  onNavigate,
  selectedCategory,
  onCategorySelect,
}: BrowseItemsPageProps) {
  const [items, setItems] = useState<AuctionItem[]>([]);
  const [categories, setCategories] = useState<CategoryTree[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("default");

  // ⭐ Filters state (persisting state)
  const [filters, setFilters] = useState<{
    categories: string[];
    price: [number, number];
  }>({
    categories: [],
    price: [0, 10000],
  });

  const itemsPerPage = 20;

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);

    const sortQuery = sortBy !== "default" ? `&sort=${sortBy}` : "";
    const catQuery =
      filters.categories.length > 0
        ? `&categories=${filters.categories.join(",")}`
        : "";
    const priceQuery = `&minPrice=${filters.price[0]}&maxPrice=${filters.price[1]}`;

    const res = await fetch(
      `${API_URL}?page=${currentPage}&limit=${itemsPerPage}${sortQuery}${catQuery}${priceQuery}`
    );
    const json = await res.json();

    setItems(json.data ?? []);
    setTotalItems(json.totalItems ?? 0);
    setTotalPages(json.totalPages ?? 1);
    setLoadingProducts(false);
  }, [currentPage, itemsPerPage, sortBy, filters]);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    const res = await fetch(CAT_URL);
    const json = await res.json();
    setCategories(json.data ?? []);
    setLoadingCategories(false);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts]);


  const handleSort = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const handleApplyFilters = (newFilters: {
    categories: string[];
    price: [number, number];
  }) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setShowMobileFilters(false);
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
          selectedMainCategory={selectedCategory ?? undefined}
          selectedCategories={filters.categories}
          priceRange={filters.price}
        />
      </div>

      {/* Sidebar Mobile */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowMobileFilters(false)}
          ></div>

          <div className="absolute left-0 top-0 bottom-0 w-80 animate-in slide-in-from-left">
            <FilterSidebar
              onClose={() => setShowMobileFilters(false)}
              categories={categories}
              selectedCategories={filters.categories}
              priceRange={filters.price}
              onApplyFilters={(f) => {
                handleApplyFilters(f);
                setShowMobileFilters(false);
              }}
            />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <BrowseTopBar
          totalItems={totalItems}
          viewMode={viewMode}
          sortBy={sortBy}
          onViewModeChange={setViewMode}
          onFilterToggle={() => setShowMobileFilters(true)}
          showFilterToggle={true}
          categories={categories}
          selectedCategories={filters.categories}
          priceRange={filters.price}
          onRemoveCategory={(category) => {
            const updated = filters.categories.filter((c) => c !== category);
            setFilters({ ...filters, categories: updated });
            setCurrentPage(1);
          }}
          onResetPrice={() => {
            setFilters({ ...filters, price: [0, 10000] });
            setCurrentPage(1);
          }}
          onSortChange={handleSort}
        />

        <div className="flex-1 overflow-y-auto">
          <BrowseContentSection
            auctions={items}
            viewMode={viewMode}
            currentPage={currentPage}
            totalPages={totalPages}
            startIndex={(currentPage - 1) * itemsPerPage}
            endIndex={currentPage * itemsPerPage}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            onNavigate={onNavigate}
            onCategoryClick={onCategorySelect}
          />
        </div>
      </div>
    </div>
  );
}
