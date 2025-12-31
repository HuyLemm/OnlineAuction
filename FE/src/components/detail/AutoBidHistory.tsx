import { Zap, TrendingUp, TrendingDown, Activity, Crown } from "lucide-react";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useMemo } from "react";

const getLastChar = (name: string) => {
  if (!name) return "?";
  return name.trim().slice(-1).toUpperCase();
};

interface AutoBidEvent {
  id: string;
  type:
    | "auto_bid"
    | "max_bid_set"
    | "max_bid_updated"
    | "outbid_instantly"
    | "tie_break_win"
    | "winning";
  bidderId: string;
  bidderName: string;
  amount?: number;
  maxBid?: number;
  createdAt: string;
  isYou?: boolean;
  description: string;
  relatedBidderId?: string;
}

interface AutoBidHistoryProps {
  events: AutoBidEvent[];
  currentUserId?: string;
  currentUserRole?: "bidder" | "seller" | "admin";
}

export function AutoBidHistory({ events, currentUserId, currentUserRole }: AutoBidHistoryProps) {
  const filteredEvents = useMemo(() => {
    // ✅ Seller / Admin thấy tất cả
    if (currentUserRole === "seller" || currentUserRole === "admin") {
      return events;
    }

    // ❌ Chưa login → không thấy gì
    if (!currentUserId) return [];

    // 👤 Bidder thường
    return events.filter((e) => {
      if (e.bidderId === currentUserId) return true;
      if (e.relatedBidderId === currentUserId) return true;
      return false;
    });
  }, [events, currentUserId, currentUserRole]);

  /* ---------- Icon ---------- */
  const getEventIcon = (type: AutoBidEvent["type"]) => {
    switch (type) {
      case "auto_bid":
        return <Zap className="h-4 w-4 text-[#fbbf24]" />;
      case "max_bid_set":
      case "max_bid_updated":
        return <Activity className="h-4 w-4 text-[#10b981]" />;
      case "outbid_instantly":
        return <TrendingDown className="h-4 w-4 text-[#ef4444]" />;
      case "tie_break_win":
        return <Crown className="h-4 w-4 text-[#10b981]" />;
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
      case "tie_break_win":
        return "border-[#10b981]/20 bg-[#10b981]/5";
      case "outbid_instantly":
        return "border-[#ef4444]/20 bg-[#ef4444]/5";
      default:
        return "border-border/50 bg-secondary/30";
    }
  };

  return (
    <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4 ">
      {/* ================= Header ================= */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-[#fbbf24]" />
          <h3 className="text-foreground">Auto-Bidding Activity</h3>
        </div>
        <Badge variant="outline" className="border-border/50">
          {filteredEvents.length} Events
        </Badge>
      </div>

      {/* ================= Timeline ================= */}
      <div className="space-y-3 max-h-140 overflow-y-auto">
        {filteredEvents.map((event, index) => (
          <div
            key={event.id}
            className={`relative flex gap-4 p-4 rounded-lg border transition-all ${getEventColor(
              event.type
            )} ${event.isYou ? "ring-1 ring-[#fbbf24]/30" : ""}`}
          >
            {/* Timeline line */}
            {index < filteredEvents.length - 1 && (
              <div className="absolute left-[38px] top-14 bottom-0 w-px bg-border/50" />
            )}

            {/* Avatar + Icon */}
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarFallback
                  className={
                    event.isYou
                      ? "bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] text-black"
                      : "bg-gradient-to-br from-secondary to-secondary/50 text-foreground"
                  }
                >
                  {getLastChar(event.bidderName)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1">
                {getEventIcon(event.type)}
              </div>
            </div>

            {/* Event details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-foreground">{event.bidderName}</p>

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
                    {event.relatedBidderId === currentUserId &&
                      event.bidderId !== currentUserId && (
                        <>
                          {" "}
                          <span className="text-[#ef4444]">
                            by {event.bidderName}
                          </span>
                        </>
                      )}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-muted-foreground text-sm">
                    {new Date(event.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Amount / Max */}
              {(event.amount !== undefined || event.maxBid !== undefined) && (
                <div className="mt-2 flex items-center gap-4 text-sm">
                  {event.amount !== undefined && (
                    <span
                      className={
                        event.type === "auto_bid" ||
                        event.type === "winning" ||
                        event.type === "tie_break_win"
                          ? "text-[#10b981]"
                          : event.type === "outbid_instantly"
                          ? "text-[#ef4444]"
                          : "text-foreground"
                      }
                    >
                      ${event.amount.toLocaleString()}
                    </span>
                  )}

                  {event.maxBid !== undefined && (
                    <span className="text-muted-foreground">
                      (Max: ${event.maxBid.toLocaleString()})
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ================= Summary ================= */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
        <div className="text-center">
          <p className="text-muted-foreground">Auto Bids</p>
          <p className="text-foreground">
            {filteredEvents.filter((e) => e.type === "auto_bid").length}
          </p>
        </div>

        <div className="text-center">
          <p className="text-muted-foreground">Max Updates</p>
          <p className="text-foreground">
            {filteredEvents.filter((e) => e.type === "max_bid_updated").length}
          </p>
        </div>

        <div className="text-center">
          <p className="text-muted-foreground">Total Events</p>
          <p className="text-foreground">{filteredEvents.length}</p>
        </div>
      </div>
    </div>
  );
}
