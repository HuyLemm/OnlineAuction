import { useState } from "react";
import { AdminLayout } from "../layouts/AdminLayout";
import { ProfileSettingsSection } from "../components/dashboard/ProfileSettingsSection";
import { CategoryManagementSection } from "../components/admin/CategoryManagementSection";
import { ProductManagementSection } from "../components/admin/ProductManagementSection";
import { UserManagementSection } from "../components/admin/UserManagementSection";

export function AdminPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettingsSection />;
      case "categories":
        return <CategoryManagementSection />;
      case "products":
        return <ProductManagementSection />;
      case "users":
        return <UserManagementSection />;
      default:
        return <ProfileSettingsSection />;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </AdminLayout>
  );
}
