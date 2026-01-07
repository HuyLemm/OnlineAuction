import { useState } from "react";
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Zap,
  Lock,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../ui/button";
import { formatCurrency } from "../../lib/utils";
import { cn } from "../ui/utils";

interface PriceDisplayProps {
  currentPrice: number;
  buyNowPrice?: number | null;
  onBuyNow?: () => Promise<void> | void; // chỉ truyền khi allowed
}

export function PriceDisplay({
  currentPrice,
  buyNowPrice,
  onBuyNow,
}: PriceDisplayProps) {
  const canBuyNow = Boolean(onBuyNow && buyNowPrice);

  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirmBuyNow = async () => {
    if (!onBuyNow) return;

    try {
      setLoading(true);
      await onBuyNow();
      setShowConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 relative">
      {/* ================= Current Price ================= */}
      <div className="bg-gradient-to-br from-card to-secondary/20 border border-[#10b981]/30 rounded-xl p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2 bg-[#10b981]/10 rounded-lg">
            <TrendingUp className="h-4 w-4 text-[#10b981]" />
          </div>
          <div>
            <p className="text-foreground">Current Price</p>
            <p className="text-xs text-muted-foreground">Live auction price</p>
          </div>
        </div>

        <p className="pl-10 text-3xl bg-gradient-to-r from-[#10b981] to-[#059669] bg-clip-text text-transparent">
          {formatCurrency(currentPrice)}
        </p>
      </div>

      {/* ================= Buy Now ================= */}
      {buyNowPrice != null && (
        <>
          <div
            className={cn(
              "bg-gradient-to-br from-card to-secondary/20 rounded-xl p-5 border transition-all",
              canBuyNow ? "border-[#fbbf24]/40" : "border-border/50 opacity-80"
            )}
          >
            <div className="flex items-start gap-3 mb-3">
              <div
                className={cn(
                  "p-2 rounded-lg",
                  canBuyNow ? "bg-[#fbbf24]/10" : "bg-secondary/40"
                )}
              >
                <ShoppingCart
                  className={cn(
                    "h-4 w-4",
                    canBuyNow ? "text-[#fbbf24]" : "text-muted-foreground"
                  )}
                />
              </div>

              <div>
                <p className="text-foreground flex items-center gap-2">
                  Buy Now Price
                  {!canBuyNow && (
                    <Lock className="h-3 w-3 text-muted-foreground" />
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  Skip bidding & buy instantly
                </p>
              </div>
            </div>

            <p className="pl-10 text-3xl bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] bg-clip-text text-transparent">
              {formatCurrency(buyNowPrice)}
            </p>

            <p className="mt-2 pl-10 text-xs text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              Save{" "}
              {Math.max(
                0,
                Math.round(((buyNowPrice - currentPrice) / buyNowPrice) * 100)
              )}
              % by bidding
            </p>

            {/* ===== CTA ===== */}
            <div className="mt-4 pl-10">
              <Button
                onClick={() => canBuyNow && setShowConfirm(true)}
                disabled={!canBuyNow}
                className={cn(
                  "h-11 transition-all",
                  canBuyNow
                    ? "bg-[#fbbf24] text-black hover:bg-[#f59e0b]"
                    : "cursor-not-allowed bg-secondary text-muted-foreground"
                )}
              >
                {canBuyNow ? (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Buy Now
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Not Eligible
                  </>
                )}
              </Button>

              {!canBuyNow && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Buy Now is available only for eligible bidders
                </p>
              )}
            </div>
          </div>

          {/* ================= Confirm Modal (INLINE) ================= */}
          {showConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-background rounded-xl shadow-xl w-full max-w-md p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-yellow-500/10">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-yellow-500">Confirm Buy Now</h3>
                </div>

                <p className="text-sm text-muted-foreground">
                  You are about to instantly purchase this item for:
                </p>

                <p className="text-3xl font-bold text-center text-green-500">
                  {formatCurrency(buyNowPrice)}
                </p>

                <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                  ⚠️ This action will immediately end the auction and cannot be
                  undone.
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirm(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>

                  <Button
                    onClick={handleConfirmBuyNow}
                    disabled={loading}
                    className="bg-[#fbbf24] text-black hover:bg-[#f59e0b]"
                  >
                    {loading ? "Processing..." : "Confirm Purchase"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
