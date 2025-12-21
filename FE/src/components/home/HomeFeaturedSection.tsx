import { AuctionCard } from "../auction/AuctionCard";
import { Button } from "../ui/button";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { type AuctionItemDTO } from "../../types/dto";
import { toast } from "sonner";

import { REMOVE_FROM_WATCHLIST_API, ADD_TO_WATCHLIST_API } from "../utils/api";

import { fetchWithAuth } from "../utils/fetchWithAuth";

interface HomeFeaturedSectionProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconGradient: string;
  iconColor: string;

  auctions: AuctionItemDTO[];
  watchlistIds: Set<string>;
  setWatchlistIds: React.Dispatch<React.SetStateAction<Set<string>>>;

  onViewAll?: () => void;
}

export function HomeFeaturedSection({
  title,
  description,
  icon: Icon,
  iconGradient,
  iconColor,
  auctions,
  watchlistIds,
  setWatchlistIds,
  onViewAll,
}: HomeFeaturedSectionProps) {
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
      toast.error("You must be logged in to add to watchlist");
    }
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${iconGradient}`}
          >
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <div>
            <h2 className="text-foreground">{title}</h2>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>

        {onViewAll && (
          <Button
            variant="ghost"
            className="gap-2 hover:text-[#fbbf24] transition-colors"
            onClick={onViewAll}
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
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
            highestBidderName={auction.highestBidderName}
            buyNowPrice={auction.buyNowPrice}
            postedDate={auction.postedDate}
            auctionType={auction.auctionType}
            isHot={auction.isHot}
            endingSoon={auction.endingSoon}
            showCategory
            isFavorite={watchlistIds.has(auction.id)}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
    </section>
  );
}
