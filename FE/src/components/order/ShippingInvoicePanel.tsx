import { Package, Truck, MapPin, Calendar, FileText, Download, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

interface ShippingInvoicePanelProps {
  shippingData?: {
    carrier: string;
    trackingNumber: string;
    shippedDate: Date;
    estimatedDelivery: Date;
    shippingAddress: string;
    invoiceNumber: string;
    shippingCost: number;
  };
  paymentVerified: boolean;
  onDownloadInvoice?: () => void;
}

export function ShippingInvoicePanel({ 
  shippingData, 
  paymentVerified,
  onDownloadInvoice 
}: ShippingInvoicePanelProps) {
  if (!paymentVerified) {
    return (
      <div className="bg-card border border-border/50 rounded-xl p-6">
        <div className="text-center py-8">
          <div className="h-16 w-16 rounded-full bg-[#f59e0b]/20 flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-[#f59e0b]" />
          </div>
          <h3 className="text-foreground mb-2">Awaiting Payment Verification</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            The seller is reviewing your payment submission. Shipping details will be available once payment is confirmed.
          </p>
        </div>
      </div>
    );
  }

  if (!shippingData) {
    return (
      <div className="bg-card border border-border/50 rounded-xl p-6">
        <div className="text-center py-8">
          <div className="h-16 w-16 rounded-full bg-[#3b82f6]/20 flex items-center justify-center mx-auto mb-4">
            <Truck className="h-8 w-8 text-[#3b82f6]" />
          </div>
          <h3 className="text-foreground mb-2">Preparing for Shipment</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Payment has been verified. The seller is preparing your item for shipment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-[#3b82f6]/10 to-[#8b5cf6]/10 border-b border-border/50">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center flex-shrink-0">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-foreground mb-1">Item Shipped</h3>
              <p className="text-muted-foreground">
                Your item has been dispatched and is on its way
              </p>
            </div>
          </div>
          <Badge className="bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        </div>
      </div>

      {/* Tracking Information */}
      <div className="p-6 space-y-6">
        <div>
          <h4 className="text-foreground mb-4">Tracking Information</h4>
          <div className="space-y-4">
            {/* Carrier */}
            <div className="flex items-start gap-3">
              <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-muted-foreground">Shipping Carrier</p>
                <p className="text-foreground">{shippingData.carrier}</p>
              </div>
            </div>

            {/* Tracking Number */}
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-muted-foreground">Tracking Number</p>
                <div className="flex items-center gap-2">
                  <code className="text-foreground bg-secondary/50 px-3 py-1 rounded">
                    {shippingData.trackingNumber}
                  </code>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(shippingData.trackingNumber);
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-muted-foreground">Delivery Address</p>
                <p className="text-foreground">{shippingData.shippingAddress}</p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Timeline */}
        <div>
          <h4 className="text-foreground mb-4">Delivery Timeline</h4>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-muted-foreground">Shipped Date</p>
                <p className="text-foreground">
                  {shippingData.shippedDate.toLocaleDateString()} at {shippingData.shippedDate.toLocaleTimeString()}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-[#fbbf24] mt-0.5" />
              <div className="flex-1">
                <p className="text-muted-foreground">Estimated Delivery</p>
                <p className="text-[#fbbf24]">
                  {shippingData.estimatedDelivery.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Invoice */}
        <div>
          <h4 className="text-foreground mb-4">Shipping Invoice</h4>
          <div className="bg-secondary/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-10 w-10 text-[#fbbf24]" />
                <div>
                  <p className="text-foreground">Invoice #{shippingData.invoiceNumber}</p>
                  <p className="text-muted-foreground">
                    Shipping Cost: ${shippingData.shippingCost.toFixed(2)}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onDownloadInvoice}
                className="border-border/50"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>

        {/* Track Package Button */}
        <Button 
          className="w-full bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white hover:opacity-90"
          onClick={() => {
            window.open(`https://www.trackingmore.com/track/${shippingData.trackingNumber}`, '_blank');
          }}
        >
          <Truck className="h-4 w-4 mr-2" />
          Track Package
        </Button>
      </div>
    </div>
  );
}
