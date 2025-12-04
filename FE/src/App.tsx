import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { Header } from "./layouts/Header";
import { Footer } from "./layouts/Footer";
import { HomePage } from "./pages/HomePage";
import { BrowseItemsPage } from "./pages/BrowseItemsPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { DashboardPage } from "./pages/DashboardPage";
import { SellerPanelPage } from "./pages/SellerPanelPage";
import { OrderPage } from "./pages/OrderPage";
import { AdminPage } from "./pages/AdminPage";
import { LoginPage } from "./pages/LoginPage";
import { OTPVerificationPage } from "./pages/OTPVerificationPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import { StateExamplesPage } from "./pages/StateExamplesPage";
import { DevTools } from "./components/dev/DevTools";

type Page = "home" | "browse" | "detail" | "dashboard" | "seller" | "order" | "admin" | "login" | "otp-verification" | "forgot-password" | "notifications" | "search" | "state-examples";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Set to true for demo/testing
  const [userEmail, setUserEmail] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMainCategory, setSelectedMainCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Scroll to top on page navigation
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Instant scroll, no animation
    });
  }, [currentPage]); // Trigger on every page change

  const handleNavigateToOrder = (orderId: string) => {
    setCurrentOrderId(orderId);
    setCurrentPage("order");
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage("home");
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    
    // Parse the category string to extract main and sub categories
    // Format: "Main Category ➡️ Sub Category"
    const parts = category.split(" ➡️ ");
    if (parts.length === 2) {
      setSelectedMainCategory(parts[0].trim());
      setSelectedSubCategory(parts[1].trim());
    }
    
    setCurrentPage("browse");
  };

  const handleNavigate = (page: Page) => {
    if (page === "browse" && !selectedCategory) {
      setSelectedCategory(null); // Clear category when navigating to browse without a category
    }
    setCurrentPage(page);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage("search");
  };

  return (
    <div className="dark min-h-screen bg-background">
      <Toaster theme="dark" position="top-right" />
      <Header 
        onNavigate={handleNavigate} 
        currentPage={currentPage}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        onCategorySelect={handleCategorySelect}
        onSearch={handleSearch}
        currentSearchQuery={currentPage === "search" ? searchQuery : ""}
      />
      
      {/* Main Content */}
      <main className="flex-1">
        {currentPage === "home" && (
          <div className="container mx-auto px-6 py-8">
            <HomePage 
              onNavigate={(page) => setCurrentPage(page)} 
              onSearch={handleSearch}
              onCategorySelect={handleCategorySelect}
            />
          </div>
        )}
        
        {currentPage === "browse" && (
          <BrowseItemsPage 
            onNavigate={(page) => setCurrentPage(page)} 
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />
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
        
        {currentPage === "admin" && (
          <AdminPage />
        )}

        {currentPage === "login" && (
          <LoginPage onNavigate={(page) => setCurrentPage(page)} />
        )}

        {currentPage === "otp-verification" && (
          <OTPVerificationPage 
            onNavigate={(page) => setCurrentPage(page)}
            email={userEmail}
          />
        )}

        {currentPage === "forgot-password" && (
          <ForgotPasswordPage onNavigate={(page) => setCurrentPage(page)} />
        )}

        {currentPage === "notifications" && (
          <NotificationsPage onBack={() => setCurrentPage("home")} />
        )}
        
        {currentPage === "search" && (
          <SearchResultsPage 
            initialQuery={searchQuery}
            onNavigate={(page) => setCurrentPage(page)}
          />
        )}
        
        {currentPage === "state-examples" && (
          <StateExamplesPage />
        )}
        
        {!["login", "otp-verification", "forgot-password"].includes(currentPage) && (
          <Footer />
        )}
      </main>
      
      {/* Dev Tools - Floating button to access demo pages */}
      <DevTools onNavigate={(page) => setCurrentPage(page as Page)} />
    </div>
  );
}