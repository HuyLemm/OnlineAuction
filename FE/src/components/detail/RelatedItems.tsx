import { ChevronLeft, ChevronRight } from "lucide-react";
import { AuctionCard } from "../auction/AuctionCard";
import { Button } from "../ui/button";
import { useRef } from "react";

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
}

interface RelatedItemsProps {
  items?: AuctionItem[];
}

export function RelatedItems({ items = [] }: RelatedItemsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Default mock data - 5 related products
  const defaultItems: AuctionItem[] = [
    {
      id: "1",
      title: "Omega Seamaster Professional",
      image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=400&q=80",
      currentBid: 8500,
      bids: 32,
      timeLeft: "1d 8h",
      category: "Luxury Watches",
      isHot: true,
    },
    {
      id: "2",
      title: "TAG Heuer Carrera",
      image: "https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=400&q=80",
      currentBid: 6200,
      bids: 24,
      timeLeft: "2d 4h",
      category: "Luxury Watches",
    },
    {
      id: "3",
      title: "Breitling Navitimer",
      image: "https://images.unsplash.com/photo-1587836374228-4c4c1e0e8e8f?w=400&q=80",
      currentBid: 9800,
      bids: 41,
      timeLeft: "3d 12h",
      category: "Luxury Watches",
      endingSoon: true,
    },
    {
      id: "4",
      title: "IWC Portugieser",
      image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400&q=80",
      currentBid: 12500,
      bids: 55,
      timeLeft: "4d 6h",
      category: "Luxury Watches",
    },
    {
      id: "5",
      title: "Cartier Santos",
      image: "https://images.unsplash.com/photo-1609587312208-cea54be969e7?w=400&q=80",
      currentBid: 11200,
      bids: 38,
      timeLeft: "5d 2h",
      category: "Luxury Watches",
    },
  ];

  const displayItems = items.length > 0 ? items : defaultItems;

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320; // Card width + gap
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-foreground">Related Items in Same Category</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("left")}
            className="border-border/50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("right")}
            className="border-border/50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {displayItems.map((item) => (
          <div key={item.id} className="flex-shrink-0 w-[300px] snap-start">
            <AuctionCard {...item} />
          </div>
        ))}
      </div>
    </div>
  );
}