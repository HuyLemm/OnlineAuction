import { TrendingUp, Star } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { formatCurrency } from "../../lib/utils";

interface BidHistoryItem {
  id?: string; // có thể null từ backend
  amount: number;
  createdAt: string;
  bidder: {
    id: string;
    name: string;
    rating?: {
      score: number;
      total: number;
    };
  };
}

interface BidHistoryProps {
  bids: BidHistoryItem[];
}

function formatTime(date: string) {
  const d = new Date(date);
  return d.toLocaleString();
}

export function BidHistory({ bids }: BidHistoryProps) {
  if (!bids || bids.length === 0) {
    return (
      <div className="bg-card border border-border/50 rounded-xl p-6">
        <h3 className="text-foreground mb-2">Bid History</h3>
        <p className="text-muted-foreground text-center">
          No bids have been placed yet
        </p>
      </div>
    );
  }

  const highestAmount = Math.max(...bids.map((b) => b.amount));

  return (
    <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-foreground">Bid History</h3>
        <Badge variant="outline" className="border-border/50">
          {bids.length} bids
        </Badge>
      </div>

      {/* Bid list */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {bids.map((bid, index) => {
          const isLeading = bid.amount === highestAmount;

          // ⚠️ key LUÔN unique cho MỖI BID
          const key =
            bid.id ??
            `${bid.bidder.id}-${bid.createdAt}-${bid.amount}-${index}`;

          return (
            <div
              key={key}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                isLeading
                  ? "bg-[#fbbf24]/5 border-[#fbbf24]/30"
                  : "bg-secondary/30 border-border/50"
              }`}
            >
              {/* Bidder */}
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-br from-[#fbbf24]/20 to-[#f59e0b]/20 text-foreground">
                    {bid.bidder.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-foreground font-medium">
                      {bid.bidder.name}
                    </p>
                    {isLeading && (
                      <TrendingUp className="h-4 w-4 text-[#fbbf24]" />
                    )}
                  </div>

                  {/* Rating + time */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className="text-yellow-400">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      </span>
                      Score: {bid.bidder.rating?.score ?? 0} (
                      {bid.bidder.rating?.total ?? 0}{" "}
                      {(bid.bidder.rating?.total ?? 0) <= 1 ? "vote" : "votes"})
                    </span>
                    <span>•</span>
                    <span>{formatTime(bid.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="text-right">
                <p
                  className={`font-semibold ${
                    isLeading ? "text-[#fbbf24]" : "text-foreground"
                  }`}
                >
                  {formatCurrency(bid.amount)}
                </p>
                {isLeading && <p className="text-[#10b981] text-xs">Leading</p>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <p className="text-muted-foreground text-center pt-2 border-t border-border/50 text-sm">
        Bids are shown from newest to oldest
      </p>
    </div>
  );
}
