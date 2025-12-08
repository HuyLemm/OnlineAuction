import { useState } from "react";
import { ArrowLeft } from "lucide-react";
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

interface ProductDetailPageProps {
  onBack?: () => void;
}


export function ProductDetailPage({ onBack }: ProductDetailPageProps) {
  // Auction state
  const [currentBid, setCurrentBid] = useState(15000);
  const [userMaxBid, setUserMaxBid] = useState<number | undefined>(16000);
  const [totalBids, setTotalBids] = useState(47);

  // Mock bidders data for comparison
  const [bidders, setBidders] = useState([
    {
      id: "1",
      name: "You",
      maxBid: 16000,
      currentBid: 15000,
      isYou: true,
      isWinning: true,
    },
    {
      id: "2",
      name: "Sarah Chen",
      maxBid: 15800,
      currentBid: 14800,
      isWinning: false,
    },
    {
      id: "3",
      name: "Michael Rodriguez",
      maxBid: 15500,
      currentBid: 14500,
      isWinning: false,
    },
    {
      id: "4",
      name: "Emily Taylor",
      maxBid: 15200,
      currentBid: 14200,
      isWinning: false,
    },
  ]);

  // Mock auto-bid history
  const [autoBidEvents, setAutoBidEvents] = useState([
    {
      id: "1",
      type: "winning" as const,
      bidder: "You",
      amount: 15000,
      maxBid: 16000,
      timestamp: "2 mins ago",
      isYou: true,
      description: "Your auto-bid is currently winning the auction",
    },
    {
      id: "2",
      type: "auto_bid" as const,
      bidder: "You",
      amount: 15000,
      previousAmount: 14800,
      maxBid: 16000,
      timestamp: "15 mins ago",
      isYou: true,
      description: "Auto-bid placed to outbid Sarah Chen",
    },
    {
      id: "3",
      type: "auto_bid" as const,
      bidder: "Sarah Chen",
      amount: 14800,
      previousAmount: 14500,
      timestamp: "15 mins ago",
      description: "Auto-bid placed",
    },
    {
      id: "4",
      type: "max_bid_updated" as const,
      bidder: "You",
      amount: 16000,
      previousAmount: 15500,
      timestamp: "1 hour ago",
      isYou: true,
      description: "Updated maximum bid amount",
    },
    {
      id: "5",
      type: "auto_bid" as const,
      bidder: "You",
      amount: 14500,
      previousAmount: 14200,
      maxBid: 15500,
      timestamp: "2 hours ago",
      isYou: true,
      description: "Auto-bid placed to outbid Michael Rodriguez",
    },
    {
      id: "6",
      type: "max_bid_set" as const,
      bidder: "You",
      amount: 15500,
      timestamp: "3 hours ago",
      isYou: true,
      description: "Activated auto-bidding with maximum bid",
    },
  ]);

  // Determine bid status
  const getBidStatus = () => {
    if (!userMaxBid) return "no_bid";

    const userBidder = bidders.find((b) => b.isYou);
    if (!userBidder) return "no_bid";

    const highestBidder = bidders.reduce((prev, current) =>
      prev.maxBid > current.maxBid ? prev : current
    );

    if (userBidder.isWinning) {
      return "leading_auto";
    } else if (highestBidder.maxBid > userMaxBid) {
      return "outbid";
    } else {
      return "auto_active";
    }
  };

  const handleSetMaxBid = (amount: number) => {
    setUserMaxBid(amount);

    // Update bidders data
    const updatedBidders = bidders.map((bidder) => {
      if (bidder.isYou) {
        return { ...bidder, maxBid: amount };
      }
      return bidder;
    });

    // Determine new winning bidder
    const highestBidder = updatedBidders.reduce((prev, current) =>
      prev.maxBid > current.maxBid ? prev : current
    );

    const finalBidders = updatedBidders.map((bidder) => ({
      ...bidder,
      isWinning: bidder.id === highestBidder.id,
    }));

    setBidders(finalBidders);

    // Add event to history
    if (userMaxBid) {
      const newEvent = {
        id: Date.now().toString(),
        type: "max_bid_updated" as const,
        bidder: "You",
        amount,
        previousAmount: userMaxBid, // must be number
        timestamp: "Just now",
        isYou: true,
        description: "Updated maximum bid amount",
      };

      setAutoBidEvents([newEvent, ...autoBidEvents]);
    } else {
      const newEvent = {
        id: Date.now().toString(),
        type: "max_bid_set" as const,
        bidder: "You",
        amount,
        timestamp: "Just now",
        isYou: true,
        description: "Activated auto-bidding with maximum bid",
        // ❌ No previousAmount here
      };

      setAutoBidEvents([newEvent, ...autoBidEvents]);
    }

    // Simulate auto-bid if user is now highest
    if (highestBidder.isYou && currentBid < amount) {
      const newCurrentBid = Math.min(
        amount,
        Math.max(
          ...updatedBidders.filter((b) => !b.isYou).map((b) => b.maxBid)
        ) + 100
      );
      setCurrentBid(newCurrentBid);
    }
  };

  const highestMaxBid = Math.max(...bidders.map((b) => b.maxBid));
  const isUserWinning = bidders.find((b) => b.isYou)?.isWinning || false;

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
      <div className="space-y-2">
        <h1 className="text-foreground text-4xl">
          Rolex Submariner Date - Stainless Steel
        </h1>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Image Gallery */}
        <div className="lg:col-span-2">
          <ImageGallery />
        </div>

        {/* Right Column - Bid Section & Auto Bid */}
        <div className="space-y-6">
          <AutoBidPanel
            currentBid={currentBid}
            minimumBid={currentBid + 500}
            userMaxBid={userMaxBid}
            isUserWinning={isUserWinning}
            onSetMaxBid={handleSetMaxBid}
          />
        </div>
      </div>

      {/* Bid Status Indicator */}
      <BidStatusIndicator
        status={getBidStatus()}
        currentBid={currentBid}
        yourMaxBid={userMaxBid}
        highestMaxBid={highestMaxBid}
        nextBidAmount={highestMaxBid + 100}
      />

      {/* Auto-Bidding Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BidComparisonChart bidders={bidders} highestBid={currentBid} />
        <AutoBidHistory events={autoBidEvents} />
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ProductInfo />
          <BidHistory />
          <QASection />
        </div>

        <div>
          <SellerInfo
            name="John Doe"
            rating={4.8}
            totalSales={152}
            location="Ho Chi Minh City, Vietnam"
            memberSince="2021"
            verified={true}
            avatar="/images/avatar.png"
            topRated={true}
          />
        </div>
      </div>

      {/* Related Items */}
      <RelatedItems />
    </div>
  );
}


