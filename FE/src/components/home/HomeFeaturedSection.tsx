import { AuctionCard } from "../auction/AuctionCard";
import { Button } from "../ui/button";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { type AuctionItem } from "../../types/dto";

interface HomeFeaturedSectionProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconGradient: string;
  iconColor: string;

  isEndingSoonSection?: boolean;
  isHotSection?: boolean;

  auctions: AuctionItem[];
  onNavigate?: (
    page: "home" | "browse" | "detail" | "dashboard" | "seller"
  ) => void;
  onViewAll?: () => void;

  onCategoryClick?: (category: string) => void;
}

export function HomeFeaturedSection({
  title,
  description,
  icon: Icon,
  iconGradient,
  iconColor,
  auctions,
  onCategoryClick,
  onNavigate,
  onViewAll,
}: HomeFeaturedSectionProps) {
  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${iconGradient}`}
          >
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <div>
            <h2 className="text-foreground">{title}</h2>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>

        <Button
          variant="ghost"
          className="gap-2 hover:text-[#fbbf24] transition-colors"
          onClick={onViewAll}
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {auctions.map((auction) => (
          <AuctionCard
            key={auction.id}
            id={auction.id}
            title={auction.title}
            image={auction.image}
            currentBid={auction.currentBid}
            bids={auction.bids}
            end_time={auction.end_time}
            category={auction.category}
            categoryId={auction.categoryId}
            highestBidderId={auction.highestBidderId}
            highestBidderName={auction.highestBidderName}
            buyNowPrice={auction.buyNowPrice}
            postedDate={auction.postedDate}
            auctionType={auction.auctionType}
            isHot={auction.isHot}
            endingSoon={auction.endingSoon}
            onCategoryClick={onCategoryClick}
            onNavigate={() => onNavigate?.("detail")}
            showCategory={true}
          />
        ))}
      </div>
    </section>
  );
}
