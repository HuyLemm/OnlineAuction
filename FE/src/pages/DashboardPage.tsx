import { useState } from "react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { MyBidsSection } from "../components/dashboard/MyBidsSection";
import { WatchlistSection } from "../components/dashboard/WatchlistSection";
import { WonAuctionsSection } from "../components/dashboard/WonAuctionsSection";
import { ProfileSettingsSection } from "../components/dashboard/ProfileSettingsSection";
import { BecomeSellerSection } from "../components/dashboard/BecomeSellerSection";

interface DashboardPageProps {
  onNavigateToOrder?: (orderId: string) => void;
}

export function DashboardPage({ onNavigateToOrder }: DashboardPageProps) {
  const [activeTab, setActiveTab] = useState("my-bids");

  const renderContent = () => {
    switch (activeTab) {
      case "my-bids":
        return <MyBidsSection />;
      case "watchlist":
        return <WatchlistSection />;
      case "active-auctions":
        return <MyBidsSection />; // Reuse MyBidsSection component
      case "won-auctions":
        return <WonAuctionsSection onNavigateToOrder={onNavigateToOrder} />;
      case "bid-history":
        return <MyBidsSection />; // Could create separate BidHistorySection component
      case "reviews":
        return <ProfileSettingsSection />; // Placeholder - could create ReviewsSection component
      case "settings":
        return <ProfileSettingsSection />;
      case "become-seller":
        return <BecomeSellerSection />;
      default:
        return <MyBidsSection />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
}