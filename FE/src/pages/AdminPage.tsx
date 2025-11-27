import { useState } from "react";
import { AdminLayout } from "../layouts/AdminLayout";
import { SystemOverviewSection } from "../components/admin/SystemOverviewSection";
import { AnalyticsSection } from "../components/admin/AnalyticsSection";
import { CategoryManagementSection } from "../components/admin/CategoryManagementSection";
import { ProductModerationSection } from "../components/admin/ProductModerationSection";
import { UserManagementSection } from "../components/admin/UserManagementSection";
import { SellerApprovalsSection } from "../components/admin/SellerApprovalsSection";
import { SystemSettingsSection } from "../components/admin/SystemSettingsSection";

export function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <SystemOverviewSection />;
      case "analytics":
        return <AnalyticsSection />;
      case "categories":
        return <CategoryManagementSection />;
      case "products":
        return <ProductModerationSection />;
      case "users":
        return <UserManagementSection />;
      case "seller-approvals":
        return <SellerApprovalsSection />;
      case "settings":
        return <SystemSettingsSection />;
      default:
        return <SystemOverviewSection />;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </AdminLayout>
  );
}