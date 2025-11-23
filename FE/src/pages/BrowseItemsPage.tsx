import { useState } from "react";
import { FilterSidebar } from "../components/browse/FilterSidebar";
import { BrowseTopBar } from "../components/browse/BrowseTopBar";
import { BrowseContentSection } from "../components/browse/BrowseContentSection";

interface AuctionItem {
  id: string;
  title: string;
  image: string;
  currentBid: number;
  bids: number;
  timeLeft: string;
  category: string;
  description?: string;
  isHot?: boolean;
  endingSoon?: boolean;
  watchers?: number;
}

interface BrowseItemsPageProps {
  onNavigate?: (page: "home" | "browse" | "detail" | "dashboard" | "seller") => void;
}

export function BrowseItemsPage({ onNavigate }: BrowseItemsPageProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  // Mock data - expanded auction items
  const allAuctions: AuctionItem[] = [
    {
      id: "1",
      title: "Patek Philippe Nautilus 5711/1A Steel Blue Dial",
      image: "https://images.unsplash.com/photo-1670177257750-9b47927f68eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaHxlbnwxfHx8fDE3NjMzOTExMzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 156000,
      bids: 234,
      timeLeft: "1d 8h 30m",
      category: "Watches",
      isHot: true,
      watchers: 456
    },
    {
      id: "2",
      title: "1967 Ford Mustang Fastback - Fully Restored",
      image: "https://images.unsplash.com/photo-1604940500627-d3f44d1d21c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY2FyfGVufDF8fHx8MTc2MzM5MDY2Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 75000,
      bids: 89,
      timeLeft: "2h 15m",
      category: "Vintage Cars",
      endingSoon: true,
      watchers: 234
    },
    {
      id: "3",
      title: "Original Banksy Street Art on Canvas 'Girl with Balloon'",
      image: "https://images.unsplash.com/photo-1558522195-e1201b090344?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcnR8ZW58MXx8fHwxNzYzMzc4ODkxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 125000,
      bids: 167,
      timeLeft: "1d 12h 45m",
      category: "Art",
      isHot: true,
      watchers: 389
    },
    {
      id: "4",
      title: "Vintage Cartier Diamond Necklace 18K Gold",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBqZXdlbHJ5fGVufDF8fHx8MTc2MzM5OTk0NXww&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 28000,
      bids: 67,
      timeLeft: "3h 42m",
      category: "Jewelry",
      endingSoon: true,
      watchers: 178
    },
    {
      id: "5",
      title: "Rare Leica M3 Camera with Original Lens",
      image: "https://images.unsplash.com/photo-1693292918414-3e0f37ef8271?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwY2FtZXJhfGVufDF8fHx8MTc2MzQwMDE5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 4200,
      bids: 34,
      timeLeft: "4h 20m",
      category: "Collectibles",
      endingSoon: true,
      watchers: 92
    },
    {
      id: "6",
      title: "Hermès Birkin 35 Crocodile Limited Edition",
      image: "https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBoYW5kYmFnfGVufDF8fHx8MTc2MzMwNTk3N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 52000,
      bids: 78,
      timeLeft: "5h 10m",
      category: "Fashion",
      isHot: true,
      watchers: 267
    },
    {
      id: "7",
      title: "1960 Rolex Submariner Ref. 5513 James Bond",
      image: "https://images.unsplash.com/photo-1670177257750-9b47927f68eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaHxlbnwxfHx8fDE3NjMzOTExMzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 95000,
      bids: 189,
      timeLeft: "2d 4h 15m",
      category: "Watches",
      isHot: true,
      watchers: 512
    },
    {
      id: "8",
      title: "Mid-Century Modern Teak Sideboard Danish Design",
      image: "https://images.unsplash.com/photo-1544691560-fc2053d97726?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbnRpcXVlJTIwZnVybml0dXJlfGVufDF8fHx8MTc2MzM5MTA2N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 3200,
      bids: 45,
      timeLeft: "1d 6h 30m",
      category: "Furniture",
      watchers: 67
    },
    {
      id: "9",
      title: "Limited Edition Nike Air Jordan 1 Chicago (1985)",
      image: "https://images.unsplash.com/photo-1686783695684-7b8351fdebbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMHNuZWFrZXJzfGVufDF8fHx8MTc2MzMyMDU3M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 8500,
      bids: 145,
      timeLeft: "3d 6h 20m",
      category: "Fashion",
      isHot: true,
      watchers: 289
    },
    {
      id: "10",
      title: "Tiffany & Co. 3.5ct Diamond Engagement Ring",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBqZXdlbHJ5fGVufDF8fHx8MTc2MzM5OTk0NXww&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 22000,
      bids: 56,
      timeLeft: "6h 05m",
      category: "Jewelry",
      endingSoon: true,
      watchers: 134
    },
    {
      id: "11",
      title: "1962 Ferrari 250 GTO Berlinetta - Matching Numbers",
      image: "https://images.unsplash.com/photo-1604940500627-d3f44d1d21c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY2FyfGVufDF8fHx8MTc2MzM5MDY2Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 2850000,
      bids: 12,
      timeLeft: "5d 12h 00m",
      category: "Vintage Cars",
      isHot: true,
      watchers: 1234
    },
    {
      id: "12",
      title: "Signed Muhammad Ali Boxing Gloves 1974",
      image: "https://images.unsplash.com/photo-1512144825472-b4d1e4cdeb68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBtZW1vcmFiaWxpYXxlbnwxfHx8fDE3NjMzOTEwNjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 15000,
      bids: 87,
      timeLeft: "2d 8h 45m",
      category: "Sports",
      watchers: 156
    },
    {
      id: "13",
      title: "Patek Philippe Grand Complications Ref. 5270P",
      image: "https://images.unsplash.com/photo-1670177257750-9b47927f68eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaHxlbnwxfHx8fDE3NjMzOTExMzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 425000,
      bids: 45,
      timeLeft: "3d 8h 30m",
      category: "Watches",
      isHot: true,
      watchers: 678
    },
    {
      id: "14",
      title: "Pablo Picasso Original Oil Painting 1950s Authenticated",
      image: "https://images.unsplash.com/photo-1558522195-e1201b090344?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcnR8ZW58MXx8fHwxNzYzMzc4ODkxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 385000,
      bids: 23,
      timeLeft: "4d 16h 20m",
      category: "Art",
      isHot: true,
      watchers: 589
    },
    {
      id: "15",
      title: "Harry Winston 15ct Diamond Necklace Platinum",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBqZXdlbHJ5fGVufDF8fHx8MTc2MzM5OTk0NXww&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 275000,
      bids: 34,
      timeLeft: "2d 22h 40m",
      category: "Jewelry",
      isHot: true,
      watchers: 445
    },
    {
      id: "16",
      title: "1933 Double Eagle Gold Coin MS-65 Certified",
      image: "https://images.unsplash.com/photo-1762049213134-008e36819c1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYXJlJTIwY29pbnN8ZW58MXx8fHwxNzYzNDAwMTk1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 42000,
      bids: 134,
      timeLeft: "2d 18h 50m",
      category: "Collectibles",
      isHot: true,
      watchers: 223
    },
    {
      id: "17",
      title: "Louis Vuitton Vintage Trunk 1920s",
      image: "https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBoYW5kYmFnfGVufDF8fHx8MTc2MzMwNTk3N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 18500,
      bids: 76,
      timeLeft: "1d 14h 25m",
      category: "Fashion",
      watchers: 145
    },
    {
      id: "18",
      title: "Art Deco Mahogany Dining Table Set",
      image: "https://images.unsplash.com/photo-1544691560-fc2053d97726?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbnRpcXVlJTIwZnVybml0dXJlfGVufDF8fHx8MTc2MzM5MTA2N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 5600,
      bids: 32,
      timeLeft: "3d 10h 15m",
      category: "Furniture",
      watchers: 78
    },
    {
      id: "19",
      title: "Audemars Piguet Royal Oak Offshore Tourbillon",
      image: "https://images.unsplash.com/photo-1670177257750-9b47927f68eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaHxlbnwxfHx8fDE3NjMzOTExMzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 215000,
      bids: 56,
      timeLeft: "6d 4h 10m",
      category: "Watches",
      watchers: 389
    },
    {
      id: "20",
      title: "Andy Warhol Marilyn Monroe Screen Print Signed",
      image: "https://images.unsplash.com/photo-1558522195-e1201b090344?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcnR8ZW58MXx8fHwxNzYzMzc4ODkxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 95000,
      bids: 112,
      timeLeft: "4d 2h 35m",
      category: "Art",
      isHot: true,
      watchers: 456
    },
    {
      id: "21",
      title: "Vintage Leica M6 Film Camera Black Paint Edition",
      image: "https://images.unsplash.com/photo-1693292918414-3e0f37ef8271?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwY2FtZXJhfGVufDF8fHx8MTc2MzQwMDE5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 6800,
      bids: 89,
      timeLeft: "1d 20h 50m",
      category: "Collectibles",
      watchers: 167
    },
    {
      id: "22",
      title: "Van Cleef & Arpels Vintage Alhambra Necklace",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBqZXdlbHJ5fGVufDF8fHx8MTc2MzM5OTk0NXww&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 12500,
      bids: 43,
      timeLeft: "5h 30m",
      category: "Jewelry",
      endingSoon: true,
      watchers: 98
    },
    {
      id: "23",
      title: "1970 Porsche 911S Coupe Original Paint",
      image: "https://images.unsplash.com/photo-1604940500627-d3f44d1d21c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY2FyfGVufDF8fHx8MTc2MzM5MDY2Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 185000,
      bids: 67,
      timeLeft: "3d 18h 40m",
      category: "Vintage Cars",
      isHot: true,
      watchers: 345
    },
    {
      id: "24",
      title: "Supreme Box Logo Hoodie 2011 Grey",
      image: "https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBoYW5kYmFnfGVufDF8fHx8MTc2MzMwNTk3N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 1850,
      bids: 156,
      timeLeft: "12h 15m",
      category: "Fashion",
      endingSoon: true,
      watchers: 234
    }
  ];

  const totalItems = allAuctions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAuctions = allAuctions.slice(startIndex, endIndex);

  return (
    <div className="flex h-[calc(100vh-73px)]">
      {/* Desktop Filter Sidebar */}
      <div className="hidden lg:block w-80 flex-shrink-0">
        <FilterSidebar />
      </div>

      {/* Mobile Filter Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-80 animate-in slide-in-from-left">
            <FilterSidebar onClose={() => setShowMobileFilters(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <BrowseTopBar
          totalItems={totalItems}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onFilterToggle={() => setShowMobileFilters(true)}
          showFilterToggle={true}
        />

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          <BrowseContentSection
            auctions={currentAuctions}
            viewMode={viewMode}
            currentPage={currentPage}
            totalPages={totalPages}
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            onNavigate={onNavigate}
          />
        </div>
      </div>
    </div>
  );
}
