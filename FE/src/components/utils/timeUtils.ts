export interface RelativeTimeResult {
  formatted: string;
  isUrgent: boolean; // Less than 1 hour
  isCritical: boolean; // Less than 10 minutes
}

/**
 * Convert time string to relative countdown format
 * Returns relative format if less than 3 days, otherwise returns original format
 */
export function getRelativeTime(timeLeft: string, endDate?: Date): RelativeTimeResult {
  // Parse the timeLeft string (e.g., "2d 5h", "5h 30m", "30m")
  const days = timeLeft.match(/(\d+)d/)?.[1];
  const hours = timeLeft.match(/(\d+)h/)?.[1];
  const minutes = timeLeft.match(/(\d+)m/)?.[1];

  const totalDays = days ? parseInt(days) : 0;
  const totalHours = hours ? parseInt(hours) : 0;
  const totalMinutes = minutes ? parseInt(minutes) : 0;

  // Calculate total time in minutes
  const totalTimeInMinutes = totalDays * 24 * 60 + totalHours * 60 + totalMinutes;

  // If less than 3 days (4320 minutes), show relative format
  if (totalTimeInMinutes < 4320) {
    let formatted = '';
    
    if (totalDays > 0) {
      formatted = `${totalDays} day${totalDays > 1 ? 's' : ''} left`;
    } else if (totalHours > 0) {
      formatted = `${totalHours} hour${totalHours > 1 ? 's' : ''} left`;
    } else if (totalMinutes > 0) {
      formatted = `${totalMinutes} minute${totalMinutes > 1 ? 's' : ''} left`;
    } else {
      formatted = 'Ending soon';
    }

    return {
      formatted,
      isUrgent: totalTimeInMinutes < 60, // Less than 1 hour
      isCritical: totalTimeInMinutes < 10, // Less than 10 minutes
    };
  }

  // More than 3 days, return original format
  return {
    formatted: timeLeft,
    isUrgent: false,
    isCritical: false,
  };
}

/**
 * Check if an item is new (posted within configurable timeframe)
 * @param postedDate - Date when item was posted
 * @param daysThreshold - Number of days to consider as "new" (default: 7)
 */
export function isNewItem(postedDate: Date, daysThreshold: number = 7): boolean {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - postedDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays <= daysThreshold;
}

/**
 * Get days since posted
 */
export function getDaysSincePosted(postedDate: Date): number {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - postedDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
