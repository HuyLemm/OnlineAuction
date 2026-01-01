import { useEffect, useState } from "react";
import { Ban, Crown } from "lucide-react";
import { Button } from "../ui/button";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { GET_ACTIVE_BIDDERS_API, KICK_BIDDER_API } from "../utils/api";
import { formatCurrency } from "../../lib/utils";
import { toast } from "sonner";
import { LoadingSpinner } from "../state";

interface BidderItem {
  id: string;
  full_name: string;
  email: string;
  bidsCount: number;
  highestbid: number | null;
  maxautobid: number | null;
}

interface Props {
  productId: string;
  currentPrice: number;
  highestBidderId?: string | null;
  onKickSuccess: () => Promise<void>;
}

export function SellerBidderPanel({
  productId,
  currentPrice,
  highestBidderId,
  onKickSuccess,
}: Props) {
  const [bidders, setBidders] = useState<BidderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmBidder, setConfirmBidder] = useState<BidderItem | null>(null);
  const [kickingId, setKickingId] = useState<string | null>(null);

  const loadBidders = async () => {
    try {
      setLoading(true);
      const res = await fetchWithAuth(GET_ACTIVE_BIDDERS_API(productId));
      const json = await res.json();
      console.log(json);
      setBidders(json.data ?? []);
    } catch {
      toast.error("Failed to load bidders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBidders();
  }, [productId]);

  const handleConfirmKick = async () => {
    if (!confirmBidder) return;

    try {
      setKickingId(confirmBidder.id);

      const res = await fetchWithAuth(
        KICK_BIDDER_API(productId, confirmBidder.id),
        { method: "POST" }
      );

      const json = await res.json();
      if (!res.ok) throw new Error(json.message);

      toast.success("Bidder removed from auction");

      setConfirmBidder(null);
      await loadBidders();
      await onKickSuccess();
    } catch (err: any) {
      toast.error(err.message || "Failed to remove bidder");
    } finally {
      setKickingId(null);
    }
  };

  return (
    <div className=" max-h-135 overflow-y-auto rounded-xl border border-yellow-500/40 bg-background p-5 space-y-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-yellow-500">
          Active Bidders
        </h3>
        <span className="text-sm text-muted-foreground">
          Current price:{" "}
          <span className="font-semibold text-foreground">
            {formatCurrency(currentPrice)}
          </span>
        </span>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center">
          <LoadingSpinner />
          <span className="text-muted-foreground">Loading bidders…</span>
        </div>
      ) : bidders.length === 0 ? (
        <p className="text-muted-foreground italic">
          No bidders participating yet
        </p>
      ) : (
        <ul className="space-y-4 ">
          {bidders.map((b) => {
            const isHighest = b.id === highestBidderId;

            return (
              <li
                key={b.id}
                className={` rounded-xl border p-4 transition ${
                  isHighest
                    ? "border-yellow-400/60 bg-yellow-500/10 shadow-yellow-500/10 shadow-md"
                    : "border-border bg-background/40"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  {/* LEFT: Bidder info */}
                  <div className="space-y-1">
                    {/* Name */}
                    <div className="flex items-center gap-2">
                      <span className="text-base font-semibold text-foreground">
                        {b.full_name}
                      </span>

                      {isHighest && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs font-medium text-yellow-400">
                          👑 Highest
                        </span>
                      )}
                    </div>

                    {/* Prices */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      {/* Highest bid */}
                      <div className="text-green-400">
                        Highest bid:{" "}
                        <span className="font-semibold text-green-300">
                          {b.highestbid ? formatCurrency(b.highestbid) : "—"}
                        </span>
                      </div>

                      {/* Auto bid max */}
                      <div className="text-blue-400">
                        Auto bid max:{" "}
                        <span className="font-semibold text-blue-300">
                          {b.maxautobid ? formatCurrency(b.maxautobid) : "—"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: Kick */}
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={!!kickingId}
                    className="bg-red-600/90 hover:bg-red-600"
                    onClick={() => setConfirmBidder(b)}
                  >
                    {kickingId === b.id ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      "Kick"
                    )}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {confirmBidder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-foreground">
              Remove bidder from auction?
            </h3>

            <p className="mt-3 text-sm text-muted-foreground">
              You are about to remove{" "}
              <span className="font-medium text-foreground">
                {confirmBidder.full_name}
              </span>{" "}
              from this auction.
            </p>

            {/* Warning nếu là highest */}
            {confirmBidder.id === highestBidderId && (
              <div className="mt-4 rounded-lg border border-yellow-400/40 bg-yellow-500/10 p-3 text-sm text-yellow-500">
                ⚠️ This bidder is currently leading. Removing them will
                recalculate the auction price and winner.
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setConfirmBidder(null)}
                disabled={!!kickingId}
              >
                Cancel
              </Button>

              <Button
                variant="destructive"
                disabled={!!kickingId}
                onClick={() => handleConfirmKick()}
              >
                {kickingId ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Removing…
                  </span>
                ) : (
                  "Confirm Kick"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
