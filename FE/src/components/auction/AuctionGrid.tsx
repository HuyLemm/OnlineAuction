import { AuctionCard } from "./AuctionCard";

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

interface AuctionGridProps {
  auctions: AuctionItem[];
  title?: string;
}

export function AuctionGrid({ auctions, title }: AuctionGridProps) {
  return (
    <div className="space-y-6">
      {title && <h2 className="text-foreground">{title}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {auctions.map((auction) => (
          <AuctionCard key={auction.id} {...auction} />
        ))}
      </div>
    </div>
  );
}
