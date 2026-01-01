import { useEffect, useState } from "react";
import { ShieldCheck, User, Star, Check, X, MessageSquare } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../ui/utils";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import {
  GET_BIDDER_REQUESTS_API,
  HANDLE_BIDDER_REQUEST_API,
} from "../utils/api";
import { toast } from "sonner";
import { Badge } from "../ui/badge";

interface BidRequest {
  id: string;
  bidder: {
    id: string;
    name: string;
    rating?: {
      positiveRate: number;
      totalVotes: number;
      positiveVotes: number;
    };
  };
  message?: string;
  status: "pending" | "approved" | "rejected";
}

interface SellerBidderPanelProps {
  productId: string;
}

export function SellerBidRequestPanel({ productId }: SellerBidderPanelProps) {
  const [requests, setRequests] = useState<BidRequest[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH REQUESTS ================= */
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetchWithAuth(GET_BIDDER_REQUESTS_API(productId));
      const json = await res.json();
      setRequests(json.data ?? []);
    } catch {
      toast.error("Failed to load bid requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [productId]);

  /* ================= HANDLE ACTION ================= */
  const handleAction = async (
    requestId: string,
    action: "approve" | "reject"
  ) => {
    try {
      await fetchWithAuth(HANDLE_BIDDER_REQUEST_API(requestId), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      toast.success(
        action === "approve" ? "Bidder approved" : "Bidder rejected"
      );

      fetchRequests(); // refresh
    } catch {
      toast.error("Failed to update request");
    }
  };

  return (
    <div
      className="
        relative overflow-hidden rounded-2xl p-6 space-y-5
        bg-gradient-to-br from-card via-card to-secondary/20
        border border-blue-500/30
        shadow-[0_0_0_1px_rgba(59,130,246,0.15)]
      "
    >
      {/* Glow */}
      <div
        className="
          pointer-events-none absolute inset-0 opacity-40
          bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_60%)]
        "
      />

      {/* Header */}
      <div className="relative flex items-center gap-3">
        <div className="p-3 rounded-xl bg-blue-500/15">
          <ShieldCheck className="h-6 w-6 text-blue-400" />
        </div>
        <div>
          <h3 className="text-foreground text-lg">Bid Requests</h3>
          <p className="text-sm text-muted-foreground">
            Review bidders requesting access
          </p>
        </div>
      </div>

      {/* ================= EMPTY STATE ================= */}
      {!loading && requests.length === 0 && (
        <div
          className="
            rounded-xl p-6 text-center
            bg-secondary/30
            border border-blue-500/30
            text-muted-foreground
          "
        >
          <p className="mb-2">No bid requests yet</p>
          <p className="text-xs">
            Approving allows the bidder to participate in this auction
          </p>
        </div>
      )}

      {/* ================= REQUEST LIST ================= */}
      <div className="space-y-4 relative">
        {requests.map((req) => {
          const rating = req.bidder.rating;
          const hasRating = rating && rating.totalVotes > 0;

          return (
            <div
              key={req.id}
              className="
                rounded-xl p-4
                bg-secondary/30
                border border-border/50
                space-y-3
              "
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground font-medium">
                      {req.bidder.name}
                    </span>
                  </div>

                  {/* Rating */}
                  {hasRating ? (
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-foreground">
                        {rating!.positiveRate}%
                      </span>
                      <span className="text-muted-foreground">
                        ({rating!.totalVotes} votes)
                      </span>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      No rating yet
                    </div>
                  )}
                </div>

                {/* Actions */}
                {req.status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      className="bg-[#10b981] hover:bg-[#059669] text-black"
                      onClick={() => handleAction(req.id, "approve")}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleAction(req.id, "reject")}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </>
                )}

                {req.status === "approved" && (
                  <Badge className="bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30">
                    ✓ Approved
                  </Badge>
                )}

                {req.status === "rejected" && (
                  <Badge className="bg-red-500/15 text-red-500 border border-red-500/30">
                    ✕ Rejected
                  </Badge>
                )}
              </div>

              {/* Message */}
              {req.message && (
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MessageSquare className="h-4 w-4 mt-0.5" />
                  <p className="italic">“{req.message}”</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
