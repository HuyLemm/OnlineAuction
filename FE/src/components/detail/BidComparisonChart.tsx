import { TrendingUp, Users, Crown, Star } from "lucide-react";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { formatCurrency } from "../../lib/utils";

interface Bidder {
  id: string;
  name: string;
  maxBid: number;
  currentBid: number;

  rating?: {
    score: number;
    total: number;
  };

  isYou?: boolean;
  isWinning?: boolean;
}

interface BidComparisonChartProps {
  bidders: Bidder[];
  highestBid: number;
}

export function BidComparisonChart({
  bidders,
  highestBid,
}: BidComparisonChartProps) {
  const sortedBidders = [...bidders].sort((a, b) => b.maxBid - a.maxBid);
  const maxBidValue = Math.max(...bidders.map((b) => b.maxBid), 1);

  return (
    <div className="bg-card border border-border/50 rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-[#fbbf24]" />
          <h3 className="text-foreground">Maximum Bid Comparison</h3>
        </div>
        <Badge variant="outline" className="border-border/50">
          {bidders.length} Bidders
        </Badge>
      </div>

      {/* Current Winner Banner */}
      {sortedBidders[0]?.isWinning && (
        <div className="bg-gradient-to-r from-[#10b981]/10 to-[#10b981]/5 border border-[#10b981]/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Crown className="h-6 w-6 text-[#10b981]" />
            <div>
              <p className="text-foreground flex items-center gap-2">
                {sortedBidders[0].isYou
                  ? "You are"
                  : `${sortedBidders[0].name} is`}{" "}
                currently winning
              </p>
              <p className="text-muted-foreground">
                Current bid:
                {formatCurrency(sortedBidders[0].currentBid)} • Max: $
                {formatCurrency(sortedBidders[0].maxBid)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bidders */}
      <div className="space-y-3">
        {sortedBidders.map((bidder, index) => {
          const percentage = (bidder.maxBid / maxBidValue) * 100;
          const isLeading = index === 0;
          const buffer = bidder.maxBid - bidder.currentBid;

          return (
            <div
              key={bidder.id}
              className={`relative rounded-lg border p-4 transition-all ${
                bidder.isYou
                  ? "bg-[#fbbf24]/5 border-[#fbbf24]/30"
                  : "bg-secondary/30 border-border/50"
              }`}
            >
              {/* Bidder Info */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback
                      className={
                        bidder.isYou
                          ? "bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] text-black"
                          : "bg-gradient-to-br from-[#fbbf24]/20 to-[#f59e0b]/20 text-foreground"
                      }
                    >
                      {bidder.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-foreground">
                        {bidder.isYou ? "You" : bidder.name}
                      </p>

                      {isLeading && (
                        <Crown className="h-4 w-4 text-[#10b981]" />
                      )}

                      {bidder.isYou && (
                        <Badge className="bg-[#fbbf24] text-black border-0 h-5">
                          You
                        </Badge>
                      )}
                    </div>

                    {/* Rating – aligned style */}
                    {bidder.rating && bidder.rating.total > 0 ? (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        Score: {bidder.rating?.score ?? 0} (
                        {bidder.rating?.total ?? 0}{" "}
                        {(bidder.rating?.total ?? 0) <= 1 ? "vote" : "votes"})
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-xs">
                        Rank #{index + 1}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={isLeading ? "text-[#10b981]" : "text-foreground"}
                  >
                    ${bidder.maxBid.toLocaleString()}
                  </p>
                  <p className="text-muted-foreground">max bid</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      bidder.isYou
                        ? "bg-gradient-to-r from-[#fbbf24] to-[#f59e0b]"
                        : isLeading
                        ? "bg-[#10b981]"
                        : "bg-muted-foreground"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Current: {formatCurrency(bidder.currentBid)}
                  </span>

                  {buffer >= 0 ? (
                    <span
                      className={
                        bidder.isYou
                          ? "text-[#fbbf24]"
                          : "text-muted-foreground"
                      }
                    >
                      Buffer: +{formatCurrency(buffer)}
                    </span>
                  ) : (
                    <span className="text-red-500">Outbid</span>
                  )}
                </div>
              </div>

              {/* Leading Badge */}
              {isLeading && (
                <div className="absolute -top-2 -right-2">
                  <div className="bg-[#10b981] text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Leading
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info Note */}
      <div className="bg-secondary/30 border border-border/50 rounded-lg p-4">
        <p className="text-muted-foreground text-center">
          💡 The system automatically bids up to your maximum to keep you in the
          lead
        </p>
      </div>
    </div>
  );
}
