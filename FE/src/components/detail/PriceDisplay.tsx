import { DollarSign, ShoppingCart, TrendingUp, Zap } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { formatCurrency } from "../../lib/utils";

interface PriceDisplayProps {
  currentPrice: number;
  buyNowPrice?: number | null;
  onBuyNow?: () => void;
}

export function PriceDisplay({
  currentPrice,
  buyNowPrice,
  onBuyNow,
}: PriceDisplayProps) {
  return (
    <div className="space-y-4">
      {/* Current Price */}
      <div className="bg-gradient-to-br from-card to-secondary/20 border border-[#10b981]/30 rounded-xl p-5 hover:border-[#10b981]/50 transition-all">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#10b981]/10 rounded-lg">
              <TrendingUp className="h-4 w-4 text-[#10b981]" />
            </div>
            <div>
              <p className="text-muted-foreground">Current Price</p>
              <p className="text-xs text-muted-foreground/70">
                Live auction price
              </p>
            </div>
          </div>
        </div>
        <div className="pl-10">
          <p className="text-3xl bg-gradient-to-r from-[#10b981] to-[#059669] bg-clip-text text-transparent">
            {formatCurrency(currentPrice)}
          </p>
        </div>
      </div>

      {/* Buy Now Price */}
      {buyNowPrice != null && (
        <div className="bg-gradient-to-br from-card to-secondary/20 border border-[#fbbf24]/30 rounded-xl p-5 hover:border-[#fbbf24]/50 transition-all">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#fbbf24]/10 rounded-lg">
                <ShoppingCart className="h-4 w-4 text-[#fbbf24]" />
              </div>
              <div>
                <p className="text-foreground">Buy Now Price</p>
                <p className="text-xs text-muted-foreground/70">
                  Skip bidding & buy instantly
                </p>
              </div>
            </div>
          </div>
          <div className="pl-10">
            <p className="text-3xl bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] bg-clip-text text-transparent">
              {formatCurrency(buyNowPrice)}
            </p>
          </div>
          <div className="mt-3 pl-10">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              Save{" "}
              {Math.round(((buyNowPrice - currentPrice) / buyNowPrice) * 100)}%
              by bidding
            </p>
          </div>
          {onBuyNow && (
            <div className="mt-4 pl-10">
              <Button
                onClick={onBuyNow}
                className="bg-[#fbbf24] text-black hover:bg-[#f59e0b] transition-all"
              >
                <Zap className="h-4 w-4 mr-2" />
                Buy Now
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
