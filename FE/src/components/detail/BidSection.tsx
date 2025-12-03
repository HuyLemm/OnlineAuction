import { useState } from "react";
import { Clock, TrendingUp, Zap, Heart, Share2, Flag, User, Star, Calendar } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { toast } from "sonner";

interface BidSectionProps {
  currentBid?: number;
  buyNowPrice?: number;
  minimumBid?: number;
  totalBids?: number;
  timeLeft?: string;
  endDate?: Date;
  postedDate?: Date;
  isHot?: boolean;
  seller?: {
    name: string;
    rating: number;
    totalReviews: number;
  };
  highestBidder?: {
    name: string;
    rating: number;
    totalReviews: number;
  };
  onPlaceBid?: (amount: number) => void;
  onBuyNow?: () => void;
}

// Helper function to format relative time
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  // If less than 3 days, use relative time
  if (diffDays < 3 && diffMs > 0) {
    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h left`;
    } else if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m left`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m left`;
    } else {
      return "Ending soon";
    }
  }
  
  // Otherwise, return formatted date
  return date.toLocaleDateString('en-US', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

function formatPostedDate(date: Date): string {
  return date.toLocaleDateString('en-US', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

export function BidSection({
  currentBid = 15000,
  buyNowPrice = 25000,
  minimumBid = 15500,
  totalBids = 47,
  timeLeft = "2d 14h",
  endDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000), // 2 days 14 hours from now
  postedDate = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  isHot = true,
  seller = {
    name: "Premium Watches Gallery",
    rating: 4.8,
    totalReviews: 342
  },
  highestBidder = {
    name: "Michael Chen",
    rating: 4.6,
    totalReviews: 28
  },
  onPlaceBid,
  onBuyNow,
}: BidSectionProps) {
  const [bidAmount, setBidAmount] = useState(minimumBid.toString());
  const [isWatching, setIsWatching] = useState(false);

  const handleQuickBid = (amount: number) => {
    setBidAmount(amount.toString());
  };

  const handlePlaceBid = () => {
    const amount = Number(bidAmount);
    if (amount < minimumBid) {
      toast.error(`Bid must be at least $${minimumBid.toLocaleString()}`);
      return;
    }
    onPlaceBid?.(amount);
    toast.success(`Bid of $${amount.toLocaleString()} placed successfully!`);
  };

  const handleBuyNow = () => {
    onBuyNow?.();
    toast.success("Purchase successful!");
  };

  return (
    <div className="bg-card border border-border/50 rounded-xl p-6 space-y-6">
      {/* Status Badges */}
      <div className="flex flex-wrap items-center gap-2">
        {isHot && (
          <Badge className="bg-[#ef4444] text-white border-0">
            <TrendingUp className="h-3 w-3 mr-1" />
            Hot Item
          </Badge>
        )}
        <Badge className="bg-[#f59e0b] text-white border-0">
          <Clock className="h-3 w-3 mr-1" />
          {timeLeft} left
        </Badge>
        <Badge variant="outline" className="border-border/50">
          {totalBids} bids
        </Badge>
      </div>

      {/* Current Bid */}
      <div className="space-y-2">
        <p className="text-muted-foreground">Current Bid</p>
        <div className="flex items-baseline gap-2">
          <span className="text-[#fbbf24]">${currentBid.toLocaleString()}</span>
          <span className="text-muted-foreground">USD</span>
        </div>
      </div>

      {/* Buy Now Price */}
      {buyNowPrice && (
        <div className="space-y-2">
          <p className="text-muted-foreground">Buy Now Price</p>
          <div className="flex items-baseline gap-2">
            <span className="text-[#10b981]">${buyNowPrice.toLocaleString()}</span>
            <span className="text-muted-foreground">USD</span>
          </div>
        </div>
      )}

      <Separator className="bg-border/50" />

      {/* Seller Info */}
      <div className="space-y-3">
        <p className="text-muted-foreground">Seller</p>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gradient-to-br from-[#10b981]/20 to-[#10b981]/10 text-foreground">
              {seller.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-foreground">{seller.name}</p>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-[#fbbf24] text-[#fbbf24]" />
              <span className="text-foreground">{seller.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({seller.totalReviews} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-border/50" />

      {/* Highest Bidder Info */}
      <div className="space-y-3">
        <p className="text-muted-foreground">Highest Bidder</p>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gradient-to-br from-[#fbbf24]/20 to-[#f59e0b]/20 text-foreground">
              {highestBidder.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-foreground">{highestBidder.name}</p>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-[#fbbf24] text-[#fbbf24]" />
              <span className="text-foreground">{highestBidder.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({highestBidder.totalReviews} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-border/50" />

      {/* Posted Date & End Date */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Posted</span>
          </div>
          <span className="text-foreground">{formatPostedDate(postedDate)}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Ends</span>
          </div>
          <span className="text-foreground">{getRelativeTime(endDate)}</span>
        </div>
      </div>

      <Separator className="bg-border/50" />

      {/* Bid Input */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-foreground">Your Bid</p>
          <p className="text-muted-foreground">
            Min: ${minimumBid.toLocaleString()}
          </p>
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            $
          </span>
          <Input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            className="pl-8 bg-secondary/50 border-border/50"
            placeholder={minimumBid.toString()}
          />
        </div>

        {/* Quick Bid Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickBid(minimumBid)}
            className="border-border/50"
          >
            +${(minimumBid - currentBid).toLocaleString()}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickBid(currentBid + 500)}
            className="border-border/50"
          >
            +$500
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickBid(currentBid + 1000)}
            className="border-border/50"
          >
            +$1,000
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button 
          onClick={handlePlaceBid}
          className="w-full bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90"
        >
          Place Bid - ${Number(bidAmount).toLocaleString()}
        </Button>
        {buyNowPrice && (
          <Button 
            onClick={handleBuyNow}
            variant="outline" 
            className="w-full border-[#10b981] text-[#10b981] hover:bg-[#10b981]/10"
          >
            <Zap className="h-4 w-4 mr-2" />
            Buy Now - ${buyNowPrice.toLocaleString()}
          </Button>
        )}
      </div>

      <Separator className="bg-border/50" />

      {/* Secondary Actions */}
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsWatching(!isWatching)}
          className={isWatching ? "text-[#ef4444]" : ""}
        >
          <Heart className={`h-4 w-4 mr-1 ${isWatching ? "fill-current" : ""}`} />
          Watch
        </Button>
        <Button variant="ghost" size="sm">
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>
        <Button variant="ghost" size="sm">
          <Flag className="h-4 w-4 mr-1" />
          Report
        </Button>
      </div>

      {/* Trust Indicators */}
      <div className="pt-4 space-y-2 text-center border-t border-border/50">
        <p className="text-muted-foreground">
          ✓ Buyer Protection Guarantee
        </p>
        <p className="text-muted-foreground">
          ✓ Secure Payment Processing
        </p>
        <p className="text-muted-foreground">
          ✓ Authenticated Items Only
        </p>
      </div>
    </div>
  );
}
