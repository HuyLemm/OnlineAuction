import { useState } from "react";
import { SellerPanelLayout } from "../layouts/SellerPanelLayout";
import { CreateAuction } from "../components/seller/CreateAuction";
import { ActiveAuctions } from "../components/seller/ActiveAuctions";
import { EndedAuctions } from "../components/seller/EndedAuctions";
import { ProfileSettingsSection } from "../components/dashboard/ProfileSettingsSection";

export function SellerPanelPage() {
  const [activeTab, setActiveTab] = useState("active");
  const [activeCount, setActiveCount] = useState(0);
  const [endedCount, setEndedCount] = useState(0);

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettingsSection />;

      case "create":
        return <CreateAuction />;

      case "active":
        return (
          <ActiveAuctions
            onCreate={() => setActiveTab("create")}
            onCountChange={setActiveCount}
          />
        );

      case "closed":
        return <EndedAuctions onCountChange={setEndedCount} />;

      default:
        return <ProfileSettingsSection />;
    }
  };

  return (
    <SellerPanelLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      activeCount={activeCount}
      endedCount={endedCount}
    >
      {renderContent()}
    </SellerPanelLayout>
  );
}
