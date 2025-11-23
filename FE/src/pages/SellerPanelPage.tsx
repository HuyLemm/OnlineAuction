import { useState } from "react";
import { SellerPanelLayout } from "../layouts/SellerPanelLayout";
import { CreateAuction } from "../components/seller/CreateAuction";
import { ManageListings } from "../components/seller/ManageListings";
import { SellerOverviewSection } from "../components/seller/SellerOverviewSection";
import { EndedAuctionsSection } from "../components/seller/EndedAuctionsSection";
import { SellerRatingsSection } from "../components/seller/SellerRatingsSection";
import { QAManagementSection } from "../components/seller/QAManagementSection";
import { SellerSettingsSection } from "../components/seller/SellerSettingsSection";

export function SellerPanelPage() {
  const [activeTab, setActiveTab] = useState("manage");

  const renderContent = () => {
    switch (activeTab) {
      case "create":
        return <CreateAuction />;
      case "manage":
        return <ManageListings />;
      case "overview":
        return <SellerOverviewSection />;
      case "ended":
        return <EndedAuctionsSection />;
      case "ratings":
        return <SellerRatingsSection />;
      case "qa":
        return <QAManagementSection />;
      case "settings":
        return <SellerSettingsSection />;
      default:
        return <ManageListings />;
    }
  };

  return (
    <SellerPanelLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </SellerPanelLayout>
  );
}
