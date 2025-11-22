import { Trophy, Package, CheckCircle, Download, MessageCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ImageWithFallback } from "../check/ImageWithFallback";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useState } from "react";

interface WonAuction {
  id: string;
  title: string;
  image: string;
  finalBid: number;
  wonDate: string;
  category: string;
  status: "payment-pending" | "paid" | "shipped" | "delivered";
  trackingNumber?: string;
  estimatedDelivery?: string;
  sellerName: string;
}

export function WonAuctions() {
  const [activeTab, setActiveTab] = useState("all");

  const wonAuctions: WonAuction[] = [
    {
      id: "1",
      title: "Vintage Cartier Diamond Necklace 18K Gold",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBqZXdlbHJ5fGVufDF8fHx8MTc2MzM5OTk0NXww&ixlib=rb-4.1.0&q=80&w=1080",
      finalBid: 29500,
      wonDate: "2 days ago",
      category: "Jewelry",
      status: "delivered",
      trackingNumber: "1Z999AA10123456784",
      estimatedDelivery: "Delivered Nov 18",
      sellerName: "LuxuryJewels"
    },
    {
      id: "2",
      title: "Omega Speedmaster Professional Moonwatch",
      image: "https://images.unsplash.com/photo-1670177257750-9b47927f68eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaHxlbnwxfHx8fDE3NjMzOTExMzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      finalBid: 5200,
      wonDate: "5 days ago",
      category: "Watches",
      status: "shipped",
      trackingNumber: "1Z999AA10123456785",
      estimatedDelivery: "Nov 24",
      sellerName: "TimepieceMaster"
    },
    {
      id: "3",
      title: "Mid-Century Modern Teak Sideboard",
      image: "https://images.unsplash.com/photo-1544691560-fc2053d97726?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbnRpcXVlJTIwZnVybml0dXJlfGVufDF8fHx8MTc2MzM5MTA2N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      finalBid: 3400,
      wonDate: "1 week ago",
      category: "Furniture",
      status: "paid",
      estimatedDelivery: "Nov 28",
      sellerName: "VintageFinds"
    },
    {
      id: "4",
      title: "Rare Leica M3 Camera with Original Lens",
      image: "https://images.unsplash.com/photo-1693292918414-3e0f37ef8271?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwY2FtZXJhfGVufDF8fHx8MTc2MzQwMDE5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      finalBid: 4300,
      wonDate: "3 days ago",
      category: "Collectibles",
      status: "payment-pending",
      estimatedDelivery: "To be confirmed",
      sellerName: "ClassicCameras"
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-[#10b981] text-white border-0">Delivered</Badge>;
      case "shipped":
        return <Badge className="bg-[#3b82f6] text-white border-0">Shipped</Badge>;
      case "paid":
        return <Badge className="bg-[#fbbf24] text-black border-0">Processing</Badge>;
      case "payment-pending":
        return <Badge className="bg-[#ef4444] text-white border-0">Payment Pending</Badge>;
      default:
        return null;
    }
  };

  const WonAuctionCard = ({ auction }: { auction: WonAuction }) => (
    <div className="bg-card border border-border/50 rounded-xl overflow-hidden hover:border-border transition-all">
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        {/* Image */}
        <div className="relative w-full sm:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
          <ImageWithFallback
            src={auction.image}
            alt={auction.title}
            className="h-full w-full object-cover"
          />
          {auction.status === "delivered" && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-[#10b981]" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-border/50 text-muted-foreground">
                {auction.category}
              </Badge>
              {getStatusBadge(auction.status)}
            </div>
            <h3 className="text-foreground line-clamp-1">{auction.title}</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground">Won For</p>
                <p className="text-[#fbbf24]">${auction.finalBid.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Won Date</p>
                <p className="text-foreground">{auction.wonDate}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Seller</p>
                <p className="text-foreground">{auction.sellerName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Delivery</p>
                <p className="text-foreground">{auction.estimatedDelivery}</p>
              </div>
            </div>

            {auction.trackingNumber && (
              <div className="bg-secondary/30 rounded-lg p-3 border border-border/50">
                <p className="text-muted-foreground mb-1">Tracking Number</p>
                <p className="text-foreground">{auction.trackingNumber}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/50">
            {auction.status === "payment-pending" && (
              <Button className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90">
                Complete Payment
              </Button>
            )}
            {auction.status === "shipped" && (
              <Button variant="outline" className="border-border/50">
                <Package className="h-4 w-4 mr-2" />
                Track Package
              </Button>
            )}
            {auction.status === "delivered" && (
              <Button className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90">
                Leave Review
              </Button>
            )}
            <Button variant="outline" className="border-border/50">
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Seller
            </Button>
            <Button variant="outline" className="border-border/50">
              <Download className="h-4 w-4 mr-2" />
              Invoice
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const deliveredAuctions = wonAuctions.filter(a => a.status === "delivered");
  const pendingAuctions = wonAuctions.filter(a => a.status !== "delivered");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-foreground mb-2">Won Auctions</h1>
        <p className="text-muted-foreground">View and manage your winning bids</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#10b981]/20 to-[#10b981]/10 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-[#10b981]" />
            </div>
            <div>
              <p className="text-muted-foreground">Delivered</p>
              <p className="text-foreground">{deliveredAuctions.length} Items</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#3b82f6]/20 to-[#3b82f6]/10 flex items-center justify-center">
              <Package className="h-6 w-6 text-[#3b82f6]" />
            </div>
            <div>
              <p className="text-muted-foreground">In Transit</p>
              <p className="text-foreground">{pendingAuctions.length} Items</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#8b5cf6]/20 to-[#8b5cf6]/10 flex items-center justify-center">
              <Trophy className="h-6 w-6 text-[#8b5cf6]" />
            </div>
            <div>
              <p className="text-muted-foreground">Total Spent</p>
              <p className="text-foreground">
                ${wonAuctions.reduce((sum, a) => sum + a.finalBid, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-secondary/50 border border-border/50">
          <TabsTrigger value="all">
            All ({wonAuctions.length})
          </TabsTrigger>
          <TabsTrigger value="delivered">
            Delivered ({deliveredAuctions.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pendingAuctions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {wonAuctions.map((auction) => (
            <WonAuctionCard key={auction.id} auction={auction} />
          ))}
        </TabsContent>

        <TabsContent value="delivered" className="space-y-4 mt-6">
          {deliveredAuctions.map((auction) => (
            <WonAuctionCard key={auction.id} auction={auction} />
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4 mt-6">
          {pendingAuctions.map((auction) => (
            <WonAuctionCard key={auction.id} auction={auction} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
