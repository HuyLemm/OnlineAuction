export interface UserDTO {
  id: string;
  username: string;
  email: string;
  passwordHash?: string;
  role?: "buyer" | "seller" | "admin";
  createdAt: string;
}

export interface ProductDTO {
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

export interface ProductImageDTO {
  id: string;
  productId: string;
  imageUrl: string;
  isMain: boolean;
}

export interface BidDTO {
  id: string;
  productId: string;
  bidderId: string;
  amount: number;
  createdAt: string;
}

export interface AutoBidDTO {
  id: string;
  productId: string;
  bidderId: string;
  maxPrice: number;
  createdAt: string;
}

export interface CategoryDTO {
  id: number;
  name: string;
  count: number;
  icon?: React.ReactNode;
  image?: string;
}