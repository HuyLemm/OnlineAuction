import { Heart, Clock, TrendingUp, User } from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { NewBadge } from "../ui/NewBadge";
import { ImageWithFallback } from "../check/ImageWithFallback";
import {
  calculateTimeLeft,
  formatPostedDate,
  isNewItem,
} from "../../components/utils/timeUtils";

interface AuctionCardProps {
  id: string;
  title: string;
  image: string;
  currentBid: number;
  bids: number;
  end_time: string;
  category: string;

  auctionType?: "traditional" | "buy_now";
  isHot?: boolean;
  endingSoon?: boolean;

  highestBidderId?: string | null;
  highestBidderName?: string | null;
  buyNowPrice?: number | null;
  postedDate?: Date | string;

  onNavigate?: (page: "detail") => void;
  onCategoryClick?: (category: string) => void;
}

export function AuctionCard({
  title,
  image,
  currentBid,
  bids,
  end_time,
  category,
  auctionType = "traditional",
  isHot = false,
  endingSoon = false,
  onNavigate,
  onCategoryClick,
  highestBidderId,
  highestBidderName,
  buyNowPrice,
  postedDate,
}: AuctionCardProps) {
  const isNew = isNewItem(postedDate ? new Date(postedDate) : undefined, 7);

  const timeLeft = calculateTimeLeft(end_time);
  const postedAt = formatPostedDate(postedDate);

  const handleCategoryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCategoryClick?.(category);
  };

  return (
    <Card
      onClick={() => onNavigate?.("detail")}
      className="group overflow-hidden border border-border/50 bg-card hover:border-[#fbbf24]/50 
                 transition-all duration-300 hover:shadow-2xl hover:shadow-[#fbbf24]/10 
                 cursor-pointer flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary/20">
        <ImageWithFallback
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {isHot && (
            <Badge className="bg-[#ef4444] text-white text-[10px] px-1.5 py-0.5">
              <TrendingUp className="w-3 h-3 mr-1" /> Hot
            </Badge>
          )}
          {endingSoon && (
            <Badge className="bg-[#f59e0b] text-white text-[10px] px-1.5 py-0.5">
              <Clock className="w-3 h-3 mr-1" /> Ending Soon
            </Badge>
          )}
        </div>

        {/* Favorite */}
        <button className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60">
          <Heart className="h-3.5 w-3.5 text-white" />
        </button>

        {/* Bottom Overlay - Time Left + New */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          {/* Time Left */}
          <div className="flex items-center gap-1 whitespace-nowrap rounded bg-black/60 backdrop-blur-md px-2 py-0.5 text-white text-xs shadow-sm">
            <Clock className="h-3 w-3 opacity-90 flex-shrink-0" />
            <span>{timeLeft}</span>
          </div>

          {/* New Badge */}
          {isNew && postedDate && (
            <NewBadge
              postedDate={new Date(postedDate)}
              daysThreshold={7}
              variant="minimal"
            />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Category & Posted */}
        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className="cursor-pointer text-muted-foreground hover:bg-[#fbbf24]/10 hover:text-[#fbbf24]"
            onClick={handleCategoryClick}
          >
            {category}
          </Badge>
          <span className="text-xs text-muted-foreground">{postedAt}</span>
        </div>

        {/* Title */}
        <h3 className="line-clamp-2 min-h-[3rem] group-hover:text-[#fbbf24] transition-colors">
          {title}
        </h3>

        {/* Current Bid */}
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">Current Bid</span>
          <span
            className="text-xl bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] 
                           bg-clip-text text-transparent"
          >
            ${currentBid.toLocaleString()}
          </span>
        </div>

        {/* Highest Bidder */}
        <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30 border border-border/30">
          <div
            className="h-6 w-6 rounded-full bg-gradient-to-br from-[#fbbf24] 
                          to-[#f59e0b] flex items-center justify-center"
          >
            <User className="h-3 w-3 text-black" />
          </div>
          <span className="text-sm truncate">{highestBidderName ?? "No bid yet"}</span>
        </div>

        {/* Buy Now Reserved Slot */}
        <div className="min-h-[42px]">
          {auctionType === "buy_now" && buyNowPrice && (
            <div
              className="flex items-baseline justify-between p-2 rounded-lg 
                            bg-[#10b981]/10 border border-[#10b981]/20"
            >
              <span className="text-sm text-[#10b981]">Buy Now Price</span>
              <span className="text-[#10b981]">
                ${buyNowPrice.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Bids section - sticks above button */}
        <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t border-border/30 mt-auto">
          <span>{bids} bids placed</span>

          <div className="flex items-center gap-1 whitespace-nowrap">
            <Clock className="h-3 w-3 opacity-70 flex-shrink-0" />
            <span>{timeLeft}</span>
          </div>
        </div>

        {/* Action */}
        <Button
          className="w-full bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] 
                     text-black hover:opacity-90 cursor-pointer mt-3"
        >
          Place Bid
        </Button>
      </div>
    </Card>
  );
}
