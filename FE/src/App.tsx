import { useState } from "react";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { HomePage } from "./components/home/HomePage";
import { BrowseItemsPage } from "./components/browse/BrowseItemsPage";
import { ProductDetailPage } from "./components/detail/ProductDetailPage";
import { DashboardPage } from "./components/dashboard/DashboardPage";

type Page = "home" | "browse" | "detail" | "dashboard";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");

  return (
    <div className="dark min-h-screen bg-background">
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
          <DashboardPage />
        )}
        
        <Footer />
      </main>
    </div>
  );
}