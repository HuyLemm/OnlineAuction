import cron from "node-cron";
import { downgradeExpiredSellers } from "../services/cron.service";

// chạy mỗi 1 giờ
cron.schedule("*/10 * * * *", async () => {
  console.log("[CRON] Checking expired sellers...");
  await downgradeExpiredSellers();
});
