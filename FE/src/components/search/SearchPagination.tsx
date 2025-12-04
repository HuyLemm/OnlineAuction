import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "../ui/button";

interface SearchPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalResults: number;
  resultsPerPage: number;
}

export function SearchPagination({
  currentPage,
  totalPages,
  onPageChange,
  totalResults,
  resultsPerPage,
}: SearchPaginationProps) {
  const startResult = (currentPage - 1) * resultsPerPage + 1;
  const endResult = Math.min(currentPage * resultsPerPage, totalResults);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-white/5">
      {/* Results Info */}
      <p className="text-sm text-gray-400">
        Showing <span className="text-[#fbbf24]">{startResult}</span> to{" "}
        <span className="text-[#fbbf24]">{endResult}</span> of{" "}
        <span className="text-[#fbbf24]">{totalResults}</span> results
      </p>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* First Page */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="bg-[#1a1a1a] border-[#fbbf24]/20 text-white hover:bg-[#fbbf24]/10 hover:border-[#fbbf24]/50 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        {/* Previous Page */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-[#1a1a1a] border-[#fbbf24]/20 text-white hover:bg-[#fbbf24]/10 hover:border-[#fbbf24]/50 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page Numbers */}
        <div className="hidden sm:flex items-center gap-1">
          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                ...
              </span>
            ) : (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page as number)}
                className={
                  currentPage === page
                    ? "bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black border-0 hover:opacity-90"
                    : "bg-[#1a1a1a] border-[#fbbf24]/20 text-white hover:bg-[#fbbf24]/10 hover:border-[#fbbf24]/50"
                }
              >
                {page}
              </Button>
            )
          )}
        </div>

        {/* Mobile: Current Page Display */}
        <div className="sm:hidden px-3 py-1 bg-[#1a1a1a] border border-[#fbbf24]/20 rounded text-sm text-white">
          {currentPage} / {totalPages}
        </div>

        {/* Next Page */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-[#1a1a1a] border-[#fbbf24]/20 text-white hover:bg-[#fbbf24]/10 hover:border-[#fbbf24]/50 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Last Page */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="bg-[#1a1a1a] border-[#fbbf24]/20 text-white hover:bg-[#fbbf24]/10 hover:border-[#fbbf24]/50 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
