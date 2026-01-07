import { useState } from "react";
import {
  Package,
  Truck,
  MapPin,
  Calendar,
  FileText,
  CheckCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { LoadingSpinner } from "../state";

/* ===============================
 * Types (match DB schema)
 * =============================== */
export interface ShippingData {
  shipping_code: string;
  shipping_provider?: string;
  shipped_at?: string;
  note?: string;
}

interface ShippingInvoicePanelProps {
  mode: "buyer" | "seller";
  shippingData?: ShippingData;
  shippingAddress?: string; // từ order/buyer
  onSubmitShipping?: (data: ShippingData) => void;
  loading?: boolean;
}

/* ===============================
 * Component
 * =============================== */
export function ShippingInvoicePanel({
  mode,
  shippingData,
  shippingAddress,
  onSubmitShipping,
  loading,
}: ShippingInvoicePanelProps) {
  /* ===============================
   * FE generate shipping_code
   * =============================== */
  const [shippingCode] = useState(
    () => shippingData?.shipping_code ?? crypto.randomUUID()
  );

  const [provider, setProvider] = useState(
    shippingData?.shipping_provider ?? ""
  );
  const [note, setNote] = useState(shippingData?.note ?? "");

  /* ===============================
   * BUYER – chưa ship
   * =============================== */
  if (mode === "buyer" && !shippingData) {
    return (
      <div className="bg-card border border-border/50 rounded-xl p-6">
        <div className="text-center py-8">
          <div className="h-16 w-16 rounded-full bg-[#f59e0b]/20 flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-[#f59e0b]" />
          </div>
          <h3 className="text-foreground mb-2">Seller is preparing shipment</h3>
          <p className="text-muted-foreground">
            Shipping information will appear once the seller submits it.
          </p>
        </div>
      </div>
    );
  }

  /* ===============================
   * SHIPPED INFO (for both)
   * =============================== */
  const ShippingInfoView = () =>
    shippingData ? (
      <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-[#3b82f6]/10 to-[#8b5cf6]/10 border-b border-border/50">
          <div className="flex justify-between">
            <div className="flex gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-foreground mb-1">Item Shipped</h3>
                <p className="text-muted-foreground">
                  The item has been dispatched
                </p>
              </div>
            </div>
            <Badge className="bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30">
              <CheckCircle className="h-3 w-3 mr-1" />
              Shipped
            </Badge>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h4 className="text-foreground mb-4">Shipping Information</h4>
            <div className="space-y-3">
              <div className="flex gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Shipping Code</p>
                  <code className="bg-secondary/50 px-3 py-1 rounded">
                    {shippingData.shipping_code}
                  </code>
                </div>
              </div>

              {shippingData.shipping_provider && (
                <div className="flex gap-3">
                  <Truck className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Provider</p>
                    <p className="text-foreground">
                      {shippingData.shipping_provider}
                    </p>
                  </div>
                </div>
              )}

              {shippingAddress && (
                <div className="flex gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Delivery Address</p>
                    <p className="text-foreground">{shippingAddress}</p>
                  </div>
                </div>
              )}

              {shippingData.shipped_at && (
                <div className="flex gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <p>
                    Shipped at{" "}
                    <strong>
                      {new Date(shippingData.shipped_at).toLocaleString()}
                    </strong>
                  </p>
                </div>
              )}

              {shippingData.note && (
                <div className="flex gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <p className="italic text-muted-foreground">
                    {shippingData.note}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    ) : null;

  /* ===============================
   * SELLER VIEW
   * =============================== */
  if (mode === "seller") {
    return (
      <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#3b82f6]/10 to-[#8b5cf6]/10 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-foreground font-semibold">
                Submit Shipping Information
              </h3>
              <p className="text-sm text-muted-foreground">
                Provide tracking details so the buyer can follow the shipment
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Shipping code (read-only) */}
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">
              Shipping Code (auto generated)
            </label>
            <div className="flex items-center gap-3 bg-secondary/50 rounded-md px-3 py-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <code className="text-sm text-foreground break-all">
                {shippingCode}
              </code>
            </div>
          </div>

          {/* Provider */}
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">
              Shipping Provider <span className="opacity-70">(optional)</span>
            </label>
            <Input
              placeholder="e.g. GrabExpress, J&T Express, Ahamove"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="text-white"
            />
          </div>

          {/* Note */}
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">
              Note to Buyer <span className="opacity-70">(optional)</span>
            </label>
            <Textarea
              placeholder="Any message for the buyer (delivery time, handling note, etc.)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="text-white"
            />
          </div>

          <Separator />

          {/* Action */}
          <div className="flex justify-end">
            <Button
              disabled={loading}
              className="bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white px-6"
              onClick={() =>
                onSubmitShipping?.({
                  shipping_code: shippingCode,
                  shipping_provider: provider || undefined,
                  note: note || undefined,
                })
              }
            >
              {loading ? (
                <>
                  <LoadingSpinner className="h-4 w-4 mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Truck className="h-4 w-4 mr-2" />
                  Submit Shipping Info
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ===============================
   * BUYER – shipped
   * =============================== */
  return <ShippingInfoView />;
}
