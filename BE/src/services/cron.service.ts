import { db } from "../config/db";

export class CronService {
  static async downgradeExpiredSellers() {
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
  /**
   * Close expired auctions and create orders if needed
   */
  static async closeExpiredAuctions() {
    return await db.transaction(async (trx) => {
      // 1️⃣ Lấy tất cả auction active đã hết hạn
      const expiredProducts = await trx("products")
        .select("id", "seller_id", "highest_bidder_id", "current_price")
        .where("status", "active")
        .andWhere("end_time", "<=", trx.fn.now());

      for (const product of expiredProducts) {
        // =============================
        // CASE 1: Không có bid → expired
        // =============================
        if (!product.highest_bidder_id) {
          await trx("products")
            .where({ id: product.id })
            .update({ status: "expired" });

          continue;
        }

        // =============================
        // CASE 2: Có người thắng
        // =============================
        await trx("products")
          .where({ id: product.id })
          .update({ status: "closed" });

        // Tạo order (mỗi product chỉ 1 order)
        await trx("orders")
          .insert({
            product_id: product.id,
            buyer_id: product.highest_bidder_id,
            seller_id: product.seller_id,
            final_price: product.current_price,
            status: "pending_payment",
            payment_deadline: trx.raw("NOW() + INTERVAL '24 HOURS'"),
          })
          .onConflict("product_id")
          .ignore(); // an toàn nếu cron chạy trùng
      }

      return expiredProducts.length;
    });
  }
}
