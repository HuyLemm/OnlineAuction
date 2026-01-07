import { Crown, TrendingUp, AlertCircle, CheckCircle, Zap } from "lucide-react";
import { Badge } from "../ui/badge";

interface BidStatusIndicatorProps {
  status: "winning" | "outbid" | "leading_auto" | "auto_active" | "no_bid";
  currentBid?: number;
  yourMaxBid?: number;
  highestMaxBid?: number;
  nextBidAmount?: number;
}

export function BidStatusIndicator({
  status,
  currentBid,
  yourMaxBid,
  highestMaxBid,
  nextBidAmount,
}: BidStatusIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "winning":
        return {
          icon: <Crown className="h-6 w-6" />,
          title: "You're Winning!",
          description: "You have the highest bid and are currently in the lead",
          bgColor: "bg-gradient-to-br from-[#10b981]/10 to-[#10b981]/5",
          borderColor: "border-[#10b981]/30",
          iconColor: "text-[#10b981]",
          badge: (
            <Badge className="bg-[#10b981] text-white border-0">
              <Crown className="h-3 w-3 mr-1" />
              Leading
            </Badge>
          ),
        };

      case "leading_auto":
        return {
          icon: <TrendingUp className="h-6 w-6" />,
          title: "Auto-Bidding Active & Leading",
          description:
            "Your auto-bid is working! You're leading and the system will automatically bid up to your maximum",
          bgColor: "bg-gradient-to-br from-[#10b981]/10 to-[#fbbf24]/5",
          borderColor: "border-[#fbbf24]/30",
          iconColor: "text-[#10b981]",
          badge: (
            <Badge className="bg-gradient-to-r from-[#10b981] to-[#fbbf24] text-white border-0">
              <Zap className="h-3 w-3 mr-1" />
              Auto-Leading
            </Badge>
          ),
        };

      case "auto_active":
        return {
          icon: <Zap className="h-6 w-6" />,
          title: "Auto-Bidding Active",
          description:
            "Your auto-bid is set. The system will automatically bid on your behalf when outbid",
          bgColor: "bg-gradient-to-br from-[#fbbf24]/10 to-[#fbbf24]/5",
          borderColor: "border-[#fbbf24]/30",
          iconColor: "text-[#fbbf24]",
          badge: (
            <Badge className="bg-[#fbbf24] text-black border-0">
              <Zap className="h-3 w-3 mr-1" />
              Auto Active
            </Badge>
          ),
        };

      case "outbid":
        return {
          icon: <AlertCircle className="h-6 w-6" />,
          title: "You've Been Outbid",
          description:
            "Another bidder has placed a higher maximum bid. Increase your max bid to regain the lead",
          bgColor: "bg-gradient-to-br from-[#ef4444]/10 to-[#ef4444]/5",
          borderColor: "border-[#ef4444]/30",
          iconColor: "text-[#ef4444]",
          badge: (
            <Badge className="bg-[#ef4444] text-white border-0">
              <AlertCircle className="h-3 w-3 mr-1" />
              Outbid
            </Badge>
          ),
        };

      case "no_bid":
      default:
        return {
          icon: <CheckCircle className="h-6 w-6" />,
          title: "Ready to Bid",
          description: "Place a bid or set up auto-bidding to participate in this auction",
          bgColor: "bg-secondary/30",
          borderColor: "border-border/50",
          iconColor: "text-muted-foreground",
          badge: (
            <Badge variant="outline" className="border-border/50">
              Not Bidding
            </Badge>
          ),
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div
      className={`rounded-xl border p-6 space-y-4 ${config.bgColor} ${config.borderColor}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`${config.iconColor}`}>{config.icon}</div>
          <div>
            <h4 className="text-foreground">{config.title}</h4>
            <p className="text-muted-foreground mt-1">{config.description}</p>
          </div>
        </div>
        {config.badge}
      </div>

      {/* Bid Details */}
      {(currentBid || yourMaxBid || highestMaxBid) && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-border/50">
          {currentBid && (
            <div>
              <p className="text-muted-foreground">Current Bid</p>
              <p className="text-foreground">${currentBid.toLocaleString()}</p>
            </div>
          )}
          {yourMaxBid && (
            <div>
              <p className="text-muted-foreground">Your Max Bid</p>
              <p className="text-[#fbbf24]">${yourMaxBid.toLocaleString()}</p>
            </div>
          )}
          {highestMaxBid && status === "outbid" && (
            <div>
              <p className="text-muted-foreground">Highest Max Bid</p>
              <p className="text-[#ef4444]">${highestMaxBid.toLocaleString()}</p>
            </div>
          )}
        </div>
      )}

      {/* Action Hint */}
      {status === "outbid" && nextBidAmount && (
        <div className="bg-background/50 rounded-lg p-3 border border-border/50">
          <p className="text-muted-foreground text-center">
            💡 Set your max bid to at least{" "}
            <span className="text-[#fbbf24]">${nextBidAmount.toLocaleString()}</span> to
            regain the lead
          </p>
        </div>
      )}

      {status === "leading_auto" && (
        <div className="bg-background/50 rounded-lg p-3 border border-border/50">
          <p className="text-muted-foreground text-center">
            ✓ Your auto-bid is protecting your position automatically
          </p>
        </div>
      )}
    </div>
  );
}
