import { useState } from "react";
import { X, Clock, TrendingUp, Grid3x3, List } from "lucide-react";
import { Button } from "../ui/button";
import { AuctionCard } from "../auction/AuctionCard";
import { AuctionListItem } from "../browse/AuctionListItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface WatchlistItem {
  id: string;
  title: string;
  image: string;
  currentBid: number;
  bids: number;
  timeLeft: string;
  category: string;
  isHot?: boolean;
  endingSoon?: boolean;
  watchers?: number;
  addedDate: string;
}

export function Watchlist() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("all");

  const watchlistItems: WatchlistItem[] = [
    {
      id: "1",
      title: "Rolex Submariner 116610LN Black Dial",
      image: "https://images.unsplash.com/photo-1670177257750-9b47927f68eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaHxlbnwxfHx8fDE3NjMzOTExMzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 12500,
      bids: 45,
      timeLeft: "2d 5h",
      category: "Watches",
      isHot: true,
      watchers: 234,
      addedDate: "2 days ago"
    },
    {
      id: "2",
      title: "Pablo Picasso Original Oil Painting",
      image: "https://images.unsplash.com/photo-1558522195-e1201b090344?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcnR8ZW58MXx8fHwxNzYzMzc4ODkxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 385000,
      bids: 23,
      timeLeft: "4d 16h",
      category: "Art",
      isHot: true,
      watchers: 589,
      addedDate: "5 days ago"
    },
    {
      id: "3",
      title: "1970 Porsche 911S Coupe Original Paint",
      image: "https://images.unsplash.com/photo-1604940500627-d3f44d1d21c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY2FyfGVufDF8fHx8MTc2MzM5MDY2Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 185000,
      bids: 67,
      timeLeft: "3d 18h",
      category: "Vintage Cars",
      isHot: true,
      watchers: 345,
      addedDate: "1 week ago"
    },
    {
      id: "4",
      title: "Tiffany & Co. 3.5ct Diamond Ring",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBqZXdlbHJ5fGVufDF8fHx8MTc2MzM5OTk0NXww&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 22000,
      bids: 56,
      timeLeft: "6h",
      category: "Jewelry",
      endingSoon: true,
      watchers: 134,
      addedDate: "3 days ago"
    },
    {
      id: "5",
      title: "Limited Edition Nike Air Jordan 1",
      image: "https://images.unsplash.com/photo-1686783695684-7b8351fdebbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMHNuZWFrZXJzfGVufDF8fHx8MTc2MzMyMDU3M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 8500,
      bids: 145,
      timeLeft: "3d 6h",
      category: "Fashion",
      isHot: true,
      watchers: 289,
      addedDate: "4 days ago"
    },
    {
      id: "6",
      title: "Vintage Leica M6 Film Camera",
      image: "https://images.unsplash.com/photo-1693292918414-3e0f37ef8271?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwY2FtZXJhfGVufDF8fHx8MTc2MzQwMDE5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 6800,
      bids: 89,
      timeLeft: "1d 20h",
      category: "Collectibles",
      watchers: 167,
      addedDate: "1 day ago"
    },
    {
      id: "7",
      title: "Audemars Piguet Royal Oak",
      image: "https://images.unsplash.com/photo-1670177257750-9b47927f68eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaHxlbnwxfHx8fDE3NjMzOTExMzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 28000,
      bids: 67,
      timeLeft: "1d 12h",
      category: "Watches",
      watchers: 412,
      addedDate: "6 days ago"
    },
    {
      id: "8",
      title: "Mid-Century Teak Sideboard",
      image: "https://images.unsplash.com/photo-1544691560-fc2053d97726?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbnRpcXVlJTIwZnVybml0dXJlfGVufDF8fHx8MTc2MzM5MTA2N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 3200,
      bids: 45,
      timeLeft: "1d 6h",
      category: "Furniture",
      watchers: 67,
      addedDate: "3 hours ago"
    },
  ];

  const endingSoonItems = watchlistItems.filter(item => item.endingSoon || item.timeLeft.includes("h"));
  const highValueItems = watchlistItems.filter(item => item.currentBid > 20000);

  const getFilteredItems = () => {
    switch (activeTab) {
      case "ending-soon":
        return endingSoonItems;
      case "high-value":
        return highValueItems;
      default:
        return watchlistItems;
    }
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-foreground mb-2">Watchlist</h1>
          <p className="text-muted-foreground">Keep track of items you're interested in</p>
        </div>
        
        {/* View Toggle */}
        <div className="flex items-center gap-1 rounded-lg bg-secondary/50 border border-border/50 p-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
            className={`h-8 w-8 ${
              viewMode === "grid" 
                ? "bg-[#fbbf24]/10 text-[#fbbf24] hover:bg-[#fbbf24]/20 hover:text-[#fbbf24]" 
                : ""
            }`}
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
            className={`h-8 w-8 ${
              viewMode === "list" 
                ? "bg-[#fbbf24]/10 text-[#fbbf24] hover:bg-[#fbbf24]/20 hover:text-[#fbbf24]" 
                : ""
            }`}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border/50 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#fbbf24]/20 to-[#f59e0b]/20 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-[#fbbf24]" />
            </div>
            <div>
              <p className="text-muted-foreground">Total Watching</p>
              <p className="text-foreground">{watchlistItems.length} Items</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#ef4444]/20 to-[#ef4444]/10 flex items-center justify-center">
              <Clock className="h-6 w-6 text-[#ef4444]" />
            </div>
            <div>
              <p className="text-muted-foreground">Ending Soon</p>
              <p className="text-foreground">{endingSoonItems.length} Items</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#8b5cf6]/20 to-[#8b5cf6]/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-[#8b5cf6]" />
            </div>
            <div>
              <p className="text-muted-foreground">High Value</p>
              <p className="text-foreground">{highValueItems.length} Items</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-secondary/50 border border-border/50">
          <TabsTrigger value="all">
            All ({watchlistItems.length})
          </TabsTrigger>
          <TabsTrigger value="ending-soon">
            Ending Soon ({endingSoonItems.length})
          </TabsTrigger>
          <TabsTrigger value="high-value">
            High Value ({highValueItems.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="relative group">
                  <AuctionCard {...item} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 hover:bg-black/80 text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <div key={item.id} className="relative group">
                  <AuctionListItem {...item} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 hover:bg-black/80 text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No items in this category</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
