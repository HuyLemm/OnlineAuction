// src/dto/home.dto.ts

export interface HomeProductDTO {
  id: string;
  title: string;

  category: string;
  categoryId: string;

  image: string;

  postedDate: string;
  end_time: string;

  auctionType: "traditional" | "buy_now";
  buyNowPrice: number | null;

  currentBid: number;
  bids: number;

  highestBidderId: string | null;
  highestBidderName: string | null;

  isHot: boolean;
  endingSoon: boolean;
}
