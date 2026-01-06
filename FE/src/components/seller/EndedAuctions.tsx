import { useEffect, useState } from "react";
import {
  Eye,
  ThumbsUp,
  ThumbsDown,
  Star,
  AlertTriangle,
  Trophy,
  User,
} from "lucide-react";
import { AuctionStatusBadge } from "./AuctionStatusBadge";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ImageWithFallback } from "../check/ImageWithFallback";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { GET_ENDED_LISTINGS_API } from "../utils/api";
import { LoadingSpinner } from "../state";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { formatCurrency } from "../../lib/utils";

/* ===============================
 * Backend type
 * =============================== */
interface SellerEndedAuction {
  id: string; // orderId (QUAN TRỌNG)
  productId: string;
  title: string;
  image: string | null;
  finalPrice: number;
  endTime: string;

  status?: "expired";
  buyerName: string | null;
  orderStatus:
    | "payment_pending"
    | "shipping_pending"
    | "delivered_pending"
    | "completed"
    | "cancelled";

  category: string;
}

type OrderStatus =
  | "payment_pending"
  | "shipping_pending"
  | "delivered_pending"
  | "completed"
  | "cancelled";

function getStepBadge(auction: SellerEndedAuction) {
  // ❌ Auction expired – không có buyer
  if (auction.status === "expired") {
    return (
      <Badge className="bg-red-500/20 text-red-500">Expired · No Winner</Badge>
    );
  }

  // ❌ Order cancelled
  if (auction.orderStatus === "cancelled") {
    return <Badge className="bg-red-500/20 text-red-500">Cancelled</Badge>;
  }

  switch (auction.orderStatus) {
    case "payment_pending":
      return (
        <Badge className="bg-yellow-500/20 text-yellow-500">
          Step 1 · Waiting Payment
        </Badge>
      );

    case "shipping_pending":
      return (
        <Badge className="bg-yellow-500/20 text-yellow-500">
          Step 2 · Prepare Shipment
        </Badge>
      );

    case "delivered_pending":
      return (
        <Badge className="bg-yellow-500/20 text-yellow-500">
          Step 3 · Await Buyer
        </Badge>
      );

    case "completed":
      return (
        <Badge className="bg-green-500/20 text-green-500">
          Step 4 · Completed
        </Badge>
      );

    default:
      return null;
  }
}

function getActionButton(
  auction: SellerEndedAuction,
  navigate: ReturnType<typeof useNavigate>
) {
  // ❌ expired → chỉ xem auction
  if (auction.status === "expired") {
    return (
      <Button
        size="sm"
        onClick={() => navigate(`/product/${auction.productId}`)}
      >
        View Auction
      </Button>
    );
  }

  const handleClick = () => {
    navigate(`/order/${auction.id}`);
  };

  if (auction.orderStatus === "completed") {
    return (
      <Button size="sm" onClick={handleClick}>
        View Order
      </Button>
    );
  }

  if (auction.orderStatus === "cancelled") {
    return (
      <Button size="sm" onClick={handleClick}>
        View Details
      </Button>
    );
  }

  return (
    <Button size="sm" onClick={handleClick}>
      Continue Order
    </Button>
  );
}

interface EndedAuctionsProps {
  onCountChange: (count: number) => void;
}

/* ===============================
 * Component
 * =============================== */
export function EndedAuctions({ onCountChange }: EndedAuctionsProps) {
  const navigate = useNavigate();
  const [items, setItems] = useState<SellerEndedAuction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchWithAuth(GET_ENDED_LISTINGS_API);
        const json = await res.json();
        console.log(json);

        setItems(json.data);
        onCountChange?.(json.data.length);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-yellow-500 mb-2">Ended Auctions</h1>
        <p className="text-muted-foreground">
          Auctions that have finished and moved to order processing
        </p>
      </div>

      <div className="space-y-4">
        {items.map((auction) => (
          <div
            key={auction.id}
            className="bg-card border border-border/50 rounded-xl overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row gap-4 p-4">
              {/* Image */}
              <div className="w-full sm:w-32 h-32 rounded-lg overflow-hidden">
                <ImageWithFallback
                  src={auction.image ?? ""}
                  alt={auction.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <Badge variant="outline">{auction.category}</Badge>
                    {getStepBadge(auction)}
                  </div>

                  <h3 className="text-foreground line-clamp-1 text-lg">
                    {auction.title}
                  </h3>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-muted-foreground">Final Price</p>
                      <p className="text-[#fbbf24]">
                        {formatCurrency(auction.finalPrice)}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Buyer</p>
                      <p className="text-foreground">
                        {auction.buyerName ?? "—"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-border/50">
                  <p className="text-muted-foreground text-sm">
                    Ended {new Date(auction.endTime).toLocaleDateString()}
                  </p>

                  {getActionButton(auction, navigate)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
