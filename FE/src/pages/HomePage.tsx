import { useEffect, useState, useCallback } from "react";
import { HeroBanner } from "../components/home/HeroBanner";
import { CategoryGrid } from "../components/home/CategoryGrid";
import { HomeFeaturedSection } from "../components/home/HomeFeaturedSection";
import { Clock, TrendingUp, DollarSign } from "lucide-react";
import { type AuctionItem } from "../types/dto";
import { LoadingSpinner } from "../components/state";
import {
  GET_TOP_5_ENDING_SOON_API,
  GET_TOP_5_MOST_BIDS_API,
  GET_TOP_5_HIGHEST_PRICE_API,
} from "../components/utils/api";

interface HomePageProps {
  onNavigate?: (
    page: "home" | "browse" | "detail" | "dashboard" | "seller" | "search"
  ) => void;
  onSearch?: (query: string) => void;
  onCategorySelect?: (category: string) => void;
}

export function HomePage({
  onNavigate,
  onSearch,
  onCategorySelect,
}: HomePageProps) {
  const [endingSoon, setEndingSoon] = useState<AuctionItem[]>([]);
  const [mostBids, setMostBids] = useState<AuctionItem[]>([]);
  const [highestPrice, setHighestPrice] = useState<AuctionItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (url: string) => {
    try {
      const res = await fetch(url);
      const json = await res.json();
      return json.data ?? [];
    } catch (err) {
      console.error("❌ Fetch error:", err);
      return [];
    }
  }, []);

  const mapItem = (item: any): AuctionItem => ({
    id: item.id,
    title: item.title,
    image: item.image,
    category: item.category,
    currentBid: Number(item.currentBid),
    bids: Number(item.bids),
    end_time: item.end_time,
    postedDate: item.postedDate,
    auctionType: item.auctionType || "traditional",
    highestBidderId: item.highestBidderId ?? null,
    highestBidderName: item.highestBidderName ?? null,
    buyNowPrice: item.buyNowPrice ?? null,

    isHot: item.isHot,
    endingSoon: item.endingSoon,
  });

  useEffect(() => {
    const loadAll = async () => {
      const ending = await fetchData(GET_TOP_5_ENDING_SOON_API);
      const most = await fetchData(GET_TOP_5_MOST_BIDS_API);
      const high = await fetchData(GET_TOP_5_HIGHEST_PRICE_API);

      setEndingSoon(ending.map(mapItem));
      setMostBids(most.map(mapItem));
      setHighestPrice(high.map(mapItem));

      setLoading(false);
    };

    loadAll();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-16">
      <HeroBanner onSearch={onSearch} />

      <CategoryGrid
        onCategoryClick={(category) => {
          onCategorySelect?.(category);
          onNavigate?.("browse");
        }}
      />

      {/* ENDING SOON — only shows Ending Soon badge */}
      <HomeFeaturedSection
        title="Top 5 Ending Soon"
        description="Last chance to bid on these items"
        icon={Clock}
        iconGradient="from-[#f59e0b]/20 to-[#ef4444]/20"
        iconColor="text-[#f59e0b]"
        auctions={endingSoon}
        onNavigate={onNavigate}
        onViewAll={() => onNavigate?.("browse")}
      />

      {/* MOST BIDS — shows Hot badge */}
      <HomeFeaturedSection
        title="Top 5 Most Popular"
        description="Hot items with the most bids"
        icon={TrendingUp}
        iconGradient="from-[#ef4444]/20 to-[#fbbf24]/20"
        iconColor="text-[#ef4444]"
        auctions={mostBids}
        onNavigate={onNavigate}
        onViewAll={() => onNavigate?.("browse")}
      />

      {/* HIGHEST PRICE — also considered hot */}
      <HomeFeaturedSection
        title="Top 5 Highest Price"
        description="Premium luxury items"
        icon={DollarSign}
        iconGradient="from-[#fbbf24]/20 to-[#f59e0b]/20"
        iconColor="text-[#fbbf24]"
        auctions={highestPrice}
        onNavigate={onNavigate}
        onViewAll={() => onNavigate?.("browse")}
      />
    </div>
  );
}
