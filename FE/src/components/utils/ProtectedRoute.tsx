import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { useEffect, useRef } from "react";

interface ProtectedRouteProps {
  allowedRoles?: ("bidder" | "seller" | "admin")[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isLoggedIn, role, isLoading } = useAuth();
  const location = useLocation();

  // ✅ nhớ path đã warn để không spam
  const warnedPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (isLoading) return;

    // ❌ chưa đăng nhập
    if (!isLoggedIn) {
      if (warnedPathRef.current !== location.pathname) {
        toast.warning("Please login to continue");
        warnedPathRef.current = location.pathname;
      }
      return;
    }

    // ❌ sai role
    if (allowedRoles && role && !allowedRoles.includes(role)) {
      if (warnedPathRef.current !== location.pathname) {
        const displayRole = role.charAt(0).toUpperCase() + role.slice(1);
        toast.warning(
          `You are ${displayRole}, you do not have permission to access this page`
        );
        warnedPathRef.current = location.pathname;
      }
    }
  }, [isLoggedIn, role, allowedRoles, isLoading, location.pathname]);

  /* =====================
     RENDER
  ===================== */

  if (isLoading) return null;

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
