export interface RelativeTimeResult {
  formatted: string;
  isUrgent: boolean; // Less than 1 hour
  isCritical: boolean; // Less than 10 minutes
}

export function getRelativeTime(
  timeLeft?: string,
  endDate?: Date
): RelativeTimeResult {
  // If missing or not valid → safe fallback
  if (!timeLeft || typeof timeLeft !== "string") {
    return {
      formatted: "—",
      isUrgent: false,
      isCritical: false,
    };
  }

  // Try parse values from string — format example: "2d 5h", "3h 20m"
  const daysMatch = timeLeft.match(/(\d+)d/);
  const hoursMatch = timeLeft.match(/(\d+)h/);
  const minutesMatch = timeLeft.match(/(\d+)m/);

  const totalDays = daysMatch ? Number(daysMatch[1]) : 0;
  const totalHours = hoursMatch ? Number(hoursMatch[1]) : 0;
  const totalMinutes = minutesMatch ? Number(minutesMatch[1]) : 0;

  // When BE gives a weird / unexpected string → fallback
  if (totalDays === 0 && totalHours === 0 && totalMinutes === 0) {
    return {
      formatted: timeLeft.trim() !== "" ? timeLeft : "—",
      isUrgent: false,
      isCritical: false,
    };
  }

  const minutesTotal = totalDays * 24 * 60 + totalHours * 60 + totalMinutes;
  const isUrgent = minutesTotal < 60;
  const isCritical = minutesTotal < 10;

  let formatted;
  if (totalDays > 0) formatted = `${totalDays}d ${totalHours}h left`;
  else if (totalHours > 0) formatted = `${totalHours}h ${totalMinutes}m left`;
  else formatted = `${totalMinutes}m left`;

  return {
    formatted,
    isUrgent,
    isCritical,
  };
}

/**
 * Mark "New" badge
 */
export function isNewItem(
  postedDate?: Date,
  daysThreshold: number = 7
): boolean {
  if (!postedDate) return false;
  const now = new Date();
  const diff = now.getTime() - postedDate.getTime();
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  return diffDays <= daysThreshold;
}

/**
 * Get days since posted for UI display
 */
export function formatPostedDate(postedDate?: Date | string): string {
  if (!postedDate) return "—";
  return new Date(postedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function calculateTimeLeft(endTime: string | Date): string {
  if (!endTime) return "0 min";

  const end = new Date(endTime).getTime();
  const now = Date.now();
  const diff = end - now;

  if (diff <= 0) return "0 min";

  const minutes = Math.floor(diff / (1000 * 60));

  const years = Math.floor(minutes / (60 * 24 * 365));
  const months = Math.floor((minutes % (60 * 24 * 365)) / (60 * 24 * 30));
  const days = Math.floor((minutes % (60 * 24 * 30)) / (60 * 24));
  const hours = Math.floor((minutes % (60 * 24)) / 60);
  const mins = minutes % 60;

  const yrLabel = years === 1 ? "yr" : "yrs";
  const moLabel = months === 1 ? "mo" : "mos";
  const dayLabel = days === 1 ? "day" : "days";
  const hrLabel = hours === 1 ? "hr" : "hrs";
  const minLabel = mins === 1 ? "min" : "mins";

  // Year priority: year + (month || day)
  if (years > 0) {
    if (months > 0) return `${years} ${yrLabel} ${months} ${moLabel}`;
    if (days > 0) return `${years} ${yrLabel} ${days} ${dayLabel}`;
    return `${years} ${yrLabel}`;
  }

  // Month priority: month + (day || hour)
  if (months > 0) {
    if (days > 0) return `${months} ${moLabel} ${days} ${dayLabel}`;
    if (hours > 0) return `${months} ${moLabel} ${hours} ${hrLabel}`;
    return `${months} ${moLabel}`;
  }

  // Day priority: day + (hour || min)
  if (days > 0) {
    if (hours > 0) return `${days} ${dayLabel} ${hours} ${hrLabel}`;
    if (mins > 0) return `${days} ${dayLabel} ${mins} ${minLabel}`;
    return `${days} ${dayLabel}`;
  }

  // Hour priority: hour + min (if min > 0)
  if (hours > 0) {
    if (mins > 0) return `${hours} ${hrLabel} ${mins} ${minLabel}`;
    return `${hours} ${hrLabel}`;
  }

  // Only minutes left
  return `${mins} ${minLabel}`;
}
