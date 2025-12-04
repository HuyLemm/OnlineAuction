import { SearchX, Filter, TrendingUp } from "lucide-react";
import { Button } from "../ui/button";

interface SearchEmptyStateProps {
  searchQuery?: string;
  hasFilters?: boolean;
  onClearFilters?: () => void;
  onBrowseAll?: () => void;
}

export function SearchEmptyState({
  searchQuery,
  hasFilters,
  onClearFilters,
  onBrowseAll,
}: SearchEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-[#fbbf24]/20 blur-3xl rounded-full" />
        <div className="relative bg-[#1a1a1a] border border-[#fbbf24]/30 rounded-full p-8">
          <SearchX className="h-16 w-16 text-[#fbbf24]" />
        </div>
      </div>

      <h2 className="text-2xl text-white mb-2">No Results Found</h2>
      
      {searchQuery && (
        <p className="text-gray-400 mb-6 max-w-md">
          We couldn't find any auctions matching{" "}
          <span className="text-[#fbbf24]">"{searchQuery}"</span>
          {hasFilters && " with your current filters"}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 items-center">
        {hasFilters && onClearFilters && (
          <Button
            onClick={onClearFilters}
            variant="outline"
            className="bg-[#1a1a1a] border-[#fbbf24]/30 text-white hover:bg-[#fbbf24]/10 hover:border-[#fbbf24]/50"
          >
            <Filter className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        )}

        {onBrowseAll && (
          <Button
            onClick={onBrowseAll}
            className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Browse All Auctions
          </Button>
        )}
      </div>

      {/* Suggestions */}
      <div className="mt-10 p-6 bg-[#1a1a1a]/50 border border-[#fbbf24]/10 rounded-xl max-w-lg">
        <h3 className="text-sm text-[#fbbf24] mb-3">Search Tips:</h3>
        <ul className="text-left text-sm text-gray-400 space-y-2">
          <li>• Check your spelling</li>
          <li>• Try more general keywords</li>
          <li>• Remove some filters to broaden your search</li>
          <li>• Browse by category to discover similar items</li>
        </ul>
      </div>
    </div>
  );
}
