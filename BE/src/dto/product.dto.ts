export interface BrowseProductDTO {
  id: string;
  title: string;
  category: string;
  image: string;

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
  };

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

  answer?: {
    content: string;
    answeredBy: {
      id: string;
      name: string;
    };
    answeredAt: string;
  };
}

export interface RelatedProductDTO {
  id: string;
  title: string;
  image: string;

  currentBid: number;
  endTime: string;
}
