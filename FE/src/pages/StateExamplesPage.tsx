import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { 
  LoadingSpinner, 
  SkeletonCard, 
  ErrorState, 
  EmptyState,
  PageLoader 
} from "../components/state";
import { AuctionCard } from "../components/auction/AuctionCard";

type DemoState = "idle" | "loading" | "success" | "error" | "empty";

export function StateExamplesPage() {
  const [productState, setProductState] = useState<DemoState>("idle");
  const [dashboardState, setDashboardState] = useState<DemoState>("idle");
  const [searchState, setSearchState] = useState<DemoState>("idle");

  // Simulate API call for products
  const loadProducts = () => {
    setProductState("loading");
    setTimeout(() => {
      const random = Math.random();
      if (random < 0.3) setProductState("error");
      else if (random < 0.5) setProductState("empty");
      else setProductState("success");
    }, 2000);
  };

  // Simulate API call for dashboard
  const loadDashboard = () => {
    setDashboardState("loading");
    setTimeout(() => {
      const random = Math.random();
      if (random < 0.3) setDashboardState("error");
      else if (random < 0.4) setDashboardState("empty");
      else setDashboardState("success");
    }, 2000);
  };

  // Simulate search
  const performSearch = () => {
    setSearchState("loading");
    setTimeout(() => {
      const random = Math.random();
      if (random < 0.2) setSearchState("error");
      else if (random < 0.5) setSearchState("empty");
      else setSearchState("success");
    }, 1500);
  };

  // Mock data
  const mockProducts = [
    {
      id: "1",
      title: "Rolex Submariner",
      image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=400&q=80",
      currentBid: 12000,
      bids: 45,
      timeLeft: "2d 5h",
      category: "Watches",
      isHot: true,
    },
    {
      id: "2",
      title: "Vintage Camera",
      image: "https://images.unsplash.com/photo-1606403181364-a96a5d8e8023?w=400&q=80",
      currentBid: 850,
      bids: 12,
      timeLeft: "1d 3h",
      category: "Electronics",
    },
    {
      id: "3",
      title: "Designer Handbag",
      image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&q=80",
      currentBid: 2400,
      bids: 28,
      timeLeft: "3d 12h",
      category: "Fashion",
      endingSoon: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 space-y-12">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            State Management Examples
          </h1>
          <p className="text-muted-foreground">
            Practical demonstrations of Loading, Error, and Empty states
          </p>
        </div>

        {/* Product Grid Example */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Product Grid State Management
              </h2>
              <p className="text-sm text-muted-foreground">
                Current state: <span className="text-[#d4a446]">{productState}</span>
              </p>
            </div>
            <Button 
              onClick={loadProducts}
              className="bg-[#d4a446] hover:bg-[#c89b3c]"
            >
              Load Products
            </Button>
          </div>

          <div className="min-h-[400px]">
            {productState === "idle" && (
              <EmptyState 
                variant="no-items"
                message="Click 'Load Products' to simulate fetching data"
                onAction={loadProducts}
                actionLabel="Load Products"
              />
            )}

            {productState === "loading" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SkeletonCard variant="product" count={3} />
              </div>
            )}

            {productState === "error" && (
              <ErrorState 
                type="network"
                onRetry={loadProducts}
                retryText="Retry Loading"
              />
            )}

            {productState === "empty" && (
              <EmptyState 
                variant="no-search-results"
                message="No products found matching your criteria"
                onAction={() => setProductState("idle")}
                actionLabel="Clear Filters"
              />
            )}

            {productState === "success" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mockProducts.map((product) => (
                  <AuctionCard key={product.id} {...product} />
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Dashboard Stats Example */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Dashboard State Management
              </h2>
              <p className="text-sm text-muted-foreground">
                Current state: <span className="text-[#d4a446]">{dashboardState}</span>
              </p>
            </div>
            <Button 
              onClick={loadDashboard}
              className="bg-[#d4a446] hover:bg-[#c89b3c]"
            >
              Load Dashboard
            </Button>
          </div>

          <div className="min-h-[300px]">
            {dashboardState === "idle" && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    Dashboard not loaded yet
                  </p>
                  <Button 
                    onClick={loadDashboard}
                    variant="outline"
                  >
                    Load Dashboard Data
                  </Button>
                </div>
              </div>
            )}

            {dashboardState === "loading" && (
              <SkeletonCard variant="table" count={5} />
            )}

            {dashboardState === "error" && (
              <ErrorState 
                type="server"
                title="Failed to Load Dashboard"
                message="We couldn't load your dashboard data. This might be a temporary issue."
                onRetry={loadDashboard}
              />
            )}

            {dashboardState === "empty" && (
              <EmptyState 
                variant="no-activity"
                message="You don't have any recent activity yet. Start bidding or selling to see your dashboard come to life!"
              />
            )}

            {dashboardState === "success" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {["Active Bids", "Won Auctions", "Watchlist", "Total Spent"].map((stat, i) => (
                    <Card key={i} className="p-4 bg-card/50">
                      <p className="text-sm text-muted-foreground">{stat}</p>
                      <p className="text-2xl font-bold text-foreground mt-1">
                        {[12, 5, 34, "$45.2K"][i]}
                      </p>
                    </Card>
                  ))}
                </div>
                <p className="text-sm text-green-500 text-center">
                  ✓ Dashboard loaded successfully
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Search Results Example */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Search State Management
              </h2>
              <p className="text-sm text-muted-foreground">
                Current state: <span className="text-[#d4a446]">{searchState}</span>
              </p>
            </div>
            <Button 
              onClick={performSearch}
              className="bg-[#d4a446] hover:bg-[#c89b3c]"
            >
              Perform Search
            </Button>
          </div>

          <div className="min-h-[300px]">
            {searchState === "idle" && (
              <EmptyState 
                variant="no-search-results"
                title="Start Your Search"
                message="Enter keywords to find auction items you're interested in"
                onAction={performSearch}
                actionLabel="Try Sample Search"
              />
            )}

            {searchState === "loading" && (
              <div className="space-y-4">
                <LoadingSpinner size="md" text="Searching auction items..." />
                <SkeletonCard variant="product" count={4} />
              </div>
            )}

            {searchState === "error" && (
              <ErrorState 
                type="general"
                title="Search Failed"
                message="We couldn't complete your search. Please try again."
                onRetry={performSearch}
                retryText="Search Again"
              />
            )}

            {searchState === "empty" && (
              <EmptyState 
                variant="no-search-results"
                message="No items found matching your search. Try different keywords or filters."
                onAction={() => setSearchState("idle")}
                actionLabel="New Search"
              />
            )}

            {searchState === "success" && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Found {mockProducts.length} results
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {mockProducts.map((product) => (
                    <AuctionCard key={product.id} {...product} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* All Empty States Showcase */}
        <Card className="p-6 space-y-6">
          <h2 className="text-xl font-semibold text-foreground">
            All Empty State Variants
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EmptyState variant="no-items" />
            <EmptyState variant="no-bids" />
            <EmptyState variant="no-orders" />
            <EmptyState variant="no-watchlist" />
            <EmptyState variant="no-notifications" />
            <EmptyState variant="no-messages" />
            <EmptyState variant="no-listings" />
            <EmptyState variant="no-activity" />
          </div>
        </Card>

        {/* Page Loaders Showcase */}
        <Card className="p-6 space-y-6">
          <h2 className="text-xl font-semibold text-foreground">
            Page Loader Examples
          </h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Browse Page Loader
              </h3>
              <PageLoader variant="browse" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
