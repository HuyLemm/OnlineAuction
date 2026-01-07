export interface RateBuyerInput {
  sellerId: string;
  orderId: string;
  score: 1 | -1;
  comment: string;
}