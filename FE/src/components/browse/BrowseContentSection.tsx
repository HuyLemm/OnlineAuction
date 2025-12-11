import { AuctionCard } from "../auction/AuctionCard";
import { AuctionListItem } from "./AuctionListItem";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type AuctionItem } from "../../types/dto";
import { calculateTimeLeft } from "../../components/utils/timeUtils";

interface BrowseContentSectionProps {
  auctions: AuctionItem[];
  viewMode: "grid" | "list";
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onNavigate?: (
    page: "detail" | "browse" | "home" | "dashboard" | "seller"
  ) => void;
  onCategoryClick?: (category: string) => void;
}

export function BrowseContentSection({
  auctions,
  viewMode,
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalItems,
  onPageChange,
  onNavigate,
  onCategoryClick,
}: BrowseContentSectionProps) {
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
              highestBidderId={auction.highestBidderId}
              highestBidderName={auction.highestBidderName}
              buyNowPrice={auction.buyNowPrice}
              postedDate={auction.postedDate}
              onNavigate={onNavigate}
              onCategoryClick={onCategoryClick}
              showCategory={false}
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
