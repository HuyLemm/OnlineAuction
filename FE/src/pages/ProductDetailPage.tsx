import { useState, useEffect } from "react";
import { ArrowLeft, Clock, Calendar, Heart, HeartOff } from "lucide-react";
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
import { QualifiedNotice } from "../components/detail/QualifiedNotice";
import { PendingApprovalNotice } from "../components/detail/PendingApprovalNotice";
import { SellerBidRequestPanel } from "../components/detail/SellerBidRequestPanel";
import { SellerBidderPanel } from "../components/detail/SellerBidderPanel";
import { AuctionEndedPanel } from "../components/detail/AuctionEndedPanel";

import {
  getRelativeEndTime,
  formatPostedDate,
} from "../components/utils/timeUtils";

import type { ProductDetailDTO, BidStatusDTO } from "../types/dto";
import { LoadingSpinner } from "../components/state";
import { toast } from "sonner";

import { fetchWithAuth } from "../components/utils/fetchWithAuth";
import {
  ADD_TO_WATCHLIST_API,
  REMOVE_FROM_WATCHLIST_API,
  GET_WATCHLIST_ID_API,
  GET_PRODUCT_DETAIL_API,
  PLACE_AUTOBID_API,
  REQUEST_BIDS_API,
  BUY_NOW_API,
} from "../components/utils/api";

import { formatCurrency } from "../lib/utils";
import { AuctionTypeBadge } from "../components/detail/AuctionTypeBadge";

