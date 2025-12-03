import { Zap, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";

interface AutoBidEvent {
  id: string;
  type: "auto_bid" | "max_bid_set" | "max_bid_updated" | "outbid" | "winning";
  bidder: string;
  amount?: number;
  maxBid?: number;
  previousAmount?: number;
  timestamp: string;
  isYou?: boolean;
  description: string;
}

interface AutoBidHistoryProps {
  events: AutoBidEvent[];
}

export function AutoBidHistory({ events }: AutoBidHistoryProps) {
  const getEventIcon = (type: AutoBidEvent["type"]) => {
    switch (type) {
      case "auto_bid":
        return <Zap className="h-4 w-4 text-[#fbbf24]" />;
      case "max_bid_set":
      case "max_bid_updated":
        return <Activity className="h-4 w-4 text-[#10b981]" />;
      case "outbid":
        return <TrendingDown className="h-4 w-4 text-[#ef4444]" />;
      case "winning":
        return <TrendingUp className="h-4 w-4 text-[#10b981]" />;
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getEventColor = (type: AutoBidEvent["type"]) => {
    switch (type) {
      case "auto_bid":
        return "border-[#fbbf24]/20 bg-[#fbbf24]/5";
      case "max_bid_set":
      case "max_bid_updated":
      case "winning":
        return "border-[#10b981]/20 bg-[#10b981]/5";
      case "outbid":
        return "border-[#ef4444]/20 bg-[#ef4444]/5";
      default:
        return "border-border/50 bg-secondary/30";
    }
  };

  return (
    <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-[#fbbf24]" />
          <h3 className="text-foreground">Auto-Bidding Activity</h3>
        </div>
        <Badge variant="outline" className="border-border/50">
          {events.length} Events
        </Badge>
      </div>

      {/* Timeline */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {events.map((event, index) => (
          <div
            key={event.id}
            className={`relative flex gap-4 p-4 rounded-lg border transition-all ${getEventColor(
              event.type
            )} ${event.isYou ? "ring-1 ring-[#fbbf24]/30" : ""}`}
          >
            {/* Timeline Line */}
            {index < events.length - 1 && (
              <div className="absolute left-[38px] top-14 bottom-0 w-px bg-border/50" />
            )}

            {/* Avatar/Icon */}
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarFallback
                  className={
                    event.isYou
                      ? "bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] text-black"
                      : "bg-gradient-to-br from-secondary to-secondary/50 text-foreground"
                  }
                >
                  {event.bidder.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1">
                {getEventIcon(event.type)}
              </div>
            </div>

            {/* Event Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-foreground">
                      {event.isYou ? "You" : event.bidder}
                    </p>
                    {event.isYou && (
                      <Badge className="bg-[#fbbf24] text-black border-0 h-5">
                        You
                      </Badge>
                    )}
                    {event.type === "auto_bid" && (
                      <Badge variant="outline" className="border-border/50 h-5">
                        <Zap className="h-3 w-3 mr-1" />
                        Auto
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-1">
                    {event.description}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-muted-foreground">{event.timestamp}</p>
                </div>
              </div>

              {/* Amount Details */}
              {event.amount && (
                <div className="mt-2 flex items-center gap-4">
                  {event.previousAmount && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground line-through">
                        ${event.previousAmount.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground">→</span>
                    </div>
                  )}
                  <span
                    className={
                      event.type === "winning" || event.type === "auto_bid"
                        ? "text-[#10b981]"
                        : event.type === "outbid"
                        ? "text-[#ef4444]"
                        : "text-foreground"
                    }
                  >
                    ${event.amount.toLocaleString()}
                  </span>
                  {event.maxBid && (
                    <span className="text-muted-foreground">
                      (max: ${event.maxBid.toLocaleString()})
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
        <div className="text-center">
          <p className="text-muted-foreground">Auto Bids</p>
          <p className="text-foreground">
            {events.filter((e) => e.type === "auto_bid").length}
          </p>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground">Updates</p>
          <p className="text-foreground">
            {events.filter((e) => e.type === "max_bid_updated").length}
          </p>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground">Total Events</p>
          <p className="text-foreground">{events.length}</p>
        </div>
      </div>
    </div>
  );
}
