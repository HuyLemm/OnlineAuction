import { Sparkles } from "lucide-react";
import { isNewItem } from "../utils/timeUtils";

interface NewBadgeProps {
  postedDate: Date | string;
  daysThreshold?: number; // Default: 7 days
  minutesThreshold?: number;
  variant?: "default" | "compact" | "minimal";
  className?: string;
}

/**
 * NewBadge - Unified component for displaying NEW badge on recently posted items
 * Configurable threshold (default: 7 days)
 */
export function NewBadge({ 
  postedDate, 
  daysThreshold = 7,
  minutesThreshold,
  variant = "default",
  className = "" 
}: NewBadgeProps) {
  // Ensure we have a valid Date object
  const dateObj = postedDate instanceof Date ? postedDate : new Date(postedDate);
  if (isNaN(dateObj.getTime())) return null;
  
  const isNew = isNewItem(dateObj, daysThreshold, minutesThreshold);

  if (!isNew) return null;

  if (variant === "minimal") {
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] ${className}`}>
        <span className="text-[10px] text-black uppercase tracking-wide">
          New
        </span>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gradient-to-r from-[#fbbf24]/20 to-[#f59e0b]/20 border border-[#fbbf24]/30 ${className}`}>
        <Sparkles className="h-3 w-3 text-[#fbbf24]" />
        <span className="text-xs text-[#fbbf24] uppercase tracking-wide">
          New
        </span>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#fbbf24]/20 to-[#f59e0b]/20 border border-[#fbbf24]/40 shadow-sm shadow-[#fbbf24]/20 ${className}`}>
      <Sparkles className="h-3.5 w-3.5 text-[#fbbf24] animate-pulse" />
      <span className="text-xs text-[#fbbf24] uppercase tracking-wide">
        New
      </span>
    </div>
  );
}

/**
 * Corner badge variant for card overlays
 */
export function NewBadgeCorner({ 
  postedDate, 
  daysThreshold = 7,
  minutesThreshold,
  className = "" 
}: Omit<NewBadgeProps, 'variant'>) {
  // Ensure we have a valid Date object
  const dateObj = postedDate instanceof Date ? postedDate : new Date(postedDate);
  if (isNaN(dateObj.getTime())) return null;
  
  const isNew = isNewItem(dateObj, daysThreshold, minutesThreshold);

  if (!isNew) return null;

  return (
    <div className={`absolute top-2 right-2 z-10 ${className}`}>
      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] shadow-lg shadow-[#fbbf24]/30">
        <Sparkles className="h-3 w-3 text-black" />
        <span className="text-xs text-black uppercase tracking-wide">
          New
        </span>
      </div>
    </div>
  );
}
