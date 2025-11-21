import { ImageGallery } from "./ImageGallery";
import { ProductInfo } from "./ProductInfo";
import { BidSection } from "./BidSection";
import { SellerInfo } from "./SellerInfo";
import { BidHistory } from "./BidHistory";
import { QASection } from "./QASection";
import { RelatedItems } from "./RelatedItems";
import { ChevronLeft } from "lucide-react";
import { Button } from "../ui/button";

interface ProductDetailPageProps {
  onBack?: () => void;
}

export function ProductDetailPage({ onBack }: ProductDetailPageProps) {
  // Mock product data
  const product = {
    id: "1",
    title: "Patek Philippe Nautilus 5711/1A Steel Blue Dial - Rare Limited Edition",
    category: "Watches",
    condition: "Excellent - Pre-owned with minimal signs of wear. Serviced and authenticated by certified watchmaker. Includes original box, papers, and certificate of authenticity.",
    itemNumber: "PP5711-2024-001",
    currentBid: 156000,
    buyNowPrice: 185000,
    minimumBid: 157000,
    totalBids: 234,
    timeLeft: "1d 8h 30m",
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 32.5),
    watchers: 456,
    isHot: true,
    description: "This exceptional Patek Philippe Nautilus 5711/1A features the iconic blue dial and stainless steel case that has become synonymous with luxury sports watches. Produced in limited quantities before discontinuation, this timepiece represents the pinnacle of Swiss watchmaking excellence. The automatic movement ensures precision timekeeping, while the elegant design makes it suitable for any occasion. Complete with all original documentation and box, this watch is a true collector's piece and investment opportunity.",
    images: [
      "https://images.unsplash.com/photo-1670177257750-9b47927f68eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaHxlbnwxfHx8fDE3NjMzOTExMzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1670177257750-9b47927f68eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaHxlbnwxfHx8fDE3NjMzOTExMzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1670177257750-9b47927f68eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaHxlbnwxfHx8fDE3NjMzOTExMzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1670177257750-9b47927f68eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaHxlbnwxfHx8fDE3NjMzOTExMzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    specifications: [
      { label: "Brand", value: "Patek Philippe" },
      { label: "Model", value: "Nautilus 5711/1A-010" },
      { label: "Reference Number", value: "5711/1A" },
      { label: "Year", value: "2021" },
      { label: "Case Material", value: "Stainless Steel" },
      { label: "Case Diameter", value: "40mm" },
      { label: "Dial Color", value: "Blue" },
      { label: "Movement", value: "Automatic, Cal. 324 S C" },
      { label: "Power Reserve", value: "45 hours" },
      { label: "Water Resistance", value: "120m (12 ATM)" },
      { label: "Crystal", value: "Sapphire" },
      { label: "Bracelet", value: "Stainless Steel" },
      { label: "Clasp", value: "Fold-over" },
      { label: "Box", value: "Yes, Original" },
      { label: "Papers", value: "Yes, Complete" },
    ],
    shipping: {
      methods: [
        "Insured Express Shipping (2-3 days)",
        "International Shipping Available",
        "Signature Required on Delivery"
      ],
      cost: "Free",
      estimatedDays: "2-3 business days"
    },
    returns: "30-day return policy. Item must be returned in original condition with all accessories and documentation. Buyer pays return shipping unless item is not as described."
  };

  const seller = {
    name: "LuxuryTimepieces",
    avatar: undefined,
    rating: 4.9,
    totalSales: 1247,
    location: "Geneva, Switzerland",
    memberSince: "2015",
    verified: true,
    topRated: true
  };

  const bidHistory = [
    {
      id: "1",
      bidder: "collector_pro",
      amount: 156000,
      time: "2 minutes ago",
      isLeading: true,
      isAutoBid: true
    },
    {
      id: "2",
      bidder: "watch_enthusiast",
      amount: 155000,
      time: "15 minutes ago",
      isAutoBid: false
    },
    {
      id: "3",
      bidder: "luxury_buyer",
      amount: 154000,
      time: "1 hour ago",
      isAutoBid: true
    },
    {
      id: "4",
      bidder: "timepiece_master",
      amount: 153000,
      time: "3 hours ago",
      isAutoBid: false
    },
    {
      id: "5",
      bidder: "swiss_collector",
      amount: 152000,
      time: "5 hours ago",
      isAutoBid: true
    },
    {
      id: "6",
      bidder: "watch_investor",
      amount: 151000,
      time: "8 hours ago",
      isAutoBid: false
    },
  ];

  const questions = [
    {
      id: "1",
      question: "Does this watch come with the original warranty card?",
      asker: "john_doe",
      askedTime: "2 days ago",
      answer: "Yes, this watch includes the original warranty card from Patek Philippe, valid until 2023. All documentation is complete and authentic.",
      answerer: "LuxuryTimepieces",
      answeredTime: "2 days ago",
      likes: 12,
      isExpanded: false
    },
    {
      id: "2",
      question: "Has the watch been serviced recently? Any maintenance history?",
      asker: "watch_lover",
      askedTime: "3 days ago",
      answer: "The watch was serviced by an authorized Patek Philippe service center in January 2024. Complete service documentation is included. The movement is running perfectly within COSC standards.",
      answerer: "LuxuryTimepieces",
      answeredTime: "3 days ago",
      likes: 8,
      isExpanded: false
    },
    {
      id: "3",
      question: "What is the condition of the bracelet? Any stretch or wear?",
      asker: "collector_88",
      askedTime: "4 days ago",
      answer: "The bracelet is in excellent condition with minimal wear. There is no noticeable stretch, and all links are present. I can provide additional detailed photos if needed.",
      answerer: "LuxuryTimepieces",
      answeredTime: "4 days ago",
      likes: 5,
      isExpanded: false
    },
  ];

  const relatedItems = [
    {
      id: "r1",
      title: "Rolex Submariner 116610LN Black Dial",
      image: "https://images.unsplash.com/photo-1670177257750-9b47927f68eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaHxlbnwxfHx8fDE3NjMzOTExMzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 12500,
      bids: 45,
      timeLeft: "2d 5h",
      category: "Watches",
      isHot: true
    },
    {
      id: "r2",
      title: "Audemars Piguet Royal Oak 15400ST",
      image: "https://images.unsplash.com/photo-1670177257750-9b47927f68eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaHxlbnwxfHx8fDE3NjMzOTExMzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 28000,
      bids: 67,
      timeLeft: "1d 12h",
      category: "Watches"
    },
    {
      id: "r3",
      title: "Omega Speedmaster Professional Moonwatch",
      image: "https://images.unsplash.com/photo-1670177257750-9b47927f68eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaHxlbnwxfHx8fDE3NjMzOTExMzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 5200,
      bids: 34,
      timeLeft: "3d 8h",
      category: "Watches",
      endingSoon: false
    },
    {
      id: "r4",
      title: "IWC Pilot's Watch Big Pilot",
      image: "https://images.unsplash.com/photo-1670177257750-9b47927f68eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaHxlbnwxfHx8fDE3NjMzOTExMzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 8900,
      bids: 28,
      timeLeft: "4d 2h",
      category: "Watches"
    },
    {
      id: "r5",
      title: "Cartier Santos de Cartier Large Model",
      image: "https://images.unsplash.com/photo-1670177257750-9b47927f68eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaHxlbnwxfHx8fDE3NjMzOTExMzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      currentBid: 6500,
      bids: 42,
      timeLeft: "2d 18h",
      category: "Watches",
      isHot: true
    }
  ];

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="gap-2 -ml-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Browse
      </Button>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7">
          <ImageGallery images={product.images} title={product.title} />
        </div>

        {/* Right Column: Bid Section */}
        <div className="lg:col-span-5 space-y-6">
          <BidSection
            currentBid={product.currentBid}
            buyNowPrice={product.buyNowPrice}
            minimumBid={product.minimumBid}
            totalBids={product.totalBids}
            timeLeft={product.timeLeft}
            endDate={product.endDate}
            isHot={product.isHot}
          />
          <SellerInfo {...seller} />
        </div>
      </div>

      {/* Product Information */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <ProductInfo
            title={product.title}
            category={product.category}
            condition={product.condition}
            itemNumber={product.itemNumber}
            description={product.description}
            specifications={product.specifications}
            shipping={product.shipping}
            returns={product.returns}
            watchers={product.watchers}
          />
        </div>

        {/* Bid History */}
        <div className="lg:col-span-5">
          <BidHistory bids={bidHistory} />
        </div>
      </div>

      {/* Q&A Section */}
      <QASection questions={questions} />

      {/* Related Items */}
      <RelatedItems items={relatedItems} />
    </div>
  );
}
