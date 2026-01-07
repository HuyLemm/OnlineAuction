import { LoadingSpinner } from "./LoadingSpinner";
import { SkeletonCard } from "./SkeletonCard";

interface PageLoaderProps {
  variant?: "home" | "browse" | "detail" | "dashboard" | "table";
  text?: string;
}

export function PageLoader({ variant = "browse", text }: PageLoaderProps) {
  if (variant === "home") {
    return (
      <div className="space-y-12 animate-in fade-in duration-500">
        {/* Hero Skeleton */}
        <div className="h-96 bg-secondary/20 rounded-xl animate-pulse" />
        
        {/* Featured Items */}
        <div className="space-y-6">
          <div className="h-8 bg-secondary/30 rounded w-48 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SkeletonCard variant="product" count={4} />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "browse") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
        {/* Sidebar Skeleton */}
        <div className="space-y-4">
          <div className="h-12 bg-secondary/30 rounded animate-pulse" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 bg-secondary/20 rounded animate-pulse" />
            ))}
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-6 bg-secondary/30 rounded w-32 animate-pulse" />
            <div className="h-10 bg-secondary/30 rounded w-48 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonCard variant="product" count={9} />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "detail") {
    return (
      <div className="animate-in fade-in duration-500">
        <SkeletonCard variant="detail" />
        
        {/* Additional Sections */}
        <div className="mt-8 space-y-4">
          <div className="h-6 bg-secondary/30 rounded w-32 animate-pulse" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-secondary/20 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "dashboard") {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-card/50 border border-border/50 rounded-lg animate-pulse" />
          ))}
        </div>

        {/* Table Section */}
        <div className="space-y-4">
          <div className="h-8 bg-secondary/30 rounded w-48 animate-pulse" />
          <SkeletonCard variant="table" count={5} />
        </div>
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className="animate-in fade-in duration-500">
        <SkeletonCard variant="table" count={8} />
      </div>
    );
  }

  // Default: Simple spinner
  return (
    <div className="flex items-center justify-center py-24">
      <LoadingSpinner size="lg" text={text || "Loading..."} />
    </div>
  );
}
