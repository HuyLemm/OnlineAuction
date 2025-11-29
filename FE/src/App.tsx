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
import { AdminPage } from "./pages/AdminPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { OTPVerificationPage } from "./pages/OTPVerificationPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";

type Page = "home" | "browse" | "detail" | "dashboard" | "seller" | "order" | "admin" | "login" | "register" | "otp-verification" | "forgot-password";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");

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

  return (
    <div className="dark min-h-screen bg-background">
      <Toaster theme="dark" position="top-right" />
      <Header 
        onNavigate={(page) => setCurrentPage(page)} 
        currentPage={currentPage}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
      
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
        
        {currentPage === "admin" && (
          <AdminPage />
        )}

        {currentPage === "login" && (
          <LoginPage onNavigate={(page) => setCurrentPage(page)} />
        )}

        {currentPage === "register" && (
          <RegisterPage onNavigate={(page) => setCurrentPage(page)} />
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
        
        {!["login", "register", "otp-verification", "forgot-password"].includes(currentPage) && (
          <Footer />
        )}
      </main>
    </div>
  );
}