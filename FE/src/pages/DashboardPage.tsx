import { useState } from "react";
import { DashboardLayout } from "../layouts/DashboardLayout";

import { ProfileSettingsSection } from "../components/dashboard/ProfileSettingsSection";
import { WatchlistSection } from "../components/dashboard/WatchlistSection";
import { MyBidsSection } from "../components/dashboard/MyBidsSection";
import { WonAuctionsSection } from "../components/dashboard/WonAuctionsSection";
import { BecomeSellerSection } from "../components/dashboard/BecomeSellerSection";
import { MyReviewsSection } from "../components/dashboard/MyReviewsSection";

interface DashboardPageProps {
  onNavigateToOrder?: (orderId: string) => void;
}

export function DashboardPage({ onNavigateToOrder }: DashboardPageProps) {
  const [activeTab, setActiveTab] = useState("profile");

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettingsSection />;

      case "reviews":
        return <MyReviewsSection />;

      case "watchlist":
        return <WatchlistSection />;

      case "active-bids":
        return <MyBidsSection />;

      case "won-auctions":
        return <WonAuctionsSection onNavigateToOrder={onNavigateToOrder} />;

      case "become-seller":
        return <BecomeSellerSection />;

      default:
        return <ProfileSettingsSection />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
}
