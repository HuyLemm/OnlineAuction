import { Heart, Clock, TrendingUp, User } from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ImageWithFallback } from "../check/ImageWithFallback";
import { RelativeTimeCompact } from "../ui/RelativeTimeDisplay";
import { NewBadge } from "../ui/NewBadge";

interface AuctionCardProps {
  id: string;
  title: string;
  image: string;
  currentBid: number;
  bids: number;
  timeLeft: string;
  category: string;
  isHot?: boolean;
  endingSoon?: boolean;
  onNavigate?: (page: "detail") => void;
  onCategoryClick?: (category: string) => void;
  highestBidder?: {
    name: string;
    avatar?: string;
  };
  buyNowPrice?: number;
  postedDate?: Date | string; // Accept both Date and string
}

export function AuctionCard({
  title,
  image,
  currentBid,
  bids,
  timeLeft,
  category,
  isHot = false,
  endingSoon = false,
  onNavigate,
  onCategoryClick,
  highestBidder = { name: "Anonymous Bidder" },
  buyNowPrice,
  postedDate,
}: AuctionCardProps) {
  const handleCategoryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCategoryClick?.(category);
  };

  // Calculate days since posted for display
  const getDaysAgo = (date?: Date | string): string => {
    if (!date) return "Recently posted";
    
    // Ensure we have a valid Date object
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return "Recently posted";
    
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - dateObj.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    }
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  };

  return (
    <Card 
      onClick={() => onNavigate?.("detail")}
      className="group overflow-hidden border border-border/50 bg-card hover:border-[#fbbf24]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#fbbf24]/10 cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary/20">
        <ImageWithFallback
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Badges - Top Left */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {isHot && (
            <Badge className="bg-[#ef4444]/90 text-white border-0 backdrop-blur-sm text-[10px] px-1.5 py-0.5">
              <TrendingUp className="mr-0.5 h-2.5 w-2.5" />
              Hot
            </Badge>
          )}
          {endingSoon && (
            <Badge className="bg-[#f59e0b]/90 text-white border-0 backdrop-blur-sm text-[10px] px-1.5 py-0.5">
              <Clock className="mr-0.5 h-2.5 w-2.5" />
              Ending Soon
            </Badge>
          )}
        </div>

        {/* Favorite - Top Right */}
        <button className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors">
          <Heart className="h-3.5 w-3.5 text-white" />
        </button>

        {/* Bottom Overlay - Time Left + NEW Badge */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          <div className="flex-shrink-0 rounded-md bg-black/60 backdrop-blur-md px-1.5 py-0.5">
            <RelativeTimeCompact timeLeft={timeLeft} />
          </div>
          {postedDate && (
            <NewBadge postedDate={postedDate} daysThreshold={7} variant="minimal" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Category & Posted Date */}
        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className="text-muted-foreground hover:bg-[#fbbf24]/10 hover:text-[#fbbf24] hover:border-[#fbbf24]/50 transition-colors cursor-pointer"
            onClick={handleCategoryClick}
          >
            {category}
          </Badge>
          <span className="text-xs text-muted-foreground">{getDaysAgo(postedDate)}</span>
        </div>

        {/* Title */}
        <h3 className="line-clamp-2 min-h-[3rem] text-foreground group-hover:text-[#fbbf24] transition-colors">
          {title}
        </h3>

        {/* Current Bid */}
        <div className="space-y-1">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Current Bid</span>
            <span className="text-xl bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] bg-clip-text text-transparent">
              ${currentBid.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Highest Bidder */}
        <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30 border border-border/30">
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] flex items-center justify-center">
            <User className="h-3 w-3 text-black" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">Highest Bidder</p>
            <p className="text-sm text-foreground truncate">{highestBidder.name}</p>
          </div>
        </div>

        {/* Buy Now Price (if available) */}
        {buyNowPrice && (
          <div className="flex items-baseline justify-between p-2 rounded-lg bg-[#10b981]/10 border border-[#10b981]/20">
            <span className="text-sm text-[#10b981]">Buy Now Price</span>
            <span className="text-[#10b981]">
              ${buyNowPrice.toLocaleString()}
            </span>
          </div>
        )}

        {/* Bids Count & Time */}
        <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t border-border/30">
          <span>{bids} bids placed</span>
          <RelativeTimeCompact timeLeft={timeLeft} className="text-sm" />
        </div>

        {/* Action Button */}
        <Button className="w-full bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90">
          Place Bid
        </Button>
      </div>
    </Card>
  );
}