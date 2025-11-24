import { Trophy, Package, Star } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ImageWithFallback } from "../check/ImageWithFallback";

interface WonAuction {
  id: string;
  itemId: string;
  title: string;
  image: string;
  winningBid: number;
  wonDate: Date;
  category: string;
  orderStatus: "payment-pending" | "shipping-pending" | "delivery-pending" | "completed";
  sellerName: string;
}

interface WonAuctionsSectionProps {
  onNavigateToOrder?: (orderId: string) => void;
}

export function WonAuctionsSection({ onNavigateToOrder }: WonAuctionsSectionProps) {
  const wonAuctions: WonAuction[] = [
    {
      id: "order-1",
      itemId: "item1",
      title: "Patek Philippe Nautilus 5711/1A Steel Blue Dial",
      image: "https://images.unsplash.com/photo-1670177257750-9b47927f68eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaHxlbnwxfHx8fDE3NjMzOTExMzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      winningBid: 156000,
      wonDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      category: "Watches",
      orderStatus: "payment-pending",
      sellerName: "LuxuryTimepieces"
    },
    {
      id: "order-2",
      itemId: "item2",
      title: "Hermès Birkin 35 Crocodile Limited Edition",
      image: "https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBoYW5kYmFnfGVufDF8fHx8MTc2MzMwNTk3N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      winningBid: 52000,
      wonDate: new Date(Date.now() - 1000 * 60 * 60 * 48),
      category: "Fashion",
      orderStatus: "shipping-pending",
      sellerName: "PremiumFashion"
    },
    {
      id: "order-3",
      itemId: "item3",
      title: "Rolex Daytona 116500LN White Dial - 2023",
      image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjB3YXRjaHxlbnwxfHx8fDE3NjMzOTExMzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      winningBid: 42000,
      wonDate: new Date(Date.now() - 1000 * 60 * 60 * 120),
      category: "Watches",
      orderStatus: "completed",
      sellerName: "WatchMaster"
    }
  ];

  const getStatusBadge = (status: WonAuction["orderStatus"]) => {
    switch (status) {
      case "payment-pending":
        return (
          <Badge className="bg-[#f59e0b]/20 text-[#f59e0b] border-[#f59e0b]/30">
            Payment Required
          </Badge>
        );
      case "shipping-pending":
        return (
          <Badge className="bg-[#3b82f6]/20 text-[#3b82f6] border-[#3b82f6]/30">
            Awaiting Shipment
          </Badge>
        );
      case "delivery-pending":
        return (
          <Badge className="bg-[#8b5cf6]/20 text-[#8b5cf6] border-[#8b5cf6]/30">
            In Transit
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

  const getActionButton = (auction: WonAuction) => {
    const handleClick = () => {
      if (onNavigateToOrder) {
        onNavigateToOrder(auction.id);
      }
    };

    switch (auction.orderStatus) {
      case "payment-pending":
        return (
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90"
            onClick={handleClick}
          >
            Submit Payment
          </Button>
        );
      case "shipping-pending":
      case "delivery-pending":
        return (
          <Button 
            variant="outline" 
            size="sm" 
            className="border-border/50"
            onClick={handleClick}
          >
            View Order
          </Button>
        );
      case "completed":
        return (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleClick}
          >
            View Details
          </Button>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-foreground mb-2">Won Auctions</h1>
        <p className="text-muted-foreground">Manage your winning bids and complete orders</p>
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
                {wonAuctions.filter(a => a.orderStatus !== "completed").length} Orders
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
                {wonAuctions.filter(a => a.orderStatus === "completed").length} Orders
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
                    <Badge variant="outline" className="border-border/50 text-muted-foreground">
                      {auction.category}
                    </Badge>
                    {getStatusBadge(auction.orderStatus)}
                  </div>
                  <h3 className="text-foreground line-clamp-1">{auction.title}</h3>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-muted-foreground">Winning Bid</p>
                      <p className="text-[#fbbf24]">${auction.winningBid.toLocaleString()}</p>
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
                    Won {auction.wonDate.toLocaleDateString()}
                  </p>
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
