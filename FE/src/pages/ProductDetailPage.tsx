import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { ImageGallery } from "../components/detail/ImageGallery";
import { BidSection } from "../components/detail/BidSection";
import { ProductInfo } from "../components/detail/ProductInfo";
import { SellerInfo } from "../components/detail/SellerInfo";
import { BidHistory } from "../components/detail/BidHistory";
import { QASection } from "../components/detail/QASection";
import { RelatedItems } from "../components/detail/RelatedItems";

interface ProductDetailPageProps {
  onBack?: () => void;
}

export function ProductDetailPage({ onBack }: ProductDetailPageProps) {
  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Browse
      </Button>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Image Gallery */}
        <div className="lg:col-span-2">
          <ImageGallery />
        </div>

        {/* Right Column - Bid Section */}
        <div>
          <BidSection />
        </div>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ProductInfo />
          <BidHistory />
          <QASection />
        </div>
        
        <div>
          <SellerInfo />
        </div>
      </div>

      {/* Related Items */}
      <RelatedItems />
    </div>
  );
}
