import { TrendingUp, Star } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { formatCurrency } from "../../lib/utils";

const getLastChar = (name: string) => {
  if (!name) return "?";
  return name.trim().slice(-1).toUpperCase();
};

interface BidHistoryItem {
  id?: string;
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
  blockedBidderIds?: string[]; // 👈 QUAN TRỌNG
}

function formatTime(date: string) {
  return new Date(date).toLocaleString();
}

export function BidHistory({ bids, blockedBidderIds = [] }: BidHistoryProps) {
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

  /* ===============================
   * ACTIVE bids (không bị block)
   * =============================== */
  const activeBids = bids.filter(
    (b) => !blockedBidderIds.includes(b.bidder.id)
  );

  const blockedBids = bids.filter((b) =>
    blockedBidderIds.includes(b.bidder.id)
  );

  // 👉 ACTIVE trước, BLOCKED sau
  const sortedBids = [...activeBids, ...blockedBids];

  const highestActiveAmount =
    activeBids.length > 0 ? Math.max(...activeBids.map((b) => b.amount)) : null;

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
        {sortedBids.map((bid, index) => {
          const isBlocked = blockedBidderIds.includes(bid.bidder.id);

          const isLeading =
            highestActiveAmount !== null &&
            bid.amount === highestActiveAmount &&
            !isBlocked;

          const key =
            bid.id ??
            `${bid.bidder.id}-${bid.createdAt}-${bid.amount}-${index}`;

          return (
            <div
              key={key}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                isBlocked
                  ? "bg-red-500/5 border-red-500/30 opacity-70"
                  : isLeading
                  ? "bg-[#fbbf24]/5 border-[#fbbf24]/30"
                  : "bg-secondary/30 border-border/50"
              }`}
            >
              {/* Bidder */}
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback
                    className={
                      isBlocked
                        ? "bg-red-500/20 text-red-500"
                        : "bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] text-black"
                    }
                  >
                    {getLastChar(bid.bidder.name)}
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

                    {isBlocked && (
                      <Badge className="bg-red-500/10 text-red-500 border border-red-500/30 h-4">
                        Blocked
                      </Badge>
                    )}
                  </div>

                  {/* Rank + Rating + Time */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {/* Rank (chỉ active mới có rank) */}
                    {!isBlocked && highestActiveAmount !== null && (
                      <span>
                        Rank #
                        {Array.from(
                          new Set(
                            activeBids
                              .map((b) => b.amount)
                              .sort((a, b) => b - a)
                          )
                        ).indexOf(bid.amount) + 1}
                      </span>
                    )}

                    {!isBlocked && <span className="opacity-50">•</span>}

                    {/* Rating – LUÔN HIỆN */}
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      {bid.bidder.rating?.score ?? 0} (
                      {bid.bidder.rating?.total ?? 0}{" "}
                      {(bid.bidder.rating?.total ?? 0) <= 1 ? "vote" : "votes"})
                    </span>

                    <span className="opacity-50">•</span>
                    <span>{formatTime(bid.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="text-right">
                <p
                  className={`font-semibold ${
                    isLeading
                      ? "text-[#fbbf24]"
                      : isBlocked
                      ? "text-red-500"
                      : "text-foreground"
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
