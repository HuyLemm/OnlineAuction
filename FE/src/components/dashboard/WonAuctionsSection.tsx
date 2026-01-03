import { useEffect, useState } from "react";
import { Trophy, Package, Star } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ImageWithFallback } from "../check/ImageWithFallback";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { LoadingSpinner } from "../state";
import { GET_WON_AUCTIONS_API } from "../utils/api";
import { useNavigate } from "react-router-dom";

function getPaymentTimeLeft(deadline?: string | null) {
  if (!deadline) return null;

  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return "Expired";

  const hours = Math.floor(diff / 36e5);
  const minutes = Math.floor((diff % 36e5) / 6e4);

  return `${hours}h ${minutes}m`;
}

interface ApiWonAuction {
  id: string;
  itemId: string;
  title: string;
  image: string;
  winningBid: number;
  wonDate: string;
  category: string;
  orderStatus: "pending_payment" | "paid" | "cancelled" | "expired";
  sellerName: string;
  paymentDeadline: string | null;
}

type OrderStatusUI =
  | "pending_payment"
  | "paid completed"
  | "cancelled"
  | "expired";

interface WonAuction {
  id: string;
  itemId: string;
  title: string;
  image: string;
  winningBid: number;
  wonDate: Date;
  category: string;
  orderStatus: OrderStatusUI;
  sellerName: string;
  paymentDeadline: string | null;
}

function mapOrderStatus(status: ApiWonAuction["orderStatus"]): OrderStatusUI {
  switch (status) {
    case "pending_payment":
      return "pending_payment";
    case "paid":
      return "paid completed";
    case "cancelled":
      return "cancelled";
    case "expired":
      return "expired";
  }
}

export function WonAuctionsSection() {
  const [wonAuctions, setWonAuctions] = useState<WonAuction[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchWithAuth(GET_WON_AUCTIONS_API);
        const { data } = await res.json();

        setWonAuctions(
          data.map((a: ApiWonAuction) => ({
            ...a,
            wonDate: new Date(a.wonDate),
            orderStatus: mapOrderStatus(a.orderStatus),
          }))
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center">
        {" "}
        <LoadingSpinner />
      </div>
    );
  }

  const getStatusBadge = (auction: WonAuction) => {
    switch (auction.orderStatus) {
      case "pending_payment":
        return (
          <Badge className="bg-[#d4a446]/20 text-yellow-500">
            Payment Required
          </Badge>
        );

      case "paid completed":
        return (
          <Badge className="bg-blue-500/20 text-blue-500">Paid Completed</Badge>
        );

      case "expired":
        return (
          <Badge className="bg-red-500/20 text-red-500">Payment Expired</Badge>
        );

      case "cancelled":
        return (
          <Badge className="bg-gray-500/20 text-gray-500">Cancelled</Badge>
        );
    }
  };

  const getActionButton = (auction: WonAuction) => {
    const handleClick = () => {
      navigate(`/order/${auction.id}`);
    };
    if (auction.orderStatus === "pending_payment") {
      return (
        <Button
          size="sm"
          className="bg-[#d4a446] text-black text-sm"
          onClick={handleClick}
        >
          Pay Now
        </Button>
      );
    }

    if (auction.orderStatus === "paid completed") {
      return (
        <Button variant="outline" size="sm" onClick={handleClick}>
          View Order
        </Button>
      );
    }

    return (
      <Button variant="ghost" size="sm" onClick={handleClick}>
        View Details
      </Button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-foreground mb-2">Won Auctions</h1>
        <p className="text-muted-foreground">
          Manage your winning bids and complete orders
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border/50 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#fbbf24]/20 to-[#f59e0b]/20 flex items-center justify-center">
              <Trophy className="h-6 w-6 text-[#fbbf24]" />
            </div>
            <div>
              <p className="text-muted-foreground">Total Won</p>
              <p className="text-foreground">{wonAuctions.length} Items</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#3b82f6]/20 to-[#3b82f6]/10 flex items-center justify-center">
              <Package className="h-6 w-6 text-[#3b82f6]" />
            </div>
            <div>
              <p className="text-muted-foreground">In Progress</p>
              <p className="text-foreground">
                {
                  wonAuctions.filter((a) => a.orderStatus !== "paid completed")
                    .length
                }{" "}
                Orders
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#10b981]/20 to-[#10b981]/10 flex items-center justify-center">
              <Star className="h-6 w-6 text-[#10b981]" />
            </div>
            <div>
              <p className="text-muted-foreground">Completed</p>
              <p className="text-foreground">
                {
                  wonAuctions.filter((a) => a.orderStatus === "paid completed")
                    .length
                }{" "}
                Orders
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Won Auctions List */}
      <div className="space-y-4">
        {wonAuctions.map((auction) => (
          <div
            key={auction.id}
            className="bg-card border border-border/50 rounded-xl overflow-hidden hover:border-border transition-all"
          >
            <div className="flex flex-col sm:flex-row gap-4 p-4">
              {/* Image */}
              <div className="relative w-full sm:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                <ImageWithFallback
                  src={auction.image}
                  alt={auction.title}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <Badge
                      variant="outline"
                      className="border-border/50 text-muted-foreground"
                    >
                      {auction.category}
                    </Badge>
                    {getStatusBadge(auction)}
                  </div>
                  <h3 className="text-foreground line-clamp-1">
                    {auction.title}
                  </h3>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-muted-foreground">Winning Bid</p>
                      <p className="text-[#fbbf24]">
                        ${auction.winningBid.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Seller</p>
                      <p className="text-foreground">{auction.sellerName}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-4 border-t border-border/50">
                  <p className="text-muted-foreground">
                    Won {new Date(auction.wonDate).toLocaleDateString()}
                  </p>
                  {auction.orderStatus === "pending_payment" && (
                    <p className="text-sm text-muted-foreground ml-42">
                      Time for payment:{" "}
                      <span className="text-yellow-500">
                        {getPaymentTimeLeft(auction.paymentDeadline)}
                      </span>
                    </p>
                  )}

                  {getActionButton(auction)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
