import { db } from "../config/db";

export class AdminService {
  // ===============================
  // Get all upgrade requests
  // ===============================
  static async getUpgradeRequests() {
    const rows = await db("seller_upgrade_requests as r")
      .join("users as u", "u.id", "r.user_id")
      .select(
        "r.id",
        "r.status",
        "r.requested_at",
        "u.id as userId",
        "u.full_name as fullName",
        "u.email"
      )
      .orderBy("r.requested_at", "desc");

    return rows;
  }

  // ===============================
  // Approve upgrade request
  // ===============================
  static async approveUpgradeRequest(
    requestId: string,
    adminId: string
  ) {
    return await db.transaction(async (trx) => {
      const req = await trx("seller_upgrade_requests")
        .where({ id: requestId, status: "pending" })
        .first();

      if (!req) throw new Error("Request not found or already processed");

      // 1️⃣ Update request
      await trx("seller_upgrade_requests")
        .where({ id: requestId })
        .update({
          status: "approved",
          reviewed_at: new Date(),
          reviewed_by: adminId,
        });

      // 2️⃣ Upgrade user role
      await trx("users")
        .where({ id: req.user_id })
        .update({ role: "seller" });

      return { message: "Request approved" };
    });
  }

  // ===============================
  // Reject upgrade request
  // ===============================
  static async rejectUpgradeRequest(
    requestId: string,
    adminId: string
  ) {
    const updated = await db("seller_upgrade_requests")
      .where({ id: requestId, status: "pending" })
      .update({
        status: "rejected",
        reviewed_at: new Date(),
        reviewed_by: adminId,
      });

    if (!updated) {
      throw new Error("Request not found or already processed");
    }

    return { message: "Request rejected" };
  }
}
