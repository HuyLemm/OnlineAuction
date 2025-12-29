import {db} from "../config/db";

export async function downgradeExpiredSellers() {
  const now = new Date();

  const affectedRows = await db("users")
    .where("role", "seller")
    .andWhere("seller_expires_at", "<", now)
    .update({
      role: "bidder",
      seller_expires_at: null,
    });

  console.log(`Downgraded ${affectedRows} expired sellers`);
}
