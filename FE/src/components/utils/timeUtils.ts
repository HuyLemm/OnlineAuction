export interface RelativeTimeResult {
  formatted: string;
  isUrgent: boolean;
  isCritical: boolean;
}

export function getRelativeTime(
  timeLeft?: string,
  endDate?: Date
): RelativeTimeResult {
  if (!timeLeft || typeof timeLeft !== "string") {
    return {
      formatted: "—",
      isUrgent: false,
      isCritical: false,
    };
  }

  const daysMatch = timeLeft.match(/(\d+)d/);
  const hoursMatch = timeLeft.match(/(\d+)h/);
  const minutesMatch = timeLeft.match(/(\d+)m/);

  const totalDays = daysMatch ? Number(daysMatch[1]) : 0;
  const totalHours = hoursMatch ? Number(hoursMatch[1]) : 0;
  const totalMinutes = minutesMatch ? Number(minutesMatch[1]) : 0;

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

export function isNewItem(
  postedDate?: Date,
  minutesThreshold: number = 60
): boolean {
  if (!postedDate) return false;

  const localNow = Date.now();
  const localPosted =
    postedDate.getTime() + new Date().getTimezoneOffset() * -60 * 1000;

  return localNow - localPosted <= minutesThreshold * 60 * 1000;
}

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

  if (years > 0) {
    if (months > 0) return `${years} ${yrLabel} ${months} ${moLabel}`;
    if (days > 0) return `${years} ${yrLabel} ${days} ${dayLabel}`;
    return `${years} ${yrLabel}`;
  }

  if (months > 0) {
    if (days > 0) return `${months} ${moLabel} ${days} ${dayLabel}`;
    if (hours > 0) return `${months} ${moLabel} ${hours} ${hrLabel}`;
    return `${months} ${moLabel}`;
  }

  if (days > 0) {
    if (hours > 0) return `${days} ${dayLabel} ${hours} ${hrLabel}`;
    if (mins > 0) return `${days} ${dayLabel} ${mins} ${minLabel}`;
    return `${days} ${dayLabel}`;
  }

  if (hours > 0) {
    if (mins > 0) return `${hours} ${hrLabel} ${mins} ${minLabel}`;
    return `${hours} ${hrLabel}`;
  }

  return `${mins} ${minLabel}`;
}

export const normalizeDate = (
  value: string | Date | null | undefined
): number => {
  if (!value) return 0;

  const str = value.toString();
  const normalized = str.includes("T") ? str : str.replace(" ", "T") + "Z";

  const time = new Date(normalized).getTime();
  return isNaN(time) ? 0 : time;
};

export interface RelativeTimeResult {
  formatted: string;
  isUrgent: boolean; // < 1 hour
  isCritical: boolean; // < 10 minutes
}

export function getRelativeEndTime(
  endDate?: Date | string
): RelativeTimeResult {
  if (!endDate) {
    return {
      formatted: "—",
      isUrgent: false,
      isCritical: false,
    };
  }

  const end = new Date(endDate).getTime();
  const now = Date.now();
  const diffMs = end - now;

  if (diffMs <= 0) {
    return {
      formatted: "Ended",
      isUrgent: false,
      isCritical: false,
    };
  }

  const minutesTotal = Math.floor(diffMs / (1000 * 60));
  const hoursTotal = Math.floor(minutesTotal / 60);
  const daysTotal = Math.floor(hoursTotal / 24);

  if (daysTotal >= 3) {
    return {
      formatted: calculateTimeLeft(endDate),
      isUrgent: false,
      isCritical: false,
    };
  }

  const isUrgent = minutesTotal < 60;
  const isCritical = minutesTotal < 10;

  let formatted: string;

  if (daysTotal > 0) {
    const hours = hoursTotal % 24;
    formatted =
      hours > 0
        ? `${daysTotal} day${daysTotal > 1 ? "s" : ""} ${hours} hour${
            hours > 1 ? "s" : ""
          } left`
        : `${daysTotal} day${daysTotal > 1 ? "s" : ""} left`;
  } else if (hoursTotal > 0) {
    const mins = minutesTotal % 60;
    formatted =
      mins > 0
        ? `${hoursTotal} hour${hoursTotal > 1 ? "s" : ""} ${mins} min${
            mins > 1 ? "s" : ""
          } left`
        : `${hoursTotal} hour${hoursTotal > 1 ? "s" : ""} left`;
  } else {
    formatted = `${minutesTotal} min${minutesTotal > 1 ? "s" : ""} left`;
  }

  return {
    formatted,
    isUrgent,
    isCritical,
  };
}
