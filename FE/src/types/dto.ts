export interface AuctionItem {
  id: string;
  title: string;
  image: string;
  category: string;

  currentBid: number;
  bids: number;

  end_time: string; 
  postedDate: string;
  description: string;

  auctionType: "traditional" | "buy_now";

  highestBidderId?: string | null;
  highestBidderName?: string | null;
  buyNowPrice?: number | null;

  isHot?: boolean;
  endingSoon?: boolean;
}

export interface Category {
  id: number;
  name: string;
  count: number;
  icon?: React.ReactNode;
  image?: string;
}

export interface CategoryTree {
  id: number;
  label: string;
  count: number;
  subcategories: {
    id: number;
    label: string;
    count: number;
  }[];
}
