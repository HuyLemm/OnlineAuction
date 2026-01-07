import {
  ShieldCheck,
  MailWarning,
  Ban,
  Star,
  TrendingUp,
  Send,
} from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../ui/utils";

interface Props {
  type: "need_approval" | "blocked" | "blocked_by_seller";
  reason?: string;
  rating?: {
    positiveRate: number;
    positiveVotes: number;
    totalVotes: number;
  };
  onSendRequest?: () => void;
}

export function QualifiedNotice({
  type,
  reason,
  rating,
  onSendRequest,
}: Props) {
  const isApproval = type === "need_approval" && onSendRequest;
  const isBlockedBySeller = type === "blocked_by_seller";
  const isRatingBlocked = type === "blocked";
  const requiredRate = 80;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 space-y-5",
        "bg-gradient-to-br from-card via-card to-secondary/20",
        isApproval ? "border border-[#fbbf24]/30" : "border border-red-500/30"
      )}
    >
      {/* Glow */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 opacity-40",
          isApproval
            ? "bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.15),transparent_60%)]"
            : "bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.15),transparent_60%)]"
        )}
      />

      {/* Header */}
      <div className="flex items-start gap-4 relative">
        <div
          className={cn(
            "p-3 rounded-xl",
            isApproval ? "bg-[#fbbf24]/15" : "bg-red-500/15"
          )}
        >
          <div
            className={cn(
              "p-3 rounded-xl",
              isApproval
                ? "bg-[#fbbf24]/15"
                : isBlockedBySeller
                ? "bg-red-600/15"
                : "bg-red-500/15"
            )}
          >
            {isApproval ? (
              <MailWarning className="h-6 w-6 text-[#fbbf24]" />
            ) : isBlockedBySeller ? (
              <Ban className="h-6 w-6 text-red-500" />
            ) : (
              <ShieldCheck className="h-6 w-6 text-red-500" />
            )}
          </div>
        </div>

        <div>
          <h3 className="text-foreground text-lg">
            {isApproval
              ? "Qualified Auction"
              : isBlockedBySeller
              ? "Blocked by Seller"
              : "Bidder Not Qualified"}
          </h3>

          <p className="text-muted-foreground text-sm">
            {isApproval
              ? "This auction requires seller approval"
              : isBlockedBySeller
              ? "The seller has blocked you from bidding on this auction"
              : "Your account does not meet the bidding requirements"}
          </p>
        </div>
      </div>

      {/* Rating stats */}
      {rating && isRatingBlocked && (
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-foreground text-lg">{rating.totalVotes}</p>
            <p className="text-muted-foreground text-xs">Total Votes</p>
          </div>

          <div>
            <p className="text-foreground text-lg">{rating.positiveVotes}</p>
            <p className="text-muted-foreground text-xs">Positive</p>
          </div>

          <div>
            <p
              className={cn(
                "text-lg flex items-center justify-center gap-1",
                rating.positiveRate >= requiredRate
                  ? "text-[#10b981]"
                  : "text-red-500"
              )}
            >
              <Star className="h-4 w-4 fill-current" />
              {rating.positiveRate}%
            </p>
            <p className="text-muted-foreground text-xs">Positive Rate</p>
          </div>
        </div>
      )}

      {/* Requirement comparison */}
      <div
        className={cn(
          "rounded-xl p-4 space-y-1 bg-secondary/30 border",
          isApproval ? "border-[#fbbf24]/30" : "border-red-500/30"
        )}
      >
        <p className="flex items-center gap-2 text-foreground">
          {isApproval ? (
            <MailWarning className="h-4 w-4 text-[#fbbf24]" />
          ) : (
            <Ban className="h-4 w-4 text-red-500" />
          )}

          {isApproval
            ? "Seller approval required"
            : isBlockedBySeller
            ? "You have been blocked by the seller"
            : "You do not meet the rating requirements"}
        </p>

        {isRatingBlocked && (
          <p className="text-sm text-muted-foreground">
            Requirement: at least{" "}
            <span className="text-foreground font-medium">
              {requiredRate}% positive rating
            </span>
          </p>
        )}

        {reason && <p className="text-sm text-muted-foreground">{reason}</p>}
      </div>

      {/* CTA */}
      {isApproval && (
        <Button
          onClick={onSendRequest}
          className="w-full h-12 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90"
        >
          <Send className="h-4 w-4 mr-2" />
          Send Request for Bidding
        </Button>
      )}

      <p className="text-xs text-muted-foreground text-center">
        Qualification helps protect sellers and serious bidders
      </p>
    </div>
  );
}
