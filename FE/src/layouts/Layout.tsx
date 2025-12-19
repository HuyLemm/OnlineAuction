import { Outlet, useLocation } from "react-router-dom";
import Snowfall from "react-snowfall";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function Layout() {
  const { pathname } = useLocation();

  const isHome = pathname === "/";
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/otp-verification" ||
    pathname === "/forgot-password";

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* ❄️ Snow layer (background) */}
      <Snowfall
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          zIndex: 0,
          pointerEvents: "none", // không block click
        }}
        snowflakeCount={120}
      />

      {/* 🔝 App content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 flex flex-col">
          {isHome ? (
            <div className="mx-auto max-w-8xl px-40 py-8 flex-1">
              <Outlet />
            </div>
          ) : (
            <div className="w-full flex-1">
              <Outlet />
            </div>
          )}
        </main>

        {!isAuthPage && <Footer />}
      </div>
    </div>
  );
}
