import { useState } from "react";
import { CheckCircle2, PackageCheck, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface DeliveryConfirmationPanelProps {
  onConfirmDelivery?: (data: { note?: string }) => void;
  loading?: boolean;
}

export function DeliveryConfirmationPanel({
  onConfirmDelivery,
  loading = false,
}: DeliveryConfirmationPanelProps) {
  const [note, setNote] = useState("");

  const handleConfirm = () => {
    onConfirmDelivery?.({
      note: note.trim() || undefined,
    });
  };

  return (
    <div className="bg-card border border-green-500/20 rounded-2xl p-8 space-y-6 text-center shadow-sm">
      {/* Icon */}
      <div className="mx-auto h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
        <PackageCheck className="h-8 w-8 text-green-500" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-foreground">
        Confirm Item Received
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
        Please confirm that you have successfully received the item. This will
        complete the order and unlock the review step.
      </p>

      {/* Note box */}
      <div className="text-left space-y-2">
        <label className="text-sm text-muted-foreground flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Note to seller <span className="opacity-60">(optional)</span>
        </label>

        <Textarea
          placeholder="Leave a note about the delivery condition, packaging, or timing..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="min-h-[100px] resize-none bg-muted/40 focus:bg-background transition text-white"
        />
      </div>

      {/* Action */}
      <div className="pt-2 space-y-2">
        <Button
          disabled={loading}
          onClick={handleConfirm}
          className=" bg-gradient-to-r from-[#fbbf24] to-[#f59e0b]  text-black text-sm font-medium rounded-lg hover:opacity-90 transition cursor-pointer"
        >
          <CheckCircle2 className="h-8 w-8 mr-2" />
          {loading ? "Confirming..." : "I have received the item"}
        </Button>

        <p className="text-xs text-muted-foreground">
          Only confirm after you have fully received the package.
        </p>
      </div>
    </div>
  );
}
