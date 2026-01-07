import { TrendingUp, Users, Crown, Star } from "lucide-react";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { formatCurrency } from "../../lib/utils";
import { useNavigate } from "react-router-dom";

const getLastChar = (name: string) => {
  if (!name) return "?";
  return name.trim().slice(-1).toUpperCase();
};

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
  isBlocked?: boolean;
}

interface BidComparisonChartProps {
  bidders: Bidder[];
  viewerRole?: "seller" | "bidder" | "admin";
}

export function BidComparisonChart({
  bidders,
  viewerRole,
}: BidComparisonChartProps) {
  const navigate = useNavigate();

  /* ===============================
   * Sort: WINNER FIRST
   * =============================== */
  const activeBidders = bidders.filter((b) => !b.isBlocked);

  const blockedBidders = bidders.filter((b) => b.isBlocked);

  const sortedBidders = [
    ...activeBidders.sort((a, b) => {
      if (a.isWinning && !b.isWinning) return -1;
      if (!a.isWinning && b.isWinning) return 1;
      return b.maxBid - a.maxBid;
    }),
    ...blockedBidders, // 👈 đưa xuống cuối
  ];

  const maxBidValue = Math.max(...activeBidders.map((b) => b.maxBid), 1);

  const winningBidder = sortedBidders.find((b) => b.isWinning && !b.isBlocked);

  return (
    <div className="bg-card border border-border/50 rounded-xl p-6 space-y-6">
      {/* ================= Header ================= */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-[#fbbf24]" />
          <h3 className="text-foreground">Maximum Bid Comparison</h3>
        </div>
        <Badge variant="outline" className="border-border/50">
          {bidders.length} Bidders
        </Badge>
        {blockedBidders.length > 0 && (
          <Badge className="bg-red-500/10 text-red-500 border border-red-500/30 h-5">
            {blockedBidders.length} Blocked
          </Badge>
        )}
      </div>

      {/* ================= Winner Banner ================= */}
      {winningBidder && (
        <div className="bg-gradient-to-r from-[#10b981]/10 to-[#10b981]/5 border border-[#10b981]/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Crown className="h-6 w-6 text-[#10b981]" />
            <div>
              <p className="text-foreground flex items-center gap-2">
                {winningBidder.isYou ? "You are" : `${winningBidder.name} is`}{" "}
                currently winning
              </p>
              <p className="text-muted-foreground">
                Current bid: {formatCurrency(winningBidder.currentBid)} • Max:{" "}
                {formatCurrency(winningBidder.maxBid)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= Bidders ================= */}
      <div className="space-y-3 max-h-110 overflow-y-auto overflow-x-hidden pr-4 pt-2 ">
        {sortedBidders.map((bidder, index) => {
          const percentage = (bidder.maxBid / maxBidValue) * 100;
          const buffer = bidder.isWinning
            ? bidder.maxBid - bidder.currentBid
            : null;
          const activeIndex = activeBidders.findIndex(
            (b) => b.id === bidder.id
          );

          return (
            <div
              key={bidder.id}
              className={`relative rounded-lg border p-4 transition-all ${
                bidder.isBlocked
                  ? "bg-red-500/5 border-red-500/30 opacity-60"
                  : bidder.isYou
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
                      {getLastChar(bidder.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-foreground">{bidder.name}</p>

                      {viewerRole === "seller" && (
                        <Badge
                          variant="outline"
                          className="cursor-pointer text-xs border-green-500/20 bg-green-500/5 text-green-500"
                          onClick={() =>
                            navigate(`/profile/bidder/${bidder.id}`)
                          }
                        >
                          View Legit
                        </Badge>
                      )}

                      {bidder.isWinning && (
                        <Crown className="h-4 w-4 text-[#10b981]" />
                      )}

                      {bidder.isYou && (
                        <Badge className="bg-[#fbbf24] text-black border-0 h-5">
                          You
                        </Badge>
                      )}
                    </div>

                    {!bidder.isBlocked ? (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {/* 🔢 Rank – LUÔN HIỆN */}
                        <span>Rank #{activeIndex + 1}</span>

                        <span className="opacity-50">•</span>

                        {/* ⭐ Rating – LUÔN HIỆN */}
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span>
                            {bidder.rating?.score ?? 0} (
                            {bidder.rating?.total ?? 0}{" "}
                            {(bidder.rating?.total ?? 0) <= 1
                              ? "vote"
                              : "votes"}
                            )
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-red-500 text-xs">🚫 Blocked</p>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={
                      bidder.isWinning ? "text-[#10b981]" : "text-foreground"
                    }
                  >
                    {formatCurrency(bidder.maxBid)}
                  </p>
                  <p className="text-muted-foreground">max bid</p>
                </div>
              </div>

              {/* Progress */}
              {bidder.isBlocked ? (
                <p className="text-red-500 text-sm mt-2">
                  🚫 This bidder has been removed from the auction
                </p>
              ) : (
                <>
                  <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        bidder.isYou
                          ? "bg-gradient-to-r from-[#fbbf24] to-[#f59e0b]"
                          : bidder.isWinning
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

                    {buffer !== null ? (
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
                </>
              )}

              {/* Leading badge */}
              {bidder.isWinning && !bidder.isBlocked && (
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

      {/* Info */}
      <div className="bg-secondary/30 border border-border/50 rounded-lg p-4">
        <p className="text-muted-foreground text-center">
          💡 The system automatically bids the minimum required amount to keep
          the leading bidder ahead
        </p>
      </div>
    </div>
  );
}
