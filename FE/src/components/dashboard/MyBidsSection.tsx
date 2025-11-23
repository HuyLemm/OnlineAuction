import { useState } from "react";
import { Clock, TrendingUp, AlertCircle, Gavel } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ImageWithFallback } from "../check/ImageWithFallback";
import { Progress } from "../ui/progress";

interface Bid {
  id: string;
  itemId: string;
  title: string;
  image: string;
  currentBid: number;
  yourBid: number;
  maxBid: number;
  isLeading: boolean;
  isOutbid: boolean;
  timeLeft: string;
  endDate: Date;
  category: string;
  totalBids: number;
}

export function MyBidsSection() {
  const [activeTab, setActiveTab] = useState("active");

  const activeBids: Bid[] = [
    {
      id: "1",
      itemId: "item1",
      title: "Patek Philippe Nautilus 5711/1A Steel Blue Dial",
      image: "https://images.unsplash.com/photo-1670177257750-9b47927f68eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaHxlbnwxfHx8fDE3NjMzOTExMzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 156000,
      yourBid: 156000,
      maxBid: 160000,
      isLeading: true,
      isOutbid: false,
      timeLeft: "1d 8h 30m",
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 32.5),
      category: "Watches",
      totalBids: 234
    },
    {
      id: "2",
      itemId: "item2",
      title: "1967 Ford Mustang Fastback - Fully Restored",
      image: "https://images.unsplash.com/photo-1604940500627-d3f44d1d21c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY2FyfGVufDF8fHx8MTc2MzM5MDY2Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 76000,
      yourBid: 75000,
      maxBid: 78000,
      isLeading: false,
      isOutbid: true,
      timeLeft: "2h 15m",
      endDate: new Date(Date.now() + 1000 * 60 * 135),
      category: "Vintage Cars",
      totalBids: 89
    },
    {
      id: "3",
      itemId: "item3",
      title: "Hermès Birkin 35 Crocodile Limited Edition",
      image: "https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBoYW5kYmFnfGVufDF8fHx8MTc2MzMwNTk3N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 52000,
      yourBid: 52000,
      maxBid: 55000,
      isLeading: true,
      isOutbid: false,
      timeLeft: "5h 10m",
      endDate: new Date(Date.now() + 1000 * 60 * 310),
      category: "Fashion",
      totalBids: 78
    },
  ];

  const lostBids: Bid[] = [
    {
      id: "4",
      itemId: "item4",
      title: "Vintage Cartier Diamond Necklace 18K Gold",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBqZXdlbHJ5fGVufDF8fHx8MTc2MzM5OTk0NXww&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 29500,
      yourBid: 28000,
      maxBid: 28500,
      isLeading: false,
      isOutbid: true,
      timeLeft: "Ended",
      endDate: new Date(Date.now() - 1000 * 60 * 60 * 2),
      category: "Jewelry",
      totalBids: 67
    },
  ];

  const BidCard = ({ bid }: { bid: Bid }) => (
    <div className="bg-card border border-border/50 rounded-xl overflow-hidden hover:border-border transition-all">
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        {/* Image */}
        <div className="relative w-full sm:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
          <ImageWithFallback
            src={bid.image}
            alt={bid.title}
            className="h-full w-full object-cover"
          />
          {bid.isLeading && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-[#10b981] text-white border-0">
                <TrendingUp className="h-3 w-3 mr-1" />
                Leading
              </Badge>
            </div>
          )}
          {bid.isOutbid && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-[#ef4444] text-white border-0">
                <AlertCircle className="h-3 w-3 mr-1" />
                Outbid
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div className="space-y-2">
            <Badge variant="outline" className="border-border/50 text-muted-foreground">
              {bid.category}
            </Badge>
            <h3 className="text-foreground line-clamp-1">{bid.title}</h3>
            
            {/* Bid Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Your Max Bid</span>
                <span className="text-foreground">${bid.maxBid.toLocaleString()}</span>
              </div>
              <Progress 
                value={(bid.yourBid / bid.maxBid) * 100} 
                className="h-2"
              />
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-muted-foreground">Current Bid</p>
                  <p className="text-[#fbbf24]">${bid.currentBid.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground">Your Bid</p>
                  <p className="text-foreground">${bid.yourBid.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{bid.timeLeft}</span>
              <span>•</span>
              <span>{bid.totalBids} bids</span>
            </div>
            {bid.isOutbid && (
              <Button size="sm" className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90">
                Increase Bid
              </Button>
            )}
            {bid.isLeading && (
              <Button variant="outline" size="sm" className="border-border/50">
                View Auction
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-foreground mb-2">My Bids</h1>
        <p className="text-muted-foreground">Track and manage all your active bids</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border/50 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#10b981]/20 to-[#10b981]/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-[#10b981]" />
            </div>
            <div>
              <p className="text-muted-foreground">Leading</p>
              <p className="text-foreground">2 Auctions</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#ef4444]/20 to-[#ef4444]/10 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-[#ef4444]" />
            </div>
            <div>
              <p className="text-muted-foreground">Outbid</p>
              <p className="text-foreground">1 Auction</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#fbbf24]/20 to-[#f59e0b]/20 flex items-center justify-center">
              <Gavel className="h-6 w-6 text-[#fbbf24]" />
            </div>
            <div>
              <p className="text-muted-foreground">Total Bids</p>
              <p className="text-foreground">$283,000</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#8b5cf6]/20 to-[#8b5cf6]/10 flex items-center justify-center">
              <Clock className="h-6 w-6 text-[#8b5cf6]" />
            </div>
            <div>
              <p className="text-muted-foreground">Ending Soon</p>
              <p className="text-foreground">1 in 2h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-secondary/50 border border-border/50">
          <TabsTrigger value="active">
            Active Bids ({activeBids.length})
          </TabsTrigger>
          <TabsTrigger value="lost">
            Lost ({lostBids.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4 mt-6">
          {activeBids.map((bid) => (
            <BidCard key={bid.id} bid={bid} />
          ))}
        </TabsContent>

        <TabsContent value="lost" className="space-y-4 mt-6">
          {lostBids.map((bid) => (
            <BidCard key={bid.id} bid={bid} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
