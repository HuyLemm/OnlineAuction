import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import { Layout } from "./layouts/Layout";
import { ScrollToTop } from "./components/ScrollToTop";
import { DevTools } from "./components/dev/DevTools";

import { AuthProvider } from "./components/utils/AuthContext";
import { ProtectedRoute } from "./components/utils/ProtectedRoute";

/* =====================
   PUBLIC PAGES
===================== */
import { HomePage } from "./pages/HomePage";
import { BrowseItemsPage } from "./pages/BrowseItemsPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { SearchResultsPage } from "./pages/SearchResultsPage";
import { StateExamplesPage } from "./pages/StateExamplesPage";

/* =====================
   AUTH PAGES
===================== */
import { LoginPage } from "./pages/LoginPage";
import { OTPVerificationPage } from "./pages/OTPVerificationPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";

/* =====================
   USER / ROLE PAGES
===================== */
import { DashboardPage } from "./pages/DashboardPage";
import { SellerPanelPage } from "./pages/SellerPanelPage";
import { AdminPage } from "./pages/AdminPage";
import { OrderPage } from "./pages/OrderPage";
import { NotificationsPage } from "./pages/NotificationsPage";

export default function App() {
  return (
    <div className="dark min-h-screen bg-background">
      <AuthProvider>
        <Toaster richColors theme="dark" position="top-right" />

        <BrowserRouter>
          <ScrollToTop />

          <Routes>
            {/* =====================
               MAIN LAYOUT
            ===================== */}
            <Route element={<Layout />}>

              {/* ---------- Public routes ---------- */}
              <Route index element={<HomePage />} />
              <Route path="browse" element={<BrowseItemsPage />} />
              <Route path="product/:id" element={<ProductDetailPage />} />
              <Route path="search" element={<SearchResultsPage />} />
              <Route path="state-examples" element={<StateExamplesPage />} />

              {/* ---------- Auth routes ---------- */}
              <Route path="login" element={<LoginPage />} />
              <Route path="verify-otp" element={<OTPVerificationPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />

              {/* =====================
                 AUTHENTICATED USERS
              ===================== */}
              <Route element={<ProtectedRoute />}>
                {/* Logged-in users (any role) */}
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="order/:orderId" element={<OrderPage />} />
              </Route>

              {/* =====================
                 BIDDER ONLY
              ===================== */}
              <Route element={<ProtectedRoute allowedRoles={["bidder"]} />}>
                <Route path="user" element={<DashboardPage />} />
              </Route>

              {/* =====================
                 SELLER ONLY
              ===================== */}
              <Route element={<ProtectedRoute allowedRoles={["seller"]} />}>
                <Route path="seller" element={<SellerPanelPage />} />
              </Route>

              {/* =====================
                 ADMIN ONLY
              ===================== */}
              <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                <Route path="admin" element={<AdminPage />} />
              </Route>

              {/* ---------- Catch inside layout ---------- */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>

            {/* ---------- Global catch ---------- */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <DevTools />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}
