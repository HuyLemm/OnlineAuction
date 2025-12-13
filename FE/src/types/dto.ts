export interface AuctionItemDTO {
  id: string;
  title: string;
  image: string;
  category: string;
  categoryId: string;

  currentBid: number;
  bids: number;

  end_time: string;
  postedDate: string;
  description?: string;

  auctionType: "traditional" | "buy_now";

  highestBidderId?: string | null;
  highestBidderName?: string | null;
  buyNowPrice?: number | null;

  isHot?: boolean;
  endingSoon?: boolean;
}

export interface CategoryTreeDTO {
  id: number;
  label: string;
  count: number;
  subcategories: {
    id: number;
    label: string;
    count: number;
  }[];
}

export interface ProductDetailDTO {
  product: {
    id: string;
    title: string;
    description: string;

    postedDate: string;
    endTime: string;

    auctionType: "traditional" | "buy_now";
    buyNowPrice?: number | null;

    categoryId: number;
    categoryName: string;
  };

  images: {
    primary: string;
    gallery: string[];
  };

  seller: {
    id: string;
    name: string;
    rating: {
      score: number;
      total: number;
    };
  };

  currentBid: number;

  highestBidder?: {
    id: string;
    name: string;
    rating: {
      score: number;
      total: number;
    };
  };

  autoBids: {
    id: string;
    bidderId: string;
    bidderName: string;
    maxBid: number;
    createdAt: string;
  }[];

  questions: {
    id: string;
    question: {
      content: string;
      askedBy: {
        id: string;
        name: string;
      };
      askedAt: string;
    };

    answer?: {
      content: string;
      answeredBy: {
        id: string;
        name: string;
      };
      answeredAt: string;
    };
  }[];

  relatedProducts: {
    id: string;
    title: string;
    image: string;
    currentBid: number;
    endTime: string;
  }[];
}

export type BidStatusDTO =
  | "no_bid"
  | "outbid"
  | "auto_active"
  | "leading_auto"
  | "winning";
