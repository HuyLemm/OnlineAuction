import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { Layout } from "./layouts/Layout";
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

import { ScrollToTop } from "./components/ScrollToTop";

export default function App() {
  return (
    <div className="dark min-h-screen bg-background">
      <Toaster theme="dark" position="top-right" />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Routes with main layout */}
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="browse" element={<BrowseItemsPage />} />
            <Route path="product/:id" element={<ProductDetailPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="seller" element={<SellerPanelPage />} />
            <Route path="order/:orderId" element={<OrderPage />} />
            <Route path="admin" element={<AdminPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="search" element={<SearchResultsPage />} />
            <Route path="state-examples" element={<StateExamplesPage />} />

            {/* Auth routes without footer */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/verify-otp" element={<OTPVerificationPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <DevTools />
      </BrowserRouter>
    </div>
  );
}
