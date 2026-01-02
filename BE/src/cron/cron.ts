import cron from "node-cron";
import { CronService } from "../services/cron.service";

// =============================
// 🔁 AUCTION EXPIRE CHECK
// =============================
cron.schedule("*/2 * * * *", async () => {
  try {
    console.log("⏱ [CRON] Checking expired auctions...");
    const count = await CronService.closeExpiredAuctions();
    console.log(`✅ [CRON] Closed ${count} auctions`);
  } catch (err) {
    console.error("❌ [CRON] Auction cron failed", err);
  }
});

// =============================
// 🔁 SELLER EXPIRY CHECK
// =============================
cron.schedule("*/2 * * * *", async () => {
  try {
    console.log("⏱ [CRON] Checking seller expiry...");
    await CronService.downgradeExpiredSellers();
  } catch (err) {
    console.error("❌ [CRON] Seller expiry cron failed", err);
  }
});
