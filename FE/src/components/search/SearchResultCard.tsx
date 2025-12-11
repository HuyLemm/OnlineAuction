import { Clock, Users, TrendingUp, User } from "lucide-react";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../check/ImageWithFallback";
import { NewBadge } from "../ui/NewBadge";
import { calculateTimeLeft, formatPostedDate } from "../utils/timeUtils";
import { Button } from "../ui/button";

export interface SearchResult {
  id: string;
  title: string;
  image: string;
  currentBid: number;
  bids: number;
  end_time: string;
  category: string;
  description?: string;
  postedDate?: string | Date;
  highestBidderId?: string | null;
  highestBidderName?: string | null;
  buyNowPrice?: number | null;
  auctionType?: "traditional" | "buy_now";
  isNew?: boolean;
}

interface SearchResultCardProps {
  item: SearchResult;
  searchKeyword?: string;
  onClick?: () => void;
  viewMode?: "grid" | "list";
}

export function SearchResultCard({
  item,
  searchKeyword,
  viewMode = "grid",
  onClick,
}: SearchResultCardProps) {
  const timeLeft = calculateTimeLeft(item.end_time);
  const postedAt = formatPostedDate(item.postedDate);

  const highlightText = (text: string) => {
    if (!searchKeyword) return text;

    // Escape special regex characters
    const escaped = searchKeyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Only highlight whole text content, not inside HTML tags
    const regex = new RegExp(`(${escaped})`, "gi");

    return text.replace(
      regex,
      `<mark class='px-1 rounded bg-[#fbbf24]/30 text-[#fbbf24] font-semibold'>$1</mark>`
    );
  };

  const parsedPosted =
    item.postedDate instanceof Date
      ? item.postedDate
      : new Date(item.postedDate ?? "");

  /* ====================================================
    🟦 LIST VIEW
  ==================================================== */
  if (viewMode === "list") {
    return (
      <div
        onClick={onClick}
        className="group bg-card border border-border/50 rounded-xl overflow-hidden 
        hover:border-[#fbbf24]/50 transition-all duration-300 
        hover:shadow-2xl hover:shadow-[#fbbf24]/10 cursor-pointer p-4"
      >
        <div className="flex gap-4">
          {/* IMAGE */}
          <div className="relative w-48 h-48 rounded-lg overflow-hidden flex-shrink-0">
            <ImageWithFallback
              src={item.image}
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* NEW Badge */}
            {item.isNew && (
              <Badge
                className="absolute top-2 left-2 text-[11px] font-semibold 
    bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black 
    border border-[#fbbf24]/60 px-2 py-0.5 rounded-md shadow-lg shadow-[#fbbf24]/50"
              >
                NEW
              </Badge>
            )}
          </div>

          {/* CONTENT */}
          <div className="flex flex-col flex-1 justify-between min-w-0">
            {/* Top */}
            <div className="space-y-2">
              <Badge
                variant="outline"
                className="border-border/50 text-muted-foreground"
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: highlightText(item.category),
                  }}
                />
              </Badge>

              <h3
                key={item.id + searchKeyword}
                className="font-medium group-hover:text-[#fbbf24] text-lg text-white line-clamp-1"
                dangerouslySetInnerHTML={{ __html: highlightText(item.title) }}
              />

              {item.description && (
                <p
                  className="text-sm text-muted-foreground line-clamp-2"
                  dangerouslySetInnerHTML={{
                    __html: highlightText(item.description),
                  }}
                />
              )}
            </div>

            {/* Highest Bidder */}
            <div className="flex items-center gap-2 mt-2 p-2 rounded-lg bg-secondary/30 border border-border/30">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] flex items-center justify-center">
                <User className="h-3 w-3 text-black" />
              </div>
              <span className="text-sm truncate text-white">
                {item.highestBidderName ?? "No bid yet"}
              </span>
            </div>

            {/* BUY NOW */}
            {item.auctionType === "buy_now" && item.buyNowPrice && (
              <div className="mt-2 flex items-center gap-2 p-2 rounded-lg bg-[#10b981]/10 border border-[#10b981]/20">
                <span className="text-sm text-[#10b981]">Buy Now Price:</span>
                <span className="text-[#10b981] font-medium">
                  ${item.buyNowPrice.toLocaleString()}
                </span>
              </div>
            )}

            {/* Stats + Button */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-6 text-sm">
                <span className="text-[#fbbf24] font-semibold">
                  ${item.currentBid.toLocaleString()}
                </span>

                <span className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-4 w-4" /> {item.bids}
                </span>

                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" /> {timeLeft}
                </span>
              </div>

              <Button className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90">
                Place Bid
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ====================================================
    🟥 GRID VIEW
  ==================================================== */
  return (
    <div
      onClick={onClick}
      className="group relative bg-card rounded-xl border border-[#fbbf24]/20 
      overflow-hidden hover:border-[#fbbf24]/50 transition-all duration-300 
      cursor-pointer hover:shadow-xl hover:shadow-[#fbbf24]/10"
    >
      {/* IMAGE */}
      <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
        <ImageWithFallback
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Time Left + New */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          <div className="flex items-center gap-1 bg-black/60 rounded px-2 py-0.5 text-white text-xs">
            <Clock className="h-3 w-3 opacity-90" />
            <span>{timeLeft}</span>
          </div>

          {item.isNew && item.postedDate && (
            <Badge
              className="text-[11px] font-semibold 
    bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black 
    border border-[#fbbf24]/60 px-2 py-0.5 rounded-md shadow-lg shadow-[#fbbf24]/50"
            >
              NEW
            </Badge>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-3">
        <h3
          className="line-clamp-2 text-white group-hover:text-[#fbbf24]"
          dangerouslySetInnerHTML={{ __html: highlightText(item.title) }}
        />

        <div className="flex items-center justify-between text-xs text-gray-400">
          <span
            dangerouslySetInnerHTML={{ __html: highlightText(item.category) }}
          />
          <span>{postedAt}</span>
        </div>

        {/* Highest Bidder */}
        <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30 border border-border/30">
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] flex items-center justify-center">
            <User className="h-3 w-3 text-black" />
          </div>
          <span className="text-sm truncate text-white">
            {item.highestBidderName ?? "No bid yet"}
          </span>
        </div>

        {/* BUY NOW */}
        {item.auctionType === "buy_now" && item.buyNowPrice && (
          <div className="flex items-baseline justify-between p-2 rounded-lg bg-[#10b981]/10 border border-[#10b981]/20 min-h-[42px]">
            <span className="text-sm text-[#10b981]">Buy Now Price</span>
            <span className="text-[#10b981]">
              ${item.buyNowPrice.toLocaleString()}
            </span>
          </div>
        )}

        {/* Current Bid + Bids */}
        <div className="flex items-center justify-between border-t border-white/5 pt-2 text-xs">
          <span className="flex items-center gap-1 font-semibold text-[#fbbf24] text-sm">
            <TrendingUp className="h-4 w-4" />$
            {item.currentBid.toLocaleString()}
          </span>
          <span className="text-white text-sm">{item.bids} bids</span>
        </div>
      </div>
    </div>
  );
}
