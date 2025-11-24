import { Package, User, Calendar, DollarSign, MapPin, Phone, Mail } from "lucide-react";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../check/ImageWithFallback";
import { Separator } from "../ui/separator";

type OrderStatus = "payment-pending" | "payment-submitted" | "shipping-pending" | "in-transit" | "delivered" | "completed";

interface OrderStatusPanelProps {
  orderId: string;
  status: OrderStatus;
  item: {
    title: string;
    image: string;
    category: string;
    winningBid: number;
  };
  buyer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  seller: {
    name: string;
    email: string;
    phone: string;
  };
  wonDate: Date;
}

export function OrderStatusPanel({ orderId, status, item, buyer, seller, wonDate }: OrderStatusPanelProps) {
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "payment-pending":
        return (
          <Badge className="bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/30">
            Payment Pending
          </Badge>
        );
      case "payment-submitted":
        return (
          <Badge className="bg-[#f59e0b]/20 text-[#f59e0b] border-[#f59e0b]/30">
            Payment Under Review
          </Badge>
        );
      case "shipping-pending":
        return (
          <Badge className="bg-[#3b82f6]/20 text-[#3b82f6] border-[#3b82f6]/30">
            Preparing Shipment
          </Badge>
        );
      case "in-transit":
        return (
          <Badge className="bg-[#8b5cf6]/20 text-[#8b5cf6] border-[#8b5cf6]/30">
            In Transit
          </Badge>
        );
      case "delivered":
        return (
          <Badge className="bg-[#fbbf24]/20 text-[#fbbf24] border-[#fbbf24]/30">
            Delivered
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30">
            Completed
          </Badge>
        );
    }
  };

  return (
    <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-muted-foreground">Order ID</p>
            <p className="text-foreground">{orderId}</p>
          </div>
          {getStatusBadge(status)}
        </div>
      </div>

      {/* Item Details */}
      <div className="p-6 border-b border-border/50">
        <h4 className="text-foreground mb-4">Item Details</h4>
        <div className="flex gap-4">
          <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
            <ImageWithFallback
              src={item.image}
              alt={item.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <Badge variant="outline" className="border-border/50 text-muted-foreground mb-2">
              {item.category}
            </Badge>
            <h4 className="text-foreground mb-2 line-clamp-2">{item.title}</h4>
            <p className="text-[#fbbf24]">${item.winningBid.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Transaction Info */}
      <div className="p-6 space-y-4">
        <h4 className="text-foreground mb-4">Transaction Information</h4>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-muted-foreground">Won Date</p>
              <p className="text-foreground">{wonDate.toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-muted-foreground">Total Amount</p>
              <p className="text-foreground">${item.winningBid.toLocaleString()}</p>
            </div>
          </div>

          <Separator />

          {/* Seller Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <p className="text-muted-foreground">Seller Information</p>
            </div>
            <div className="ml-7 space-y-1">
              <p className="text-foreground">{seller.name}</p>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <p>{seller.email}</p>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <p>{seller.phone}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Buyer Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-muted-foreground" />
              <p className="text-muted-foreground">Delivery Information</p>
            </div>
            <div className="ml-7 space-y-1">
              <p className="text-foreground">{buyer.name}</p>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <p>{buyer.phone}</p>
              </div>
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5" />
                <p className="flex-1">{buyer.address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
