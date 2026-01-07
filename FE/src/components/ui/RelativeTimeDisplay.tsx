import { Clock, AlertCircle } from "lucide-react";
import { getRelativeTime } from "../utils/timeUtils";

interface RelativeTimeDisplayProps {
  timeLeft: string;
  endDate?: Date;
  showIcon?: boolean;
  className?: string;
}

/**
 * RelativeTimeDisplay - Unified component for displaying relative countdown times
 * Shows countdown in relative format for items ending in less than 3 days
 * with color-coded urgency levels
 */
export function RelativeTimeDisplay({ 
  timeLeft, 
  endDate,
  showIcon = true,
  className = "" 
}: RelativeTimeDisplayProps) {
  const { formatted, isUrgent, isCritical } = getRelativeTime(timeLeft, endDate);

  // Determine color based on urgency
  let colorClass = "text-muted-foreground";
  let iconClass = "text-muted-foreground";
  let bgClass = "bg-muted/50";

  if (isCritical) {
    colorClass = "text-red-500";
    iconClass = "text-red-500";
    bgClass = "bg-red-500/10";
  } else if (isUrgent) {
    colorClass = "text-orange-500";
    iconClass = "text-orange-500";
    bgClass = "bg-orange-500/10";
  }

  const Icon = isCritical || isUrgent ? AlertCircle : Clock;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md ${bgClass} ${className}`}>
      {showIcon && <Icon className={`h-3.5 w-3.5 ${iconClass}`} />}
      <span className={`text-xs ${colorClass}`}>
        {formatted}
      </span>
    </div>
  );
}

/**
 * Compact version for cards
 */
export function RelativeTimeCompact({ 
  timeLeft, 
  endDate,
  className = "" 
}: RelativeTimeDisplayProps) {
  const { formatted, isUrgent, isCritical } = getRelativeTime(timeLeft, endDate);

  let colorClass = "text-muted-foreground";

  if (isCritical) {
    colorClass = "text-red-400";
  } else if (isUrgent) {
    colorClass = "text-orange-400";
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Clock className={`h-3.5 w-3.5 ${colorClass}`} />
      <span className={`${colorClass}`}>
        {formatted}
      </span>
    </div>
  );
}
