import { Clock, Users, TrendingUp, Eye } from "lucide-react";
import { ImageWithFallback } from "../check/ImageWithFallback";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface AuctionListItemProps {
  id: string;
  title: string;
  image: string;
  currentBid: number;
  bids: number;
  timeLeft: string;
  category: string;
  description?: string;
  isHot?: boolean;
  endingSoon?: boolean;
  watchers?: number;
}

export function AuctionListItem({
  title,
  image,
  currentBid,
  bids,
  timeLeft,
  category,
  description = "Premium authentic item in excellent condition. Verified and authenticated by our experts.",
  isHot,
  endingSoon,
  watchers = 45
}: AuctionListItemProps) {
  return (
    <div className="group bg-card border border-border/50 rounded-xl overflow-hidden hover:border-border transition-all duration-300 hover:shadow-xl hover:shadow-[#fbbf24]/5">
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        {/* Image */}
        <div className="relative w-full sm:w-48 h-48 rounded-lg overflow-hidden flex-shrink-0">
          <ImageWithFallback
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {isHot && (
              <Badge className="bg-[#ef4444] text-white border-0">
                <TrendingUp className="h-3 w-3 mr-1" />
                Hot
              </Badge>
            )}
            {endingSoon && (
              <Badge className="bg-[#f59e0b] text-white border-0">
                <Clock className="h-3 w-3 mr-1" />
                Ending Soon
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          {/* Top Section */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <Badge variant="outline" className="mb-2 border-border/50 text-muted-foreground">
                  {category}
                </Badge>
                <h3 className="text-foreground group-hover:text-[#fbbf24] transition-colors line-clamp-1">
                  {title}
                </h3>
              </div>
            </div>
            <p className="text-muted-foreground line-clamp-2">
              {description}
            </p>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mt-4">
            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <p className="text-muted-foreground mb-1">Current Bid</p>
                <p className="text-[#fbbf24]">${currentBid.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{bids} bids</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{watchers}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{timeLeft}</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <Button className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90 whitespace-nowrap">
              Place Bid
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
