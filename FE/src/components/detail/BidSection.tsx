import { useState } from "react";
import { Clock, TrendingUp, Zap, Heart, Share2, Flag } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

interface BidSectionProps {
  currentBid: number;
  buyNowPrice?: number;
  minimumBid: number;
  totalBids: number;
  timeLeft: string;
  endDate: Date;
  isHot?: boolean;
}

export function BidSection({
  currentBid,
  buyNowPrice,
  minimumBid,
  totalBids,
  timeLeft,
  isHot
}: BidSectionProps) {
  const [bidAmount, setBidAmount] = useState(minimumBid.toString());
  const [isWatching, setIsWatching] = useState(false);

  const handleQuickBid = (amount: number) => {
    setBidAmount(amount.toString());
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
        <Button className="w-full bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90">
          Place Bid - ${Number(bidAmount).toLocaleString()}
        </Button>
        {buyNowPrice && (
          <Button variant="outline" className="w-full border-[#fbbf24] text-[#fbbf24] hover:bg-[#fbbf24]/10">
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
