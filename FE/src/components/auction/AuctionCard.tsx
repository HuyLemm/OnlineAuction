import { Heart, Clock, TrendingUp } from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ImageWithFallback } from "../check/ImageWithFallback";

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
}: AuctionCardProps) {
  return (
    <Card 
      onClick={() => onNavigate?.("detail")}
      className="group overflow-hidden border border-border/50 bg-card hover:border-border transition-all duration-300 hover:shadow-2xl hover:shadow-[#fbbf24]/10 cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary/20">
        <ImageWithFallback
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {isHot && (
            <Badge className="bg-[#ef4444]/90 text-white border-0 backdrop-blur-sm">
              <TrendingUp className="mr-1 h-3 w-3" />
              Hot
            </Badge>
          )}
          {endingSoon && (
            <Badge className="bg-[#f59e0b]/90 text-white border-0 backdrop-blur-sm">
              <Clock className="mr-1 h-3 w-3" />
              Ending Soon
            </Badge>
          )}
        </div>

        {/* Favorite */}
        <button className="absolute top-3 right-3 h-9 w-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors">
          <Heart className="h-4 w-4 text-white" />
        </button>

        {/* Time Left */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="rounded-lg bg-black/60 backdrop-blur-md px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{timeLeft}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Category */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-muted-foreground">
            {category}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="line-clamp-2 min-h-[3rem] text-foreground group-hover:text-[#fbbf24] transition-colors">
          {title}
        </h3>

        {/* Bid Info */}
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-muted-foreground">Current Bid</span>
            <div className="flex items-baseline gap-1">
              <span className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] bg-clip-text text-transparent">
                ${currentBid.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>{bids} bids</span>
          </div>
        </div>

        {/* Action Button */}
        <Button className="w-full bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90">
          Place Bid
        </Button>
      </div>
    </Card>
  );
}