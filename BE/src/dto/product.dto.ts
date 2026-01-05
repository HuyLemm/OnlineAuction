export interface BrowseProductDTO {
  id: string;
  title: string;
  category: string;
  categoryId: string;
  image: string;

  description?: string;

  postedDate: string;
  end_time: string;

  auctionType: "traditional" | "buy_now";
  buyNowPrice?: number | null;

  currentBid: number;
  bids: number;

  highestBidderId?: string | null;
  highestBidderName?: string | null;

  isHot: boolean;
  endingSoon: boolean;
}

export interface ProductDetailDTO {
  product: {
    id: string;
    title: string;
    description: string;

    postedDate: string;
    endTime: string;
    status: "active" | "closed" | "expired";

    auctionType: "traditional" | "buy_now";
    buyNowPrice?: number | null;

    categoryId: number;
    categoryName: string;

    currentBid: number;
    bidStep: number;

    highestBidderId: string | null;
    bidRequirement: "qualified" | "normal";
  };

  viewer: {
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

  blockedBidderIds: string[];

  myAutoBid: {
    maxPrice: number;
    createdAt: string;
  } | null;

  isWinning: boolean;

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

    totalSales: number;

    positive: {
      rate: number;
      votes: number;
    };
  };

  highestBidder?: {
    id: string;
    name: string;

    rating: {
      score: number;
      total: number;
    };
  };

  autoBidEvents: AutoBidEventDTO[];

  autoBids: AutoBidDTO[];

  bidHistory: BidHistoryDTO[];

  questions: QuestionWithAnswerDTO[];

  relatedProducts: RelatedProductDTO[];
}

export interface AutoBidDTO {
  id: string;
  bidderId: string;
  bidderName: string;

  maxBid: number;
  createdAt: string;
}

export interface QuestionWithAnswerDTO {
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
}

export interface RelatedProductDTO {
  id: string;
  title: string;
  image: string;

  currentBid: number;
  bids: number;

  endTime: string;

  auctionType: "traditional" | "buy_now";
  buyNowPrice?: number | null;

  postedDate: string;

  category: string;
  categoryId: number;

  highestBidderName?: string | null;
}

export interface BidHistoryDTO {
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
}

export interface CreateAuctionDTO {
  title: string;
  categoryId: string;
  sellerId: string;

  startPrice: number;
  bidStep: number;
  buyNowPrice?: number | null;

  description: string;
  auctionType: "traditional" | "buy_now";

  bidRequirement: "normal" | "qualified";

  durationMinutes: number;

  autoExtend: boolean;

  images: {
    url: string;
    isMain: boolean;
  }[];

  uploadSessionId?: string;
}

export interface SellerActiveProductDTO {
  id: string;
  title: string;
  category: string;
  description: string;

  currentBid: number;
  startingBid: number;
  bid_count: string;
  bid_step: number;

  buyNowPrice: number | null;

  image: string | null;

  endDate: string;
  timeLeft: number;
}

export interface EndedAuctionRow {
  id: string;
  title: string;

  current_price: number;
  end_time: Date;

  image: string | null;

  buyer_id: string;
  buyer_name: string;

  buyer_rating_score: number;
  buyer_rating_total: number;
}

export type AutoBidEventType =
  | "max_bid_set"
  | "max_bid_updated"
  | "auto_bid"
  | "outbid_instantly"
  | "tie_break_win"
  | "winning"
  | "kicked";

export interface AutoBidEventDTO {
  id: string;
  type: AutoBidEventType;
  bidderId: string;
  bidderName: string;
  amount?: number; // giá THỰC (từ bids)
  maxBid?: number; // chỉ hiện cho owner
  createdAt: string;
  isYou: boolean;
  description: string;
  relatedBidderId: string;
}

export const AUTO_BID_EVENT_DESCRIPTION: Record<AutoBidEventType, string> = {
  max_bid_set: "Set maximum auto bid",
  max_bid_updated: "Updated maximum auto bid",
  auto_bid: "System automatically placed a bid",
  outbid_instantly: "Your bid was instantly surpassed",
  tie_break_win: "You are leading due to earlier max bid",
  winning: "Currently leading the auction",
  kicked: "Bidder was removed by seller during auction",
};

export type AutoBidEventRow = {
  id: string;
  type: AutoBidEventType;
  bidderId: string;
  bidderName: string;
  amount: number | null;
  maxBid: number | null;
  createdAt: Date;
  relatedBidderId: string;
};

export type ViewerDTO = {
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
};

export interface SubmitPaymentInput {
  orderId: string;
  buyerId: string;
  invoiceCode: string;
  shippingAddress: string;
  phoneNumber: string;
  description?: string;
}

export interface CreateShipmentInput {
  orderId: string;
  sellerId: string;
  shipping_code: string;
  shipping_provider?: string;
  note?: string;
}
