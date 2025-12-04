import { HeroBanner } from "../components/home/HeroBanner";
import { CategoryGrid } from "../components/home/CategoryGrid";
import { HomeFeaturedSection } from "../components/home/HomeFeaturedSection";
import { Clock, TrendingUp, DollarSign, Code } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

interface AuctionItem {
  id: string;
  title: string;
  image: string;
  currentBid: number;
  bids: number;
  timeLeft: string;
  category: string;
  isHot?: boolean;
  endingSoon?: boolean;
  postedDate?: Date; // Add postedDate field
}

interface HomePageProps {
  onNavigate?: (page: "home" | "browse" | "detail" | "dashboard" | "seller" | "search") => void;
  onSearch?: (query: string) => void;
  onCategorySelect?: (category: string) => void;
}

export function HomePage({ onNavigate, onSearch, onCategorySelect }: HomePageProps) {
  // Helper to create dates relative to now
  const daysAgo = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
  };

  // Mock data for Top 5 Ending Soon
  const endingSoonAuctions: AuctionItem[] = [
    {
      id: "es1",
      title: "1967 Ford Mustang Fastback - Fully Restored",
      image: "https://images.unsplash.com/photo-1604940500627-d3f44d1d21c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY2FyfGVufDF8fHx8MTc2MzM5MDY2Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 75000,
      bids: 89,
      timeLeft: "2h 15m",
      category: "Vehicles",
      endingSoon: true,
      postedDate: daysAgo(2)
    },
    {
      id: "es2",
      title: "Vintage Cartier Diamond Necklace 18K Gold",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBqZXdlbHJ5fGVufDF8fHx8MTc2MzM5OTk0NXww&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 28000,
      bids: 67,
      timeLeft: "3h 42m",
      category: "Jewelry",
      endingSoon: true,
      postedDate: daysAgo(5)
    },
    {
      id: "es3",
      title: "Rare Leica M3 Camera with Original Lens",
      image: "https://images.unsplash.com/photo-1693292918414-3e0f37ef8271?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwY2FtZXJhfGVufDF8fHx8MTc2MzQwMDE5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 4200,
      bids: 34,
      timeLeft: "4h 20m",
      category: "Collectibles",
      endingSoon: true,
      postedDate: daysAgo(1)
    },
    {
      id: "es4",
      title: "Hermès Birkin 35 Crocodile Limited Edition",
      image: "https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBoYW5kYmFnfGVufDF8fHx8MTc2MzMwNTk3N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 52000,
      bids: 78,
      timeLeft: "5h 10m",
      category: "Fashion & Accessories",
      endingSoon: true,
      postedDate: daysAgo(15)
    },
    {
      id: "es5",
      title: "Tiffany & Co. 3.5ct Diamond Engagement Ring",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBqZXdlbHJ5fGVufDF8fHx8MTc2MzM5OTk0NXww&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 22000,
      bids: 56,
      timeLeft: "6h 05m",
      category: "Jewelry",
      endingSoon: true,
      postedDate: daysAgo(8)
    }
  ];

  // Mock data for Top 5 Most Bids
  const mostBidsAuctions: AuctionItem[] = [
    {
      id: "mb1",
      title: "Patek Philippe Nautilus 5711/1A Steel Blue Dial",
      image: "https://images.unsplash.com/photo-1670177257750-9b47927f68eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaHxlbnwxfHx8fDE3NjMzOTExMzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 156000,
      bids: 234,
      timeLeft: "1d 8h 30m",
      category: "Watches",
      isHot: true,
      postedDate: daysAgo(3)
    },
    {
      id: "mb2",
      title: "1960 Rolex Submariner Ref. 5513 James Bond",
      image: "https://images.unsplash.com/photo-1670177257750-9b47927f68eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaHxlbnwxfHx8fDE3NjMzOTExMzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 95000,
      bids: 189,
      timeLeft: "2d 4h 15m",
      category: "Watches",
      isHot: true,
      postedDate: daysAgo(6)
    },
    {
      id: "mb3",
      title: "Original Banksy Street Art on Canvas 'Girl with Balloon'",
      image: "https://images.unsplash.com/photo-1558522195-e1201b090344?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcnR8ZW58MXx8fHwxNzYzMzc4ODkxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 125000,
      bids: 167,
      timeLeft: "1d 12h 45m",
      category: "Art & Collectibles",
      isHot: true,
      postedDate: daysAgo(4)
    },
    {
      id: "mb4",
      title: "Limited Edition Nike Air Jordan 1 Chicago (1985)",
      image: "https://images.unsplash.com/photo-1686783695684-7b8351fdebbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMHNuZWFrZXJzfGVufDF8fHx8MTc2MzMyMDU3M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 8500,
      bids: 145,
      timeLeft: "3d 6h 20m",
      category: "Fashion & Accessories",
      isHot: true,
      postedDate: daysAgo(10)
    },
    {
      id: "mb5",
      title: "1933 Double Eagle Gold Coin MS-65 Certified",
      image: "https://images.unsplash.com/photo-1762049213134-008e36819c1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYXJlJTIwY29pbnN8ZW58MXx8fHwxNzYzNDAwMTk1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 42000,
      bids: 134,
      timeLeft: "2d 18h 50m",
      category: "Collectibles",
      isHot: true,
      postedDate: daysAgo(12)
    }
  ];

  // Mock data for Top 5 Highest Price
  const highestPriceAuctions: AuctionItem[] = [
    {
      id: "hp1",
      title: "1962 Ferrari 250 GTO Berlinetta - Matching Numbers",
      image: "https://images.unsplash.com/photo-1604940500627-d3f44d1d21c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY2FyfGVufDF8fHx8MTc2MzM5MDY2Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 2850000,
      bids: 12,
      timeLeft: "5d 12h 00m",
      category: "Vehicles",
      isHot: true,
      postedDate: daysAgo(20)
    },
    {
      id: "hp2",
      title: "Patek Philippe Grand Complications Ref. 5270P",
      image: "https://images.unsplash.com/photo-1670177257750-9b47927f68eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaHxlbnwxfHx8fDE3NjMzOTExMzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 425000,
      bids: 45,
      timeLeft: "3d 8h 30m",
      category: "Watches",
      isHot: true,
      postedDate: daysAgo(14)
    },
    {
      id: "hp3",
      title: "Pablo Picasso Original Oil Painting 1950s Authenticated",
      image: "https://images.unsplash.com/photo-1558522195-e1201b090344?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcnR8ZW58MXx8fHwxNzYzMzc4ODkxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 385000,
      bids: 23,
      timeLeft: "4d 16h 20m",
      category: "Art & Collectibles",
      isHot: true,
      postedDate: daysAgo(18)
    },
    {
      id: "hp4",
      title: "Harry Winston 15ct Diamond Necklace Platinum",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBqZXdlbHJ5fGVufDF8fHx8MTc2MzM5OTk0NXww&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 275000,
      bids: 34,
      timeLeft: "2d 22h 40m",
      category: "Jewelry",
      isHot: true,
      postedDate: daysAgo(25)
    },
    {
      id: "hp5",
      title: "Audemars Piguet Royal Oak Offshore Tourbillon",
      image: "https://images.unsplash.com/photo-1670177257750-9b47927f68eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaHxlbnwxfHx8fDE3NjMzOTExMzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 215000,
      bids: 56,
      timeLeft: "6d 4h 10m",
      category: "Watches",
      postedDate: daysAgo(30)
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Banner */}
      <HeroBanner onSearch={onSearch} />

      {/* Category Grid */}
      <CategoryGrid onCategoryClick={(category) => {
        onCategorySelect?.(category);
        onNavigate?.("browse");
      }} />

      {/* Top 5 Ending Soon */}
      <HomeFeaturedSection
        title="Top 5 Ending Soon"
        description="Last chance to bid on these items"
        icon={Clock}
        iconGradient="from-[#f59e0b]/20 to-[#ef4444]/20"
        iconColor="text-[#f59e0b]"
        auctions={endingSoonAuctions}
        onNavigate={onNavigate}
        onViewAll={() => onNavigate?.("browse")}
      />

      {/* Top 5 Most Bids */}
      <HomeFeaturedSection
        title="Top 5 Most Popular"
        description="Hot items with the most bids"
        icon={TrendingUp}
        iconGradient="from-[#ef4444]/20 to-[#fbbf24]/20"
        iconColor="text-[#ef4444]"
        auctions={mostBidsAuctions}
        onNavigate={onNavigate}
        onViewAll={() => onNavigate?.("browse")}
      />

      {/* Top 5 Highest Price */}
      <HomeFeaturedSection
        title="Top 5 Highest Price"
        description="Premium luxury items"
        icon={DollarSign}
        iconGradient="from-[#fbbf24]/20 to-[#f59e0b]/20"
        iconColor="text-[#fbbf24]"
        auctions={highestPriceAuctions}
        onNavigate={onNavigate}
        onViewAll={() => onNavigate?.("browse")}
      />
    </div>
  );
}