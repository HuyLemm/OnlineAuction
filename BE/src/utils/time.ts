import { db } from "../config/db";

/**
 * Get current time from database (UTC)
 */
export async function getDbNow(trx?: any): Promise<Date> {
  const q = trx ?? db;
  const { rows } = await q.raw("SELECT NOW() as now");
  return new Date(rows[0].now);
}

export async function getDbNowMs(trx?: any): Promise<number> {
  const now = await getDbNow(trx);
  return now.getTime();
}

/**
 * Calculate remaining milliseconds using DB time
 * ⚠️ Use for backend logic (auto extend, expire, cron)
 */
export async function getRemainingMs(
  endTime: string | Date,
  trx?: any
): Promise<number> {
  const dbNow = await getDbNowMs(trx);
  const end = new Date(endTime).getTime();
  return end - dbNow;
}

/**
 * Calculate time left (human readable)
 * ⚠️ BACKEND ONLY – logging / response helper
 * ❌ DO NOT use this to decide business logic
 */
export async function calculateTimeLeft(
  endTime: string | Date,
  trx?: any
): Promise<string> {
  const diff = await getRemainingMs(endTime, trx);

  if (diff <= 0) return "Ended";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const minutes = Math.floor(diff / (1000 * 60)) % 60;

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
