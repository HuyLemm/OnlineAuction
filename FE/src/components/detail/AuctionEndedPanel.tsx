import { Trophy, Clock, Lock } from "lucide-react";
import { formatCurrency } from "../../lib/utils";

interface AuctionEndedPanelProps {
  status: "closed" | "expired";
  finalPrice: number;
  highestBidderId?: string | null;
  highestBidderName?: string | null;
  isWinner?: boolean;
}

export function AuctionEndedPanel({
  status,
  finalPrice,
  highestBidderId,
  highestBidderName,
  isWinner,
}: AuctionEndedPanelProps) {
  const isSold = Boolean(highestBidderId);

  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-muted">
          {isSold ? (
            <Trophy className="h-5 w-5 text-yellow-500" />
          ) : (
            <Lock className="h-5 w-5 text-muted-foreground" />
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-yellow-500">
            {isSold ? "Auction Closed" : "Auction Expired"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {status === "expired"
              ? "This auction expired"
              : "This auction has been closed"}
          </p>
        </div>
      </div>

      {/* Final price */}
      <div>
        <p className="text-sm text-muted-foreground">Final Price</p>
        <p className="text-3xl font-bold text-green-500">
          {formatCurrency(finalPrice)}
        </p>
      </div>

      {/* Winner info */}
      {isSold && (
        <div className="text-sm">
          <span className="text-muted-foreground">Winner: </span>
          <span className="font-medium text-yellow-500">
            {highestBidderName ?? "Unknown"}
          </span>
        </div>
      )}

      {/* You won */}
      {isWinner && (
        <div className="rounded-lg bg-green-500/10 border border-green-500/30 p-3 text-green-500 text-sm">
          🎉 Congratulations! You won this auction.
        </div>
      )}

      {!isSold && (
        <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground flex items-center gap-2">
          <Clock className="h-4 w-4" />
          No bids were placed on this item
        </div>
      )}
    </div>
  );
}
