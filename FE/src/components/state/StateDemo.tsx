import { useState } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import { SkeletonCard } from "./SkeletonCard";
import { ErrorState } from "./ErrorState";
import { EmptyState } from "./EmptyState";
import { PageLoader } from "./PageLoader";
import { Button } from "../ui/button";

export function StateDemo() {
  const [activeDemo, setActiveDemo] = useState<string>("loading");

  return (
    <div className="min-h-screen bg-background p-8 space-y-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">State Components Demo</h1>

        {/* Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {["loading", "skeleton", "error", "empty", "page-loader"].map((demo) => (
            <Button
              key={demo}
              onClick={() => setActiveDemo(demo)}
              variant={activeDemo === demo ? "default" : "outline"}
              className={activeDemo === demo ? "bg-[#d4a446]" : ""}
            >
              {demo.replace("-", " ").toUpperCase()}
            </Button>
          ))}
        </div>

        {/* Demo Content */}
        <div className="space-y-12">
          {activeDemo === "loading" && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Loading Spinners</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-8 bg-card/50 rounded-lg">
                  <LoadingSpinner size="sm" text="Small" />
                  <LoadingSpinner size="md" text="Medium" />
                  <LoadingSpinner size="lg" text="Large" />
                  <LoadingSpinner size="xl" text="Extra Large" />
                </div>
              </div>
            </div>
          )}

          {activeDemo === "skeleton" && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Product Card Skeleton</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <SkeletonCard variant="product" count={3} />
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Table Skeleton</h2>
                <SkeletonCard variant="table" count={4} />
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Detail Page Skeleton</h2>
                <SkeletonCard variant="detail" />
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Notification Skeleton</h2>
                <SkeletonCard variant="notification" count={3} />
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Bid History Skeleton</h2>
                <SkeletonCard variant="bid" count={4} />
              </div>
            </div>
          )}

          {activeDemo === "error" && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Network Error</h2>
                <ErrorState 
                  type="network"
                  onRetry={() => alert("Retrying...")}
                />
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Server Error</h2>
                <ErrorState 
                  type="server"
                  onRetry={() => alert("Retrying...")}
                />
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Permission Error</h2>
                <ErrorState 
                  type="permission"
                />
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Custom Error</h2>
                <ErrorState 
                  title="Payment Failed"
                  message="Your payment could not be processed. Please check your payment details and try again."
                  onRetry={() => alert("Retrying payment...")}
                  retryText="Retry Payment"
                />
              </div>
            </div>
          )}

          {activeDemo === "empty" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EmptyState 
                  variant="no-items"
                  onAction={() => alert("Browse categories")}
                />
                <EmptyState 
                  variant="no-search-results"
                  onAction={() => alert("Clear filters")}
                />
                <EmptyState 
                  variant="no-notifications"
                />
                <EmptyState 
                  variant="no-bids"
                  onAction={() => alert("Place bid")}
                />
                <EmptyState 
                  variant="no-orders"
                  onAction={() => alert("Browse auctions")}
                />
                <EmptyState 
                  variant="no-watchlist"
                  onAction={() => alert("Explore items")}
                />
                <EmptyState 
                  variant="no-messages"
                />
                <EmptyState 
                  variant="no-listings"
                  onAction={() => alert("Create listing")}
                />
              </div>
            </div>
          )}

          {activeDemo === "page-loader" && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Home Page Loader</h2>
                <PageLoader variant="home" />
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Browse Page Loader</h2>
                <PageLoader variant="browse" />
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Dashboard Loader</h2>
                <PageLoader variant="dashboard" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
