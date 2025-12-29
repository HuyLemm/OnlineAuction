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

    currentBid: number;
    bidStep: number;
  };

  viewer?: {
    id: string;
    role: "seller" | "bidder" | "admin";
  } | null;

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

  bidHistory: {
    id: string;
    amount: number;
    createdAt: string;
    bidder: {
      id: string;
      name: string;
      rating: {
        score: number;
        total: number;
      };
    };
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
    messages: {
      id: string;
      content: string;
      createdAt: string;
      sender: {
        id: string;
        name: string;
        role: "seller" | "bidder";
      };
    }[];
  }[];

  relatedProducts: {
    id: string;
    title: string;
    image: string;
    currentBid: number;
    bids: number;
    endTime: string;

    auctionType: "traditional" | "buy_now";
    buyNowPrice?: number | null;

    highestBidderName?: string | null;
    postedDate: string;
  }[];
}

export type BidStatusDTO =
  | "no_bid"
  | "outbid"
  | "auto_active"
  | "leading_auto"
  | "winning";
