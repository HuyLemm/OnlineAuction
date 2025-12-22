import { useEffect, useState } from "react";
import { Clock, Gavel, Crown } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { GET_ACTIVE_BIDS_API } from "../utils/api";
import { ImageWithFallback } from "../check/ImageWithFallback";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../state";

interface MyBidItem {
  product: {
    id: string;
    title: string;
    category: string;
    sellerName: string;
    image: string;
    status: string;
    isClosed: boolean;
    currentPrice: number;
    endTime: string;
    highestBidder?: {
      id: string;
      name: string;
    };
  };
  myBids: {
    id: string;
    amount: number;
    time: string | null;
  }[];
}

export function MyBidsSection() {
  const [items, setItems] = useState<MyBidItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWithAuth(GET_ACTIVE_BIDS_API)
      .then((r) => r.json())
      .then((j) => setItems(j.data ?? []))
      .finally(() => setLoading(false));
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
      {/* Header */}
      <div>
        <h1 className="text-foreground mb-1">My Bids</h1>
        <p className="text-muted-foreground">
          Auctions you are participating in
        </p>
      </div>

      {items.map((item) => (
        <div
          key={item.product.id}
          className="bg-card border border-border/50 rounded-xl p-6 grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* ================= LEFT COLUMN ================= */}
          <div className="flex gap-4">
            <div className="w-40 h-40 rounded-lg overflow-hidden flex-shrink-0">
              <ImageWithFallback
                src={item.product.image}
                alt={item.product.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-between flex-1">
              <div className="space-y-2">
                <Badge variant="outline">{item.product.category}</Badge>

                <h3 className="text-foreground text-lg">
                  {item.product.title}
                </h3>

                <p className="text-muted-foreground text-sm">
                  Seller: {item.product.sellerName}
                </p>

                {item.product.highestBidder && (
                  <p className="text-sm flex items-center gap-1 text-[#fbbf24]">
                    <Crown className="h-4 w-4" />
                    Highest bidder: {item.product.highestBidder.name}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between mt-4">
                <div>
                  <p className="text-muted-foreground text-sm">Current</p>
                  <p className="text-[#fbbf24] text-lg font-semibold">
                    ${item.product.currentPrice.toLocaleString()}
                  </p>
                </div>

                <div className="text-muted-foreground text-sm flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {new Date(item.product.endTime).toLocaleDateString()}
                </div>

                <Button
                  size="sm"
                  className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black"
                  onClick={() => {
                    navigate(`/product/${item.product.id}`);
                  }}
                >
                  View Auction
                </Button>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN ================= */}
          <div className="border-l border-yellow-500/30 pl-6 space-y-3">
            <p className="text-foreground font-medium flex items-center gap-2">
              <Gavel className="h-4 w-4 text-[#fbbf24]" />
              Your Bids
            </p>

            {[...item.myBids]
              .sort((a, b) => b.amount - a.amount)
              .map((bid) => {
                const isCurrent = bid.amount === item.product.currentPrice;

                return (
                  <div
                    key={bid.id}
                    className={`flex items-center justify-between px-4 py-2 rounded-lg ${
                      isCurrent
                        ? "bg-[#fbbf24]/10 border border-[#fbbf24]/40"
                        : "opacity-60"
                    }`}
                  >
                    <div
                      className={`${
                        isCurrent
                          ? "text-[#fbbf24] font-semibold"
                          : "line-through text-muted-foreground"
                      }`}
                    >
                      ${bid.amount.toLocaleString()}
                    </div>

                    <div className="text-muted-foreground text-sm">
                      {bid.time ? new Date(bid.time).toLocaleString() : "—"}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ))}

      {items.length === 0 && (
        <div className="text-center text-muted-foreground py-12">
          You have not placed any bids yet
        </div>
      )}
    </div>
  );
}