export function ProductDetailPage() {
  const { id: productId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [watchlistIds, setWatchlistIds] = useState<Set<string>>(new Set());

  const [data, setData] = useState<ProductDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [userMaxBid, setUserMaxBid] = useState<number | undefined>(undefined);

  const [autoBidLoading, setAutoBidLoading] = useState(false);

  useEffect(() => {
    const loadWatchlistIds = async () => {
      try {
        const res = await fetchWithAuth(GET_WATCHLIST_ID_API);
        const data = await res.json();
        setWatchlistIds(new Set(data.data));
      } catch {}
    };

    loadWatchlistIds();
  }, []);

  /* ---------------- Fetch product detail ---------------- */
  useEffect(() => {
    if (!productId) return;
    const checkFavorite = async () => {
      try {
        const res = await fetchWithAuth(GET_WATCHLIST_ID_API);
        const json = await res.json();
        const ids: string[] = json.data ?? [];
        setIsFavorite(ids.includes(productId));
      } catch {
        // chưa login → bỏ qua
      }
    };
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await fetchWithAuth(GET_PRODUCT_DETAIL_API(productId));
        const json = await res.json();
        setData(json.data);
        console.log(json);
      } catch (err) {
        console.error("Failed to load product detail", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    checkFavorite();
  }, [productId]);

  useEffect(() => {
    if (data?.myAutoBid) {
      setUserMaxBid(data.myAutoBid.maxPrice);
    } else {
      setUserMaxBid(undefined);
    }
  }, [data?.myAutoBid]);

  const handleBuyNow = async () => {
    try {
      const res = await fetchWithAuth(BUY_NOW_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message);

      toast.success("🎉 Purchase successful!", {
        description: "Redirecting to checkout...",
      });

      // refresh product
      const refreshed = await fetchWithAuth(GET_PRODUCT_DETAIL_API(productId!));
      const refreshedJson = await refreshed.json();
      setData(refreshedJson.data);
    } catch (err: any) {
      toast.error(err.message || "Buy now failed");
    }
  };

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        await fetchWithAuth(`${REMOVE_FROM_WATCHLIST_API}/${productId}`, {
          method: "DELETE",
        });
        setIsFavorite(false);
        toast.success("Removed from watchlist");
      } else {
        await fetchWithAuth(ADD_TO_WATCHLIST_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        setIsFavorite(true);
        toast.success("Added to watchlist");
      }
    } catch {
      toast.warning("You are not authorized to perform this action");
    }
  };

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

  const isExpired = data.product.status === "expired";
  const isClosed = data.product.status === "closed";

  const highestBidder = data.highestBidder;
  const highestBidderName = highestBidder?.name;

  /**
   * 🔥 Build bidders list from bidHistory
   * - gộp theo bidder
   * - lấy maxBid cao nhất của mỗi user
   */
  const bidderMap = new Map<
    string,
    {
      id: string;
      name: string;
      maxBid: number;
      rating: any;
    }
  >();

  data.bidHistory.forEach((b) => {
    const existing = bidderMap.get(b.bidder.id);
    if (!existing || b.amount > existing.maxBid) {
      bidderMap.set(b.bidder.id, {
        id: b.bidder.id,
        name: b.bidder.name,
        maxBid: b.amount,
        rating: b.bidder.rating,
      });
    }
  });

  const currentUserId = data.viewer?.id;
  const currentUserRole = data.viewer?.role;

  const blockedSet = new Set(data.blockedBidderIds ?? []);
  const bidders = Array.from(bidderMap.values()).map((b) => ({
    ...b,
    currentBid,
    isWinning: b.id === data.product.highestBidderId,
    isYou: !!currentUserId && b.id === currentUserId,
    isBlocked: blockedSet.has(b.id),
  }));

  const bidStatus: BidStatusDTO = (() => {
    if (!userMaxBid) return "no_bid";
    if (!data.product.highestBidderId) return "auto_active";
    if (data.product.highestBidderId !== data.viewer?.id) return "outbid";
    return "leading_auto";
  })();

  const endTimeInfo = getRelativeEndTime(data.product.endTime);

  const auctionRequirement = data.product.bidRequirement ?? "normal";

  const viewer = data.viewer;
  const bidEligibility = viewer?.bidEligibility;

  const isSeller = viewer?.role === "seller";
  const isBidder = viewer?.role === "bidder";

  // bidder
  const canBid = bidEligibility?.status === "allowed";
  const needApproval = bidEligibility?.status === "need_approval";
  const isPending = bidEligibility?.status === "pending";
  const isBlocked = bidEligibility?.status === "blocked";

  /* ---------------- Actions ---------------- */
  const handlePlaceAutoBid = async (maxBid: number) => {
    try {
      setAutoBidLoading(true);

      const res = await fetchWithAuth(PLACE_AUTOBID_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          maxPrice: maxBid,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to place auto bid");
      }

      const refreshed = await fetchWithAuth(GET_PRODUCT_DETAIL_API(productId!));
      const refreshedJson = await refreshed.json();
      setData(refreshedJson.data);

      // Update local max bid
      setUserMaxBid(maxBid);

      toast.success(
        `Auto-bidding activated with maximum of ${formatCurrency(maxBid)}`
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to place auto bid");
    } finally {
      setAutoBidLoading(false);
    }
  };

  const handleSendBidRequest = async () => {
    try {
      await fetchWithAuth(REQUEST_BIDS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          message: "I'd like to participate in this auction",
        }),
      });

      toast.success("Request sent to seller");
    } catch (err: any) {
      toast.error(err.message || "Failed to send request");
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/browse");
  };

  const refetchProductDetail = async () => {
    if (!productId) return;

    const res = await fetchWithAuth(GET_PRODUCT_DETAIL_API(productId));
    const json = await res.json();
    setData(json.data);
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
        <div className="flex items-start justify-between gap-4">
          {/* LEFT: Title + Badge */}
          <div className="flex items-center gap-3">
            <h1 className="text-foreground text-4xl leading-tight">
              {data.product.title}
            </h1>

            <AuctionTypeBadge requirement={auctionRequirement} />
          </div>

          {/* RIGHT: Favorite */}
          <Button
            variant="ghost"
            onClick={handleToggleFavorite}
            className="flex items-center gap-2 mt-1 px-3 hover:bg-transparent"
          >
            {isFavorite ? (
              <>
                <HeartOff className="h-5 w-5 text-red-500 fill-current" />
                <span className="text-lg font-medium text-yellow-500">
                  Remove from favourite
                </span>
              </>
            ) : (
              <>
                <Heart className="h-5 w-5 text-red-500 fill-current" />
                <span className="text-lg font-medium text-yellow-500">
                  Add to favourite
                </span>
              </>
            )}
          </Button>
        </div>

        {/* Time & Posted */}
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
            <span>Posted on {formatPostedDate(data.product.postedDate)}</span>
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
          {/* ================= AUCTION ENDED ================= */}
          {(isClosed || isExpired) && (
            <AuctionEndedPanel
              status={isExpired ? "expired" : "closed"}
              finalPrice={currentBid}
              highestBidderId={data.product.highestBidderId}
              highestBidderName={highestBidderName}
              isWinner={data.product.highestBidderId === currentUserId}
            />
          )}

          {/* ================= SELLER VIEW ================= */}
          {!isClosed && !isExpired && isSeller && (
            <SellerBidRequestPanel productId={data.product.id} />
          )}

          {/* ================= BIDDER VIEW ================= */}
          {!isClosed && !isExpired && isBidder && (
            <>
              {canBid && (
                <AutoBidPanel
                  currentBid={currentBid}
                  bidStep={bidStep}
                  userMaxBid={userMaxBid}
                  isUserWinning={bidStatus === "leading_auto"}
                  onSetMaxBid={handlePlaceAutoBid}
                  loading={autoBidLoading}
                />
              )}

              {needApproval && (
                <QualifiedNotice
                  type="need_approval"
                  reason={bidEligibility?.reason}
                  onSendRequest={handleSendBidRequest}
                />
              )}

              {isPending && <PendingApprovalNotice />}

              {isBlocked && (
                <QualifiedNotice
                  type="blocked"
                  reason={bidEligibility?.reason}
                  rating={data.viewer?.rating}
                />
              )}
            </>
          )}

          {/* ================= PRICE / SELLER PANEL ================= */}
          {!isClosed &&
            !isExpired &&
            (isSeller ? (
              <SellerBidderPanel
                productId={data.product.id}
                currentPrice={currentBid}
                highestBidderId={data.product.highestBidderId}
                onKickSuccess={refetchProductDetail}
              />
            ) : (
              <PriceDisplay
                currentPrice={currentBid}
                buyNowPrice={buyNowPrice}
                onBuyNow={canBid ? handleBuyNow : undefined}
              />
            ))}
        </div>
      </div>

      <BidStatusIndicator
        status={bidStatus}
        currentBid={currentBid}
        yourMaxBid={userMaxBid}
      />

      {/* 🔥 Comparison + Auto Bid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BidComparisonChart bidders={bidders} />
        <AutoBidHistory
          events={data.autoBidEvents}
          currentUserId={currentUserId}
          currentUserRole={currentUserRole}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ProductInfo
            product={data.product}
            seller={data.seller}
            bidCount={data.bidHistory.length}
          />

          {/* 🔥 Bid history real data */}
          <BidHistory
            bids={data.bidHistory}
            blockedBidderIds={data.blockedBidderIds}
          />

          <QASection
            questions={data.questions}
            productId={data.product.id}
            currentUserRole={data.viewer?.role ?? null}
            onQuestionSubmitted={async () => {
              refetchProductDetail();
            }}
          />
        </div>

        <SellerInfo
          name={data.seller.name}
          rating={data.seller.rating}
          totalSales={data.seller.totalSales}
          positive={data.seller.positive ?? { rate: 0, votes: 0 }}
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
        watchlistIds={watchlistIds}
        setWatchlistIds={setWatchlistIds}
      />
    </div>
  );
}
