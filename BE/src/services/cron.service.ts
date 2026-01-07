import { db } from "../config/db";
import {
  sendAuctionExpiredNoBidMail,
  sendAuctionWonMail,
  sendAuctionSoldMail,
} from "../utils/sendOtpMail";

export class CronService {
  /**
   * Downgrade expired sellers
   * 👉 dùng DB time (NOW) thay vì epoch ms
   */
  static async downgradeExpiredSellers() {
    const affectedRows = await db("users")
      .where("role", "seller")
      .andWhere("seller_expires_at", "<", db.raw("NOW()"))
      .update({
        role: "bidder",
        seller_expires_at: null,
      });

    console.log(`Downgraded ${affectedRows} expired sellers`);
  }

  /**
   * Close expired auctions and create orders if needed
   * (PHẦN NÀY ĐÃ ĐÚNG – GIỮ NGUYÊN)
   */
  static async closeExpiredAuctions() {
    return await db.transaction(async (trx) => {
      // 1️⃣ Lấy auction active đã hết hạn
      const expiredProducts = await trx("products")
        .select(
          "id",
          "title",
          "seller_id",
          "highest_bidder_id",
          "current_price"
        )
        .where("status", "active")
        .andWhere("end_time", "<=", trx.fn.now());

      if (expiredProducts.length === 0) return 0;

      // 2️⃣ Load all users liên quan
      const userIds = new Set<string>();

      for (const p of expiredProducts) {
        userIds.add(p.seller_id);
        if (p.highest_bidder_id) {
          userIds.add(p.highest_bidder_id);
        }
      }

      const users = await trx("users")
        .whereIn("id", [...userIds])
        .select("id", "email", "full_name");

      const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

      // 3️⃣ Process từng auction
      for (const product of expiredProducts) {
        const seller = userMap[product.seller_id];
        const buyer = product.highest_bidder_id
          ? userMap[product.highest_bidder_id]
          : null;

        // ===== CASE 1: Không có bid =====
        if (!product.highest_bidder_id) {
          await trx("products")
            .where({ id: product.id })
            .update({ status: "expired" });

          if (seller) {
            await sendAuctionExpiredNoBidMail({
              to: seller.email,
              sellerName: seller.full_name,
              productTitle: product.title,
              productId: product.id,
            });
          }

          continue;
        }

        // ===== CASE 2: Có người thắng =====
        await trx("products")
          .where({ id: product.id })
          .update({ status: "closed" });

        // Tạo order (idempotent)
        await trx("orders")
          .insert({
            product_id: product.id,
            buyer_id: product.highest_bidder_id,
            seller_id: product.seller_id,
            final_price: product.current_price,
            status: "payment_pending",
          })
          .onConflict("product_id")
          .ignore();

        if (seller) {
          await sendAuctionSoldMail({
            to: seller.email,
            sellerName: seller.full_name,
            productTitle: product.title,
            finalPrice: product.current_price,
            productId: product.id,
          });
        }

        if (buyer) {
          await sendAuctionWonMail({
            to: buyer.email,
            buyerName: buyer.full_name,
            productTitle: product.title,
            finalPrice: product.current_price,
            productId: product.id,
          });
        }
      }

      return expiredProducts.length;
    });
  }
}
