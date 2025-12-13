import { useState, useEffect } from "react";
import { ArrowLeft, Clock, Calendar } from "lucide-react";

import { Button } from "../components/ui/button";
import { ImageGallery } from "../components/detail/ImageGallery";
import { ProductInfo } from "../components/detail/ProductInfo";
import { SellerInfo } from "../components/detail/SellerInfo";
import { BidHistory } from "../components/detail/BidHistory";
import { QASection } from "../components/detail/QASection";
import { RelatedItems } from "../components/detail/RelatedItems";
import { AutoBidPanel } from "../components/detail/AutoBidPanel";
import { BidComparisonChart } from "../components/detail/BidComparisonChart";
import { AutoBidHistory } from "../components/detail/AutoBidHistory";
import { BidStatusIndicator } from "../components/detail/BidStatusIndicator";

import { getRelativeEndTime } from "../components/utils/timeUtils";
import type { ProductDetailDTO } from "../types/dto";
import type { BidStatusDTO } from "../types/dto";
import { LoadingSpinner } from "../components/state";
import { formatPostedDate } from "../components/utils/timeUtils";

import { API_BASE_URL } from "../components/utils/api";

interface ProductDetailPageProps {
  productId: string;
  onBack?: () => void;
}

export function ProductDetailPage({
  productId,
  onBack,
}: ProductDetailPageProps) {
  const [data, setData] = useState<ProductDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);

  const [userMaxBid, setUserMaxBid] = useState<number | undefined>(undefined);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${API_BASE_URL}/products/${productId}/get-product-detail`
        );
        const json = await res.json();
        console.log(json);
        setData(json.data);
      } catch (err) {
        console.error("Failed to load product detail", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [productId]);

  if (loading || !data) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // DERIVED DATA

  const currentBid = data.currentBid;

  const bidders = data.highestBidder
    ? [
        {
          id: data.highestBidder.id,
          name: data.highestBidder.name,
          maxBid: currentBid,
          currentBid,
          isWinning: true,
        },
      ]
    : [];

  const bidStatus: BidStatusDTO = (() => {
    if (!userMaxBid) return "no_bid";

    if (data.highestBidder && userMaxBid < currentBid) {
      return "outbid";
    }

    if (data.highestBidder && userMaxBid >= currentBid) {
      return "leading_auto";
    }

    return "auto_active";
  })();

  const endTimeInfo = getRelativeEndTime(data.product.endTime);

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

      {/* Product Title Section */}
      <div className="space-y-1">
        <h1 className="text-foreground text-4xl">{data.product.title}</h1>
        <div className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Clock
              className={
                endTimeInfo.isCritical
                  ? "h-5 w-5 text-red-500"
                  : endTimeInfo.isUrgent
                  ? "h-5 w-5 text-orange-400"
                  : "h-5 w-5 text-yellow-500"
              }
            />
            <span
              className={
                endTimeInfo.isCritical
                  ? "text-red-500"
                  : endTimeInfo.isUrgent
                  ? "text-orange-400"
                  : "text-yellow-500"
              }
            >
              Ends in {endTimeInfo.formatted}
            </span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground text-lg">
            <Calendar className="h-4 w-4" />
            <span>Posted on {formatPostedDate(data.product.postedDate)}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Image Gallery */}
        <div className="lg:col-span-2">
          <ImageGallery
            images={[data.images.primary, ...data.images.gallery].filter(
              Boolean
            )}
          />
        </div>

        {/* Right Column - Bid Section & Auto Bid */}
        <div className="space-y-6">
          <AutoBidPanel
            currentBid={currentBid}
            minimumBid={currentBid + 100}
            userMaxBid={userMaxBid}
            isUserWinning={bidStatus === "leading_auto"}
            onSetMaxBid={setUserMaxBid}
          />
        </div>
      </div>

      {/* Bid Status Indicator */}
      <BidStatusIndicator
        status={bidStatus}
        currentBid={currentBid}
        yourMaxBid={userMaxBid}
      />

      {/* Auto-Bidding Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BidComparisonChart bidders={bidders} highestBid={currentBid} />
        <AutoBidHistory events={[]} />
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ProductInfo
            title={data.product.title}
            category={data.product.categoryName}
            description={data.product.description}
          />

          <BidHistory />

          <QASection
            questions={data.questions.map((q) => ({
              id: q.id,
              question: q.question.content,
              asker: q.question.askedBy.name || "User",
              askedTime: q.question.askedAt,
              answer: q.answer?.content,
              answerer: q.answer?.answeredBy.name,
              answeredTime: q.answer?.answeredAt,
              likes: 0,
            }))}
          />
        </div>

        <div>
          <SellerInfo
            name={data.seller.name}
            rating={Number(data.seller.rating.score.toFixed(1))}
            totalSales={data.seller.rating.total}
            location="Vietnam"
            memberSince={data.product.postedDate}
            verified
          />
        </div>
      </div>

      {/* Related Items */}
      <RelatedItems
        items={data.relatedProducts.map((p) => ({
          id: p.id,
          title: p.title,
          image: p.image,
          currentBid: p.currentBid,
          bids: 0,
          timeLeft: getRelativeEndTime(p.endTime).formatted,
          category: data.product.categoryName,
        }))}
      />
    </div>
  );
}
