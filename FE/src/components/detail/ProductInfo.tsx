import { User, Tag, Clock, Gavel, Star } from "lucide-react";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface ProductInfoProps {
  product: {
    title: string;
    description: string;
    categoryName: string;
    postedDate: string;
    endTime: string;
    auctionType: "traditional" | "buy_now";
    buyNowPrice?: number | null;
    currentBid: number;
    bidStep: number;
  };
  seller: {
    name: string;
    rating: {
      score: number;
      total: number;
    };
  };
  bidCount: number;
}

export function ProductInfo({ product, seller, bidCount }: ProductInfoProps) {
  return (
    <div className="space-y-6">
      {/* Header meta */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <Badge variant="outline" className="border-border/50">
          {product.categoryName}
        </Badge>

        <span>•</span>

        <div className="flex items-center gap-1">
          <User className="h-5 w-5 text-[#f59e0b]" />
          <span>{seller.name}</span>
        </div>

        <span>•</span>

        <div className="flex items-center gap-1">
          <Star className="h-5 w-5 text-yellow-500 fill-current" />
          <span>
            {seller.rating.score} ({seller.rating.total}{" "}
            {seller.rating.total === 1 ? "vote" : "votes"})
          </span>
        </div>

        <span>•</span>

        <div className="flex items-center gap-1">
          <Gavel className="h-5 w-5 text-[#f59e0b]" />
          <span>{bidCount} bids</span>
        </div>
      </div>

      <Separator className="bg-border/50" />

      {/* Tabs */}
      <Tabs defaultValue="description">
        <TabsList className="w-full bg-secondary/50 border border-border/50">
          <TabsTrigger value="description" className="flex-1">
            Description
          </TabsTrigger>
          <TabsTrigger value="auction" className="flex-1">
            Auction Info
          </TabsTrigger>
        </TabsList>

        {/* Description */}
        <TabsContent value="description" className="mt-4">
          <p
            className="text-foreground leading-relaxed description-content"
            dangerouslySetInnerHTML={{ __html: product.description }}
          ></p>
        </TabsContent>

        {/* Auction info */}
        <TabsContent value="auction" className="mt-4 space-y-4">
          <div className="bg-secondary/30 rounded-lg p-4 border border-border/50 space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Bid</span>
              <span className="text-foreground font-medium">
                ${product.currentBid.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Bid Step</span>
              <span className="text-foreground">
                ${product.bidStep.toLocaleString()}
              </span>
            </div>

            {product.auctionType === "buy_now" && product.buyNowPrice && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Buy Now</span>
                <span className="text-[#10b981] font-medium">
                  ${product.buyNowPrice.toLocaleString()}
                </span>
              </div>
            )}

            <Separator className="bg-border/50" />

            <div className="flex justify-between">
              <span className="text-muted-foreground">Posted</span>
              <span className="text-foreground">
                {new Date(product.postedDate).toLocaleDateString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Ends At
              </span>
              <span className="text-foreground">
                {new Date(product.endTime).toLocaleString()}
              </span>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
