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
import { SearchResultsPage } from "./pages/SearchResultsPage";
import { StateExamplesPage } from "./pages/StateExamplesPage";
import { DevTools } from "./components/dev/DevTools";

type Page =
  | "home"
  | "browse"
  | "detail"
  | "dashboard"
  | "seller"
  | "order"
  | "admin"
  | "login"
  | "otp-verification"
  | "forgot-password"
  | "notifications"
  | "search"
  | "state-examples";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [currentPage]);

  const handleNavigate = (page: Page) => {
    if (page !== "browse") {
      setSelectedCategory(null);
    }
    setCurrentPage(page);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage("home");
  };
  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage("dashboard");
  };

  const handleNavigateToOrder = (orderId: string) => {
    setCurrentOrderId(orderId);
    setCurrentPage("order");
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    if (categoryId === null) return; 
    handleNavigate("browse");
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage("search");
  };

  const hideFooterPages = ["login", "otp-verification", "forgot-password"];

  return (
    <div className="dark min-h-screen bg-background flex flex-col">
      {/* Toast */}
      <Toaster theme="dark" position="top-right" />

      {/* HEADER ALWAYS AT TOP */}
      <Header
        onNavigate={handleNavigate}
        currentPage={currentPage}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        onCategorySelect={handleCategorySelect}
        onSearch={handleSearch}
        currentSearchQuery={currentPage === "search" ? searchQuery : ""}
      />

      {/* MAIN EXPANDS FULL HEIGHT */}
      <main className="flex-1 flex flex-col">
        {currentPage === "home" && (
          <div className="container mx-auto px-6 py-8 w-full">
            <HomePage
              onNavigate={handleNavigate}
              onSearch={handleSearch}
              onCategorySelect={handleCategorySelect}
            />
          </div>
        )}

        {currentPage === "browse" && (
          <BrowseItemsPage
            onNavigate={handleNavigate}
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

        {currentPage === "seller" && <SellerPanelPage />}

        {currentPage === "order" && (
          <OrderPage onBack={() => setCurrentPage("dashboard")} />
        )}

        {currentPage === "admin" && <AdminPage />}

        {currentPage === "login" && <LoginPage onNavigate={handleNavigate} />}

        {currentPage === "otp-verification" && (
          <OTPVerificationPage onNavigate={handleNavigate} email={userEmail} />
        )}

        {currentPage === "forgot-password" && (
          <ForgotPasswordPage onNavigate={handleNavigate} />
        )}

        {currentPage === "notifications" && (
          <NotificationsPage onBack={() => setCurrentPage("home")} />
        )}

        {currentPage === "search" && (
          <SearchResultsPage
            initialQuery={searchQuery}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === "state-examples" && <StateExamplesPage />}
      </main>

      {/* FOOTER ALWAYS AT BOTTOM EXCEPT AUTH */}
      {!hideFooterPages.includes(currentPage) && <Footer />}

      {/* Dev Tools */}
      <DevTools onNavigate={(page) => setCurrentPage(page as Page)} />
    </div>
  );
}
