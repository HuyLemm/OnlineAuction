import { useState, type FormEvent, useMemo, useEffect } from "react";
import { Zap, Info, TrendingUp, Shield } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { toast } from "sonner";
import { formatCurrency } from "../../lib/utils";
import { LoadingSpinner } from "../state";

function parseCurrencyInput(value: string): number | null {
  const cleaned = value.replace(/[^\d]/g, "");
  if (!cleaned) return null;
  return Number(cleaned);
}

function formatCurrencyInput(value: number | null): string {
  if (value === null) return "";
  return formatCurrency(value);
}

interface AutoBidPanelProps {
  currentBid: number;
  bidStep: number;
  userMaxBid?: number;
  isUserWinning?: boolean;
  onSetMaxBid?: (amount: number) => Promise<void>; // 🔧 async
  loading?: boolean; // 🔧 loading flag
}

export function AutoBidPanel({
  currentBid,
  bidStep,
  userMaxBid,
  isUserWinning = false,
  loading = false,
  onSetMaxBid,
}: AutoBidPanelProps) {
  const bidStepNum = Number(bidStep) || 0;
  const [showConfirm, setShowConfirm] = useState(false);

  const minimumBid = useMemo(
    () => Math.max(0, Number(currentBid) + bidStepNum),
    [currentBid, bidStepNum]
  );

  const [maxBidText, setMaxBidText] = useState<string>(
    userMaxBid ? formatCurrencyInput(userMaxBid) : ""
  );
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (userMaxBid !== undefined && userMaxBid !== null) {
      setMaxBidText(formatCurrencyInput(userMaxBid));
    }
  }, [userMaxBid]);

  const maxBidValue =
    useMemo(() => parseCurrencyInput(maxBidText), [maxBidText]) || 0;

  const isValid =
    maxBidText.trim() !== "" &&
    Number.isFinite(maxBidValue) &&
    maxBidValue >= minimumBid &&
    (!userMaxBid || maxBidValue > userMaxBid);

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!Number.isFinite(maxBidValue)) {
      toast.error("Please enter a valid number");
      return;
    }

    if (maxBidValue < minimumBid) {
      toast.error(`Maximum bid must be at least ${formatCurrency(minimumBid)}`);
      return;
    }

    if (userMaxBid && maxBidValue <= userMaxBid) {
      toast.error(
        `New maximum bid must be higher than ${formatCurrency(userMaxBid)}`
      );
      return;
    }

    // 🔥 mở modal thay vì submit
    setShowConfirm(true);
  };

  const handleConfirmBid = async () => {
    setShowConfirm(false);
    await onSetMaxBid?.(maxBidValue);
  };

  const handleQuickMax = (amount: number) => {
    if (!loading) {
      setMaxBidText(formatCurrencyInput(amount));
    }
  };

  const handleChange = (raw: string) => {
    if (loading) return;

    const n = parseCurrencyInput(raw);
    if (!raw || raw.trim() === "") {
      setMaxBidText("");
      return;
    }

    if (!Number.isFinite(n)) {
      setMaxBidText("");
      return;
    }

    setMaxBidText(formatCurrencyInput(n));
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
            <p className="text-muted-foreground">
              System bids automatically up to your max
            </p>
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
            <li>• You set a maximum bid</li>
            <li>• System bids automatically for you</li>
            <li>• Always respects the bid step</li>
            <li>• Never exceeds your maximum</li>
            <li>• You pay only what’s needed to win</li>
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
          <p className="text-[#fbbf24]">{formatCurrency(userMaxBid)}</p>
          <div className="mt-3 pt-3 border-t border-border/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Current Bid</span>
              <span className="text-foreground">
                {formatCurrency(currentBid)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-muted-foreground">Next Minimum Bid</span>
              <span className="text-foreground">
                {formatCurrency(minimumBid)}
              </span>
            </div>
          </div>
        </div>
      )}

      <Separator className="bg-border/50" />

      {/* Max Bid Input */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-foreground">
              {userMaxBid ? "Update Maximum Bid" : "Set Maximum Bid"}
            </p>
            <p className="text-muted-foreground">
              Min: {formatCurrency(currentBid)}
            </p>
            <p className="text-muted-foreground">
              Bid step: {formatCurrency(bidStepNum)}
            </p>
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"></span>
            <Input
              type="text"
              inputMode="numeric"
              value={maxBidText}
              onChange={(e) => handleChange(e.target.value)}
              disabled={loading}
              className="pl-8 bg-secondary/50 border-border/50 h-12"
              placeholder={formatCurrency(currentBid)}
              required
            />
          </div>

          {/* Quick buttons */}
          <div className="grid grid-cols-4 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickMax(currentBid + bidStepNum)}
              className="border-border/50"
            >
              +{formatCurrency(bidStepNum)}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickMax(currentBid + bidStepNum * 2)}
              className="border-border/50"
            >
              +{formatCurrency(bidStepNum * 2)}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickMax(currentBid + bidStepNum * 5)}
              className="border-border/50"
            >
              +{formatCurrency(bidStepNum * 5)}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickMax(currentBid + bidStepNum * 10)}
              className="border-border/50"
            >
              +{formatCurrency(bidStepNum * 10)}
            </Button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={!isValid || loading}
          className="w-full bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90 h-12"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <LoadingSpinner size="sm" />
              <span>Placing bid...</span>
            </div>
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              {userMaxBid ? "Update" : "Activate"} Auto Bidding
            </>
          )}
        </Button>
      </form>

      {/* Footer */}
      <div className="pt-4 space-y-2 text-center border-t border-border/50">
        <p className="text-muted-foreground flex items-center justify-center gap-2">
          <Shield className="h-4 w-4 text-[#10b981]" />
          Secure automated bidding
        </p>
        <p className="text-muted-foreground">
          ✓ Always respects bid increments
        </p>
      </div>
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-card rounded-xl w-full max-w-md p-6 space-y-5 border border-border">
            <h3 className="text-xl font-semibold text-foreground">
              Confirm Auto Bidding
            </h3>

            <p className="text-muted-foreground">
              You are about to set your <strong>maximum bid</strong> to:
            </p>

            <div className="text-center text-3xl font-bold text-[#fbbf24]">
              {formatCurrency(maxBidValue)}
            </div>

            <div className="bg-secondary/40 rounded-lg p-4 text-sm text-muted-foreground space-y-1">
              <p>• System will bid automatically for you</p>
              <p>• Will never exceed this amount</p>
              <p>• You may still be outbid by others</p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </Button>

              <Button
                className="flex-1 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black"
                onClick={handleConfirmBid}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
