import { useState, type FormEvent } from "react";
import { Zap, Info, TrendingUp, Shield } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { toast } from "sonner";

interface AutoBidPanelProps {
  currentBid: number;
  minimumBid: number;
  userMaxBid?: number;
  isUserWinning?: boolean;
  onSetMaxBid?: (amount: number) => void;
}

export function AutoBidPanel({
  currentBid,
  minimumBid,
  userMaxBid,
  isUserWinning = false,
  onSetMaxBid,
}: AutoBidPanelProps) {
  const [maxBidAmount, setMaxBidAmount] = useState(userMaxBid?.toString() || "");
  const [showInfo, setShowInfo] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const amount = Number(maxBidAmount);

    if (!amount || amount < minimumBid) {
      toast.error(`Maximum bid must be at least $${minimumBid.toLocaleString()}`);
      return;
    }

    if (userMaxBid && amount <= userMaxBid) {
      toast.error(`New maximum bid must be higher than your current max ($${userMaxBid.toLocaleString()})`);
      return;
    }

    onSetMaxBid?.(amount);
    toast.success(`Auto-bidding activated with maximum of $${amount.toLocaleString()}`);
  };

  const handleQuickMax = (amount: number) => {
    setMaxBidAmount(amount.toString());
  };

  return (
    <div className="bg-gradient-to-br from-card to-secondary/20 border border-[#fbbf24]/20 rounded-xl p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#fbbf24]/10 rounded-lg">
            <Zap className="h-5 w-5 text-[#fbbf24]" />
          </div>
          <div>
            <h3 className="text-foreground flex items-center gap-2">
              Auto Bidding
              <Badge className="bg-[#10b981] text-white border-0 h-5">
                Smart
              </Badge>
            </h3>
            <p className="text-muted-foreground">Set your maximum bid</p>
          </div>
        </div>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="p-1 hover:bg-secondary/50 rounded-full transition-colors"
        >
          <Info className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Info Panel */}
      {showInfo && (
        <div className="bg-secondary/50 border border-border/50 rounded-lg p-4 space-y-2">
          <p className="text-foreground flex items-center gap-2">
            <Shield className="h-4 w-4 text-[#10b981]" />
            How Auto Bidding Works
          </p>
          <ul className="space-y-1 text-muted-foreground pl-6">
            <li>• Set your maximum bid amount</li>
            <li>• System bids incrementally on your behalf</li>
            <li>• Never exceeds your maximum amount</li>
            <li>• Automatically outbids competitors</li>
            <li>• You only pay the minimum needed to win</li>
          </ul>
        </div>
      )}

      {/* Current Status */}
      {userMaxBid && (
        <div className="bg-secondary/30 border border-border/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-muted-foreground">Your Maximum Bid</p>
            {isUserWinning && (
              <Badge className="bg-[#10b981] text-white border-0">
                <TrendingUp className="h-3 w-3 mr-1" />
                Winning
              </Badge>
            )}
          </div>
          <p className="text-[#fbbf24]">${userMaxBid.toLocaleString()}</p>
          <div className="mt-3 pt-3 border-t border-border/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Current Bid</span>
              <span className="text-foreground">${currentBid.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-muted-foreground">Remaining Budget</span>
              <span className="text-[#10b981]">
                ${(userMaxBid - currentBid).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      <Separator className="bg-border/50" />

      {/* Max Bid Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-foreground">
              {userMaxBid ? "Update Maximum Bid" : "Set Maximum Bid"}
            </p>
            <p className="text-muted-foreground">
              Min: ${minimumBid.toLocaleString()}
            </p>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              $
            </span>
            <Input
              type="number"
              value={maxBidAmount}
              onChange={(e) => setMaxBidAmount(e.target.value)}
              className="pl-8 bg-secondary/50 border-border/50 h-12"
              placeholder={minimumBid.toString()}
              required
            />
          </div>

          {/* Quick Max Bid Buttons */}
          <div className="grid grid-cols-4 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickMax(currentBid + 500)}
              className="border-border/50"
            >
              +$500
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickMax(currentBid + 1000)}
              className="border-border/50"
            >
              +$1K
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickMax(currentBid + 2500)}
              className="border-border/50"
            >
              +$2.5K
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickMax(currentBid + 5000)}
              className="border-border/50"
            >
              +$5K
            </Button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90 h-12"
        >
          <Zap className="h-4 w-4 mr-2" />
          {userMaxBid ? "Update" : "Activate"} Auto Bidding
        </Button>
      </form>

      {/* Benefits */}
      <div className="pt-4 space-y-2 text-center border-t border-border/50">
        <p className="text-muted-foreground flex items-center justify-center gap-2">
          <Shield className="h-4 w-4 text-[#10b981]" />
          Protected Bidding System
        </p>
        <p className="text-muted-foreground">
          ✓ Never pay more than needed
        </p>
      </div>
    </div>
  );
}
