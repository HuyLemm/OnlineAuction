import { useState } from "react";
import { Toaster } from "sonner";
import { Header } from "./layouts/Header";
import { Footer } from "./layouts/Footer";
import { HomePage } from "./pages/HomePage";
import { BrowseItemsPage } from "./pages/BrowseItemsPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { DashboardPage } from "./pages/DashboardPage";
import { SellerPanelPage } from "./pages/SellerPanelPage";
import { OrderPage } from "./pages/OrderPage";

type Page = "home" | "browse" | "detail" | "dashboard" | "seller" | "order";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

  const handleNavigateToOrder = (orderId: string) => {
    setCurrentOrderId(orderId);
    setCurrentPage("order");
  };

  return (
    <div className="dark min-h-screen bg-background">
      <Toaster theme="dark" position="top-right" />
      <Header onNavigate={(page) => setCurrentPage(page)} currentPage={currentPage} />
      
      {/* Main Content */}
      <main className="flex-1">
        {currentPage === "home" && (
          <div className="container mx-auto px-6 py-8">
            <HomePage onNavigate={(page) => setCurrentPage(page)} />
          </div>
        )}
        
        {currentPage === "browse" && (
          <BrowseItemsPage onNavigate={(page) => setCurrentPage(page)} />
        )}
        
        {currentPage === "detail" && (
          <ProductDetailPage onBack={() => setCurrentPage("browse")} />
        )}
        
        {currentPage === "dashboard" && (
          <DashboardPage onNavigateToOrder={handleNavigateToOrder} />
        )}
        
        {currentPage === "seller" && (
          <SellerPanelPage />
        )}
        
        {currentPage === "order" && (
          <OrderPage onBack={() => setCurrentPage("dashboard")} />
        )}
        
        <Footer />
      </main>
    </div>
  );
}