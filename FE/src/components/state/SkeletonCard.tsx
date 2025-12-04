import { Card } from "../ui/card";
import { cn } from "../../lib/utils";

interface SkeletonCardProps {
  variant?: "product" | "table" | "detail" | "notification" | "bid";
  count?: number;
  className?: string;
}

export function SkeletonCard({ variant = "product", count = 1, className }: SkeletonCardProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  if (variant === "product") {
    return (
      <>
        {items.map((i) => (
          <Card key={i} className={cn("overflow-hidden border border-border/50 bg-card", className)}>
            {/* Image Skeleton */}
            <div className="relative aspect-[4/3] bg-secondary/20 animate-pulse" />
            
            {/* Content Skeleton */}
            <div className="p-4 space-y-3">
              {/* Title */}
              <div className="h-5 bg-secondary/30 rounded animate-pulse w-3/4" />
              
              {/* Category */}
              <div className="h-4 bg-secondary/20 rounded animate-pulse w-1/2" />
              
              {/* Bid Info */}
              <div className="flex items-center justify-between pt-2">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-secondary/20 rounded animate-pulse w-24" />
                  <div className="h-6 bg-secondary/30 rounded animate-pulse w-32" />
                </div>
                <div className="h-10 w-24 bg-secondary/30 rounded animate-pulse" />
              </div>
            </div>
          </Card>
        ))}
      </>
    );
  }

  if (variant === "table") {
    return (
      <div className="space-y-2">
        {items.map((i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-card/50 border border-border/50 rounded-lg animate-pulse">
            <div className="h-12 w-12 bg-secondary/30 rounded" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-secondary/30 rounded w-1/3" />
              <div className="h-3 bg-secondary/20 rounded w-1/2" />
            </div>
            <div className="h-8 w-20 bg-secondary/30 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "detail") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
        {/* Left: Image Gallery Skeleton */}
        <div className="space-y-4">
          <div className="aspect-square bg-secondary/20 rounded-lg" />
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-secondary/20 rounded" />
            ))}
          </div>
        </div>

        {/* Right: Info Skeleton */}
        <div className="space-y-6">
          <div className="h-8 bg-secondary/30 rounded w-3/4" />
          <div className="h-4 bg-secondary/20 rounded w-1/2" />
          
          {/* Bid Section */}
          <Card className="p-6 space-y-4 bg-card/50">
            <div className="h-6 bg-secondary/30 rounded w-32" />
            <div className="h-10 bg-secondary/30 rounded w-full" />
            <div className="h-12 bg-[#d4a446]/20 rounded w-full" />
          </Card>
          
          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 bg-secondary/20 rounded w-full" />
            <div className="h-4 bg-secondary/20 rounded w-5/6" />
            <div className="h-4 bg-secondary/20 rounded w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "notification") {
    return (
      <div className="space-y-2">
        {items.map((i) => (
          <div key={i} className="flex items-start gap-4 p-4 bg-card/50 border border-border/50 rounded-lg animate-pulse">
            <div className="h-10 w-10 bg-secondary/30 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-secondary/30 rounded w-2/3" />
              <div className="h-3 bg-secondary/20 rounded w-1/2" />
              <div className="h-3 bg-secondary/20 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "bid") {
    return (
      <div className="space-y-3">
        {items.map((i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-card/50 border border-border/50 rounded-lg animate-pulse">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-secondary/30 rounded-full" />
              <div className="space-y-2">
                <div className="h-4 bg-secondary/30 rounded w-24" />
                <div className="h-3 bg-secondary/20 rounded w-16" />
              </div>
            </div>
            <div className="h-6 bg-secondary/30 rounded w-20" />
          </div>
        ))}
      </div>
    );
  }

  return null;
}
