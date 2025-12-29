import { ChevronLeft, ChevronRight } from "lucide-react";
import { AuctionCard } from "../auction/AuctionCard";
import { Button } from "../ui/button";
import { useRef } from "react";
import type { AuctionItemDTO } from "../../types/dto";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { REMOVE_FROM_WATCHLIST_API, ADD_TO_WATCHLIST_API } from "../utils/api";
import { toast } from "sonner";

interface RelatedItemsProps {
  items: AuctionItemDTO[];
  watchlistIds: Set<string>;
  setWatchlistIds: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export function RelatedItems({ items, watchlistIds, setWatchlistIds }: RelatedItemsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = 320;
    scrollContainerRef.current.scrollTo({
      left:
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount),
      behavior: "smooth",
    });
  };

  if (!items.length) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-foreground">Related Items in Same Category</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => scroll("left")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => scroll("right")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-hidden pb-4 scrollbar-hide snap-x snap-mandatory"
      >
        {items.map((item) => (
          <div key={item.id} className="flex-shrink-0 w-[300px] snap-start">
            <AuctionCard
              {...item}
              showCategory
              isFavorite={watchlistIds.has(item.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
