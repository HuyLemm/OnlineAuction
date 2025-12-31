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
  /* ================= Product ================= */
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

    currentBid: number; // 🔥 single source of truth
    bidStep: number;

    highestBidderId: string | null;
    bidRequirement: "qualified" | "normal";
  };

  /* ================= Viewer ================= */
  viewer?: {
    id: string;
    role: "seller" | "bidder" | "admin";

    rating?: {
      positiveRate: number;
      totalVotes: number;
      positiveVotes: number;
    };

    bidEligibility?: {
      requirement: "normal" | "qualified";
      status: "allowed" | "need_approval" | "blocked" | "pending";
      reason?: string;
    };
  } | null;

  /* ================= My Auto Bid ================= */
  myAutoBid: {
    maxPrice: number;
    createdAt: string;
  } | null;

  isWinning: boolean;

  /* ================= Images ================= */
  images: {
    primary: string;
    gallery: string[];
  };

  /* ================= Seller ================= */
  seller: {
    id: string;
    name: string;

    rating: {
      score: number;
      total: number;
    };

    totalSales: number;

    positive: {
      rate: number;
      votes: number;
    };
  };

  /* ================= Highest Bidder ================= */
  highestBidder: {
    id: string;
    name: string;
    rating: {
      score: number;
      total: number;
    };
  } | null;

  /* ================= Auto Bids (MAX PRICE) ================= */
  autoBids: {
    id: string;
    bidderId: string;
    bidderName: string;
    maxPrice: number; // 🔥 rename from maxBid
    createdAt: string;
  }[];

  /* ================= Auto Bid Events (SYSTEM LOG) ================= */
  autoBidEvents: {
    id: string;
    type:
      | "auto_bid"
      | "max_bid_set"
      | "max_bid_updated"
      | "outbid_instantly"
      | "tie_break_win"
      | "winning";
    bidderId: string;
    bidderName: string;
    amount?: number; // current_price at that moment
    maxBid?: number; // max_price when set/update
    createdAt: string;
    isYou?: boolean;
    description: string;
  }[];

  /* ================= Bid History (PRICE HISTORY) ================= */
  bidHistory: {
    id: string;
    amount: number; // 🔥 current_price history only
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

  /* ================= Questions ================= */
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

  /* ================= Related ================= */
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

export type AutoBidEventType =
  | "max_bid_set"
  | "max_bid_updated"
  | "auto_bid"
  | "outbid_instantly"
  | "tie_break_win"
  | "winning";

export interface AutoBidEventDTO {
  id: string;
  type: AutoBidEventType;
  bidderId: string;
  bidderName: string;
  amount?: number;
  maxBid?: number;
  createdAt: string;
  isYou: boolean;
  description: string;
  relatedBidderId: string;
}
