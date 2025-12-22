import { useState } from "react";
import { SellerPanelLayout } from "../layouts/SellerPanelLayout";
import { CreateAuction } from "../components/seller/CreateAuction";
import { ManageListings } from "../components/seller/ManageListings";
import { EndedAuctionsSection } from "../components/seller/EndedAuctionsSection";
import { ProfileSettingsSection } from "../components/dashboard/ProfileSettingsSection";

export function SellerPanelPage() {
  const [activeTab, setActiveTab] = useState("manage");

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettingsSection />;
      case "create":
        return <CreateAuction />;
      case "active":
        return <ManageListings />;
      case "closed":
        return <EndedAuctionsSection />;
      default:
        return <ProfileSettingsSection />;
    }
  };

  return (
    <SellerPanelLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </SellerPanelLayout>
  );
}
