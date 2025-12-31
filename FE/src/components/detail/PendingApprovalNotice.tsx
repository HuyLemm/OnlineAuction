import { Clock, MailCheck } from "lucide-react";
import { cn } from "../ui/utils";

export function PendingApprovalNotice() {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 space-y-5",
        "bg-gradient-to-br from-card via-card to-secondary/20",
        "border border-blue-500/30"
      )}
    >
      {/* Glow */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 opacity-40",
          "bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.18),transparent_60%)]"
        )}
      />

      {/* Header */}
      <div className="flex items-start gap-4 relative">
        <div className="p-3 rounded-xl bg-blue-500/15">
          <Clock className="h-6 w-6 text-blue-400" />
        </div>

        <div>
          <h3 className="text-foreground text-lg">Approval Pending</h3>
          <p className="text-muted-foreground text-sm">
            Seller approval is required before bidding
          </p>
        </div>
      </div>

      {/* Status box */}
      <div className="rounded-xl p-4 bg-secondary/30 border border-blue-500/30 space-y-1">
        <p className="flex items-center gap-2 text-foreground">
          <MailCheck className="h-4 w-4 text-blue-400" />
          Request sent successfully
        </p>

        <p className="text-sm text-muted-foreground">
          You will be able to place bids once the seller approves your request.
        </p>
      </div>

      {/* Footer hint */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Clock className="h-3.5 w-3.5 text-blue-400" />
        <span>
          Approval usually takes a short time. Please check back later.
        </span>
      </div>
    </div>
  );
}
