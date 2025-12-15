import { useState, useEffect } from "react";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

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
import { PriceDisplay } from "../components/detail/PriceDisplay";

import {
  getRelativeEndTime,
  formatPostedDate,
} from "../components/utils/timeUtils";

import type { ProductDetailDTO, BidStatusDTO } from "../types/dto";
import { LoadingSpinner } from "../components/state";
import { API_BASE_URL } from "../components/utils/api";
import { toast } from "sonner";

export function ProductDetailPage() {
  const { id: productId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<ProductDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [userMaxBid, setUserMaxBid] = useState<number | undefined>(undefined);

  /* ---------------- Fetch product detail ---------------- */
  useEffect(() => {
    if (!productId) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${API_BASE_URL}/products/${productId}/get-product-detail`
        );
        const json = await res.json();
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

  /* ---------------- Derived data ---------------- */
  const currentBid = data.product.currentBid;
  const bidStep = data.product.bidStep;
  const buyNowPrice = data.product.buyNowPrice;

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
    if (data.highestBidder && userMaxBid < currentBid) return "outbid";
    if (data.highestBidder && userMaxBid >= currentBid) return "leading_auto";
    return "auto_active";
  })();

  const endTimeInfo = getRelativeEndTime(data.product.endTime);

  /* ---------------- Actions ---------------- */
  const handleBuyNow = () => {
    toast.success("🎉 Purchase successful!", {
      description: "Redirecting to checkout...",
      duration: 3000,
    });

    setTimeout(() => {
      console.log("Redirecting to checkout...");
    }, 2000);
  };

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/browse");
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      {/* Back */}
      <Button
        variant="ghost"
        onClick={handleBack}
        className="text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-foreground text-4xl">
          {data.product.title}
        </h1>

        <div className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Clock
              className={
                endTimeInfo.isCritical
                  ? "text-red-500"
                  : endTimeInfo.isUrgent
                  ? "text-orange-400"
                  : "text-yellow-500"
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

          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Posted on {formatPostedDate(data.product.postedDate)}
            </span>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ImageGallery
            images={[data.images.primary, ...data.images.gallery].filter(
              Boolean
            )}
          />
        </div>

        <div className="space-y-6">
          <AutoBidPanel
            currentBid={currentBid}
            bidStep={bidStep}
            userMaxBid={userMaxBid}
            isUserWinning={bidStatus === "leading_auto"}
            onSetMaxBid={setUserMaxBid}
          />
          <PriceDisplay
            currentPrice={currentBid}
            buyNowPrice={buyNowPrice}
            onBuyNow={handleBuyNow}
          />
        </div>
      </div>

      <BidStatusIndicator
        status={bidStatus}
        currentBid={currentBid}
        yourMaxBid={userMaxBid}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BidComparisonChart bidders={bidders} highestBid={currentBid} />
        <AutoBidHistory events={[]} />
      </div>

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

        <SellerInfo
          name={data.seller.name}
          rating={Number(data.seller.rating.score.toFixed(1))}
          totalSales={data.seller.rating.total}
          location="Vietnam"
          memberSince={data.product.postedDate}
          verified
        />
      </div>

      {/* Related */}
      <RelatedItems
        items={data.relatedProducts.map((p) => ({
          id: p.id,
          title: p.title,
          image: p.image,
          currentBid: p.currentBid,
          bids: p.bids ?? 0,
          end_time: p.endTime,
          category: data.product.categoryName,
          categoryId: String(data.product.categoryId),
          auctionType: p.auctionType ?? "traditional",
          buyNowPrice: p.buyNowPrice ?? null,
          highestBidderName: p.highestBidderName ?? null,
          postedDate: p.postedDate ?? data.product.postedDate,
        }))}
      />
    </div>
  );
}
