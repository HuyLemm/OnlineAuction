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

    auctionType: "traditional" | "buy_now";
    buyNowPrice?: number | null;

    categoryId: number;
    categoryName: string;

    currentBid: number;
    bidStep: number;
  };

  viewer: {
    id: string;
    role: "seller" | "bidder" | "admin";
  } | null;

  images: {
    primary: string;
    gallery: string[]; // >= 3 images
  };

  seller: {
    id: string;
    name: string;

    rating: {
      score: number;
      total: number;
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
