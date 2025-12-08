export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash?: string;
  role?: "buyer" | "seller" | "admin";
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  categoryId: number;
  sellerId: string;
  startPrice: number;
  currentPrice: number;
  buyNowPrice?: number | null;
  endTime: string;
  createdAt: string;
  updatedAt?: string | null;
}

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  isMain: boolean;
}

export interface Bid {
  id: string;
  productId: string;
  bidderId: string;
  amount: number;
  createdAt: string;
}

export interface AutoBid {
  id: string;
  productId: string;
  bidderId: string;
  maxPrice: number;
  createdAt: string;
}
