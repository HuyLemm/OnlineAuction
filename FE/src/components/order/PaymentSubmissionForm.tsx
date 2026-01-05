import { useState } from "react";
import { CreditCard } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { LoadingSpinner } from "../state";

/* ===============================
 * Types
 * =============================== */

interface PaymentSubmissionFormProps {
  onSubmit: (data: PaymentData) => Promise<void>;
  loading?: boolean;
}

interface PaymentData {
  invoiceCode: string;
  shippingAddress: string;
  phoneNumber: string;
  description?: string;
}

/* ===============================
 * Helpers
 * =============================== */

function generateInvoiceCode() {
  return crypto.randomUUID();
}

/* ===============================
 * Component
 * =============================== */

export function PaymentSubmissionForm({
  onSubmit,
  loading,
}: PaymentSubmissionFormProps) {
  const [invoiceCode, setInvoiceCode] = useState(generateInvoiceCode());
  const [shippingAddress, setShippingAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!shippingAddress.trim() || !phoneNumber.trim()) {
      toast.error("Please provide shipping address and phone number");
      return;
    }

    await onSubmit({
      invoiceCode,
      shippingAddress,
      phoneNumber,
      description: description || undefined,
    });
  };

  return (
    <div className="bg-card border border-border/50 rounded-xl p-6">
      <div className="mb-6">
        <h3 className="text-foreground mb-2">Order Information</h3>
        <p className="text-muted-foreground">
          Provide delivery details to proceed with the order
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Invoice Code */}
        <div className="space-y-2">
          <Label className="text-yellow-500">Invoice Code</Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={invoiceCode} disabled className="pl-10" />
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label className="text-yellow-500">Shipping Address *</Label>
          <Textarea
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label className="text-yellow-500">Phone Number *</Label>
          <Input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label className="text-yellow-500">Additional Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[120px]"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <LoadingSpinner className="h-4 w-4" />
              Submitting...
            </div>
          ) : (
            "Confirm & Continue"
          )}
        </Button>
      </form>
    </div>
  );
}
