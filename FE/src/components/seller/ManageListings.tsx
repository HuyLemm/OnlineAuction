import { useState } from "react";
import { Edit, Trash2, Eye, Pause, Play, TrendingUp, Users, Clock } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ImageWithFallback } from "../check/ImageWithFallback";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface Listing {
  id: string;
  title: string;
  image: string;
  currentBid: number;
  startingBid: number;
  bids: number;
  watchers: number;
  timeLeft: string;
  endDate: Date;
  status: "active" | "paused" | "scheduled";
  category: string;
  views: number;
}

export function ManageListings() {
  const [activeTab, setActiveTab] = useState("active");

  const activeListings: Listing[] = [
    {
      id: "1",
      title: "Vintage Rolex Submariner 5513 - 1967",
      image: "https://images.unsplash.com/photo-1670177257750-9b47927f68eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaHxlbnwxfHx8fDE3NjMzOTExMzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 28500,
      startingBid: 15000,
      bids: 87,
      watchers: 234,
      timeLeft: "2d 14h",
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 62),
      status: "active",
      category: "Watches",
      views: 1243
    },
    {
      id: "2",
      title: "Original Pablo Picasso Drawing 1952",
      image: "https://images.unsplash.com/photo-1558522195-e1201b090344?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcnR8ZW58MXx8fHwxNzYzMzc4ODkxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 125000,
      startingBid: 75000,
      bids: 45,
      watchers: 567,
      timeLeft: "5d 8h",
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 128),
      status: "active",
      category: "Art",
      views: 3421
    },
    {
      id: "3",
      title: "1965 Porsche 911 Coupe Matching Numbers",
      image: "https://images.unsplash.com/photo-1604940500627-d3f44d1d21c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY2FyfGVufDF8fHx8MTc2MzM5MDY2Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 0,
      startingBid: 95000,
      bids: 0,
      watchers: 89,
      timeLeft: "6d 20h",
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 164),
      status: "active",
      category: "Vintage Cars",
      views: 567
    }
  ];

  const pausedListings: Listing[] = [
    {
      id: "4",
      title: "Hermès Birkin 35 Crocodile Black",
      image: "https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBoYW5kYmFnfGVufDF8fHx8MTc2MzMwNTk3N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 0,
      startingBid: 35000,
      bids: 0,
      watchers: 156,
      timeLeft: "Paused",
      endDate: new Date(),
      status: "paused",
      category: "Fashion",
      views: 432
    }
  ];

  const scheduledListings: Listing[] = [
    {
      id: "5",
      title: "Audemars Piguet Royal Oak 15202ST",
      image: "https://images.unsplash.com/photo-1670177257750-9b47927f68eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaHxlbnwxfHx8fDE3NjMzOTExMzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 0,
      startingBid: 45000,
      bids: 0,
      watchers: 0,
      timeLeft: "Starts in 2d",
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 48),
      status: "scheduled",
      category: "Watches",
      views: 0
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-[#10b981] text-white border-0">Active</Badge>;
      case "paused":
        return <Badge className="bg-[#f59e0b] text-black border-0">Paused</Badge>;
      case "scheduled":
        return <Badge className="bg-[#3b82f6] text-white border-0">Scheduled</Badge>;
      default:
        return null;
    }
  };

  const ListingCard = ({ listing }: { listing: Listing }) => (
    <div className="bg-card border border-border/50 rounded-xl overflow-hidden hover:border-border transition-all">
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        {/* Image */}
        <div className="relative w-full sm:w-40 h-40 rounded-lg overflow-hidden flex-shrink-0">
          <ImageWithFallback
            src={listing.image}
            alt={listing.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute top-2 left-2">
            {getStatusBadge(listing.status)}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div className="space-y-3">
            <div>
              <Badge variant="outline" className="border-border/50 text-muted-foreground mb-2">
                {listing.category}
              </Badge>
              <h3 className="text-foreground line-clamp-1">{listing.title}</h3>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <p className="text-muted-foreground">Current Bid</p>
                <p className="text-[#fbbf24]">
                  {listing.currentBid > 0 
                    ? `$${listing.currentBid.toLocaleString()}` 
                    : `$${listing.startingBid.toLocaleString()}`
                  }
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Bids</p>
                <p className="text-foreground">{listing.bids}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Watchers</p>
                <p className="text-foreground">{listing.watchers}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Views</p>
                <p className="text-foreground">{listing.views}</p>
              </div>
            </div>

            {/* Time Left */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{listing.timeLeft}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/50">
            <Button variant="outline" size="sm" className="border-border/50">
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
            <Button variant="outline" size="sm" className="border-border/50">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            {listing.status === "active" ? (
              <Button variant="outline" size="sm" className="border-border/50">
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            ) : listing.status === "paused" ? (
              <Button variant="outline" size="sm" className="border-[#10b981]/50 text-[#10b981]">
                <Play className="h-4 w-4 mr-2" />
                Resume
              </Button>
            ) : null}
            <Button variant="ghost" size="sm" className="text-[#ef4444]">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-foreground mb-2">Manage Listings</h1>
          <p className="text-muted-foreground">View and manage your active auctions</p>
        </div>
        <Button className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90">
          Create New Listing
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border/50 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#10b981]/20 to-[#10b981]/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-[#10b981]" />
            </div>
            <div>
              <p className="text-muted-foreground">Active</p>
              <p className="text-foreground">{activeListings.length} Listings</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#fbbf24]/20 to-[#f59e0b]/20 flex items-center justify-center">
              <Users className="h-6 w-6 text-[#fbbf24]" />
            </div>
            <div>
              <p className="text-muted-foreground">Total Bids</p>
              <p className="text-foreground">
                {activeListings.reduce((sum, l) => sum + l.bids, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#3b82f6]/20 to-[#3b82f6]/10 flex items-center justify-center">
              <Eye className="h-6 w-6 text-[#3b82f6]" />
            </div>
            <div>
              <p className="text-muted-foreground">Total Views</p>
              <p className="text-foreground">
                {activeListings.reduce((sum, l) => sum + l.views, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#8b5cf6]/20 to-[#8b5cf6]/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-[#8b5cf6]" />
            </div>
            <div>
              <p className="text-muted-foreground">Potential Value</p>
              <p className="text-foreground">
                ${activeListings.reduce((sum, l) => sum + (l.currentBid || l.startingBid), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-secondary/50 border border-border/50">
          <TabsTrigger value="active">
            Active ({activeListings.length})
          </TabsTrigger>
          <TabsTrigger value="scheduled">
            Scheduled ({scheduledListings.length})
          </TabsTrigger>
          <TabsTrigger value="paused">
            Paused ({pausedListings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4 mt-6">
          {activeListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4 mt-6">
          {scheduledListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </TabsContent>

        <TabsContent value="paused" className="space-y-4 mt-6">
          {pausedListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
