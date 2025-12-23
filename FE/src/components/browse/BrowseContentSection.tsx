import { AuctionCard } from "../auction/AuctionCard";
import { AuctionListItem } from "./AuctionListItem";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type AuctionItemDTO } from "../../types/dto";
import { calculateTimeLeft } from "../../components/utils/timeUtils";
import { REMOVE_FROM_WATCHLIST_API, ADD_TO_WATCHLIST_API } from "../utils/api";
import { toast } from "sonner";

import { fetchWithAuth } from "../utils/fetchWithAuth";

interface BrowseContentSectionProps {
  auctions: AuctionItemDTO[];
  viewMode: "grid" | "list";
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onCategoryClick?: (categoryId: string) => void;
  watchlistIds: Set<string>;
  setWatchlistIds: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export function BrowseContentSection({
  auctions,
  viewMode,
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalItems,
  watchlistIds,
  setWatchlistIds,
  onPageChange,
}: BrowseContentSectionProps) {
  const handleToggleFavorite = async (
    productId: string,
    isFavorite: boolean
  ) => {
    try {
      if (isFavorite) {
        await fetchWithAuth(`${REMOVE_FROM_WATCHLIST_API}/${productId}`, {
          method: "DELETE",
        });

        setWatchlistIds((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });

        toast.success("Removed from watchlist");
      } else {
        await fetchWithAuth(ADD_TO_WATCHLIST_API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }),
        });

        setWatchlistIds((prev) => {
          const next = new Set(prev);
          next.add(productId);
          return next;
        });

        toast.success("Added to watchlist");
      }
    } catch (err) {
      toast.warning("You are not authorized to perform this action");
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Grid/List View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {auctions.map((auction) => (
            <AuctionCard
              key={auction.id}
              id={auction.id}
              title={auction.title}
              image={auction.image}
              currentBid={auction.currentBid}
              bids={auction.bids}
              end_time={auction.end_time}
              category={auction.category}
              categoryId={auction.categoryId}
              auctionType={auction.auctionType}
              isHot={auction.isHot}
              endingSoon={auction.endingSoon}
              highestBidderName={auction.highestBidderName}
              buyNowPrice={auction.buyNowPrice}
              postedDate={auction.postedDate}
              isFavorite={watchlistIds.has(auction.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {auctions.map((auction) => (
            <AuctionListItem
              key={auction.id}
              id={auction.id}
              title={auction.title}
              image={auction.image}
              currentBid={auction.currentBid}
              bids={auction.bids}
              timeLeft={calculateTimeLeft(auction.end_time)}
              description={auction.description}
              category={auction.category}
              isHot={auction.isHot}
              endingSoon={auction.endingSoon}
              categoryId={auction.categoryId}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-12 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  onClick={() => onPageChange(page)}
                  className={
                    currentPage === page
                      ? "bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90"
                      : ""
                  }
                >
                  {page}
                </Button>
              );
            } else if (page === currentPage - 2 || page === currentPage + 2) {
              return (
                <span key={page} className="px-2 text-muted-foreground">
                  ...
                </span>
              );
            }
            return null;
          })}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <p className="text-center text-muted-foreground mb-6">
        Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
        {totalItems} items
      </p>
    </div>
  );
}
