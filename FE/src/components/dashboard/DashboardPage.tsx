import { useState } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { MyBids } from "./MyBids";
import { Watchlist } from "./Watchlist";
import { WonAuctions } from "./WonAuctions";
import { ProfileSettings } from "./ProfileSettings";
import { BecomeSeller } from "./BecomeSeller";

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState("my-bids");

  const renderContent = () => {
    switch (activeTab) {
      case "my-bids":
        return <MyBids />;
      case "watchlist":
        return <Watchlist />;
      case "active-auctions":
        return <MyBids />; // Reuse MyBids component
      case "won-auctions":
        return <WonAuctions />;
      case "bid-history":
        return <MyBids />; // Could create separate BidHistory component
      case "reviews":
        return <ProfileSettings />; // Placeholder - could create Reviews component
      case "settings":
        return <ProfileSettings />;
      case "become-seller":
        return <BecomeSeller />;
      default:
        return <MyBids />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
}
