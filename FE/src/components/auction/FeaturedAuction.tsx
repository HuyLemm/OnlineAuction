import { Clock, Users, TrendingUp, Gavel } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../check/ImageWithFallback";
import { formatCurrency } from "../../lib/utils";

interface FeaturedAuctionProps {
  title: string;
  description: string;
  image: string;
  currentBid: number;
  startingBid: number;
  bids: number;
  watchers: number;
  timeLeft: string;
  category: string;
}

export function FeaturedAuction({
  title,
  description,
  image,
  currentBid,
  startingBid,
  bids,
  watchers,
  timeLeft,
  category,
}: FeaturedAuctionProps) {
  const increase = ((currentBid - startingBid) / startingBid) * 100;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card">
      <div className="grid lg:grid-cols-2 gap-8 p-8 lg:p-12">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-xl bg-secondary/20">
          <ImageWithFallback
            src={image}
            alt={title}
            className="h-full w-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <Badge className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black border-0">
              Featured
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="space-y-3">
            <Badge variant="outline" className="w-fit">
              {category}
            </Badge>
            <h2 className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {title}
            </h2>
            <p className="text-muted-foreground">{description}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border/50 bg-secondary/30 p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Gavel className="h-4 w-4" />
                <span>Current Bid</span>
              </div>
              <div className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] bg-clip-text text-transparent">
                {formatCurrency(currentBid)}
              </div>
              <div className="flex items-center gap-1 mt-1 text-[#10b981]">
                <TrendingUp className="h-3 w-3" />
                <span>+{increase.toFixed(1)}%</span>
              </div>
            </div>

            <div className="rounded-xl border border-border/50 bg-secondary/30 p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Clock className="h-4 w-4" />
                <span>Time Left</span>
              </div>
              <div className="text-foreground">{timeLeft}</div>
              <div className="text-muted-foreground mt-1">Ends Nov 18</div>
            </div>

            <div className="rounded-xl border border-border/50 bg-secondary/30 p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Gavel className="h-4 w-4" />
                <span>Total Bids</span>
              </div>
              <div className="text-foreground">{bids}</div>
            </div>

            <div className="rounded-xl border border-border/50 bg-secondary/30 p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Users className="h-4 w-4" />
                <span>Watchers</span>
              </div>
              <div className="text-foreground">{watchers}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button className="flex-1 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90">
              Place Bid
            </Button>
            <Button variant="outline" className="flex-1">
              Watch Item
            </Button>
          </div>

          <div className="text-muted-foreground">
            Starting bid: <span className="text-foreground">${startingBid.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
