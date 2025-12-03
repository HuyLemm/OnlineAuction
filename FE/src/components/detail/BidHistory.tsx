import { TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";

interface Bid {
  id: string;
  bidder: string;
  amount: number;
  time: string;
  isAutoBid?: boolean;
  isLeading?: boolean;
}

interface BidHistoryProps {
  bids?: Bid[];
}

export function BidHistory({ bids = [] }: BidHistoryProps) {
  // Default mock data if no bids provided
  const defaultBids: Bid[] = [
    {
      id: "1",
      bidder: "James Wilson",
      amount: 15000,
      time: "2 mins ago",
      isAutoBid: true,
      isLeading: true,
    },
    {
      id: "2",
      bidder: "Sarah Chen",
      amount: 14800,
      time: "15 mins ago",
      isAutoBid: true,
    },
    {
      id: "3",
      bidder: "Michael Rodriguez",
      amount: 14500,
      time: "1 hour ago",
    },
    {
      id: "4",
      bidder: "Emily Taylor",
      amount: 14200,
      time: "2 hours ago",
      isAutoBid: true,
    },
    {
      id: "5",
      bidder: "David Kim",
      amount: 14000,
      time: "3 hours ago",
    },
  ];

  const displayBids = bids.length > 0 ? bids : defaultBids;

  return (
    <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-foreground">Bid History</h3>
        <Badge variant="outline" className="border-border/50">
          {displayBids.length} bids
        </Badge>
      </div>

      {/* Bid List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {displayBids.map((bid, index) => (
          <div
            key={bid.id}
            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
              bid.isLeading
                ? "bg-[#fbbf24]/5 border-[#fbbf24]/20"
                : "bg-secondary/30 border-border/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-br from-[#fbbf24]/20 to-[#f59e0b]/20 text-foreground">
                  {bid.bidder.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-foreground">{bid.bidder}</p>
                  {bid.isLeading && (
                    <TrendingUp className="h-3 w-3 text-[#fbbf24]" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-muted-foreground">{bid.time}</p>
                  {bid.isAutoBid && (
                    <Badge variant="outline" className="h-5 text-[10px] border-border/50">
                      Auto Bid
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className={bid.isLeading ? "text-[#fbbf24]" : "text-foreground"}>
                ${bid.amount.toLocaleString()}
              </p>
              {index === 0 && bid.isLeading && (
                <p className="text-[#10b981]">Leading</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Note */}
      <p className="text-muted-foreground text-center pt-2 border-t border-border/50">
        Only the highest bid from each bidder is shown
      </p>
    </div>
  );
}