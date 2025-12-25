import bcrypt from "bcrypt";
import { db } from "../config/db";

const SALT_ROUNDS = 10;

export class UserService {
  private static baseQuery() {
    return db("products as p")
      .leftJoin("product_images as pi", function () {
        this.on("pi.product_id", "=", "p.id").andOn(
          "pi.is_main",
          "=",
          db.raw("true")
        );
      })
      .leftJoin("categories as c", "c.id", "p.category_id")
      .leftJoin("users as u", "u.id", "p.highest_bidder_id")
      .leftJoin("bids as b", "b.product_id", "p.id")
      .select(
        "p.id",
        "p.title",
        "p.auction_type as auctionType",
        "p.highest_bidder_id as highestBidderId",
        "u.full_name as highestBidderName",
        "p.buy_now_price as buyNowPrice",
        "p.created_at as postedDate",
        "p.description",
        "p.end_time",
        "p.category_id as categoryId",
        "c.name as category",

        db.raw(`COALESCE(p.current_price, p.start_price)::int AS "currentBid"`),
        db.raw(`COALESCE(pi.image_url, '') AS "image"`),
        db.raw("COUNT(b.id) AS bids")
      )
      .where("p.status", "active")
      .groupBy("p.id", "pi.image_url", "c.name", "u.full_name");
  }

  // ===============================
  // Watchlist - Get all
  // ===============================
  static async getWatchlist(userId: string) {
    const rows = await this.baseQuery()
      .join("watchlists as w", "w.product_id", "p.id")
      .where("w.user_id", userId)
      .select(db.raw("MAX(w.created_at) as watchlisted_at"))
      .groupBy("p.id", "pi.image_url", "c.name", "u.full_name")
      .orderBy("watchlisted_at", "desc");

    const TEN_YEARS_MS = 10 * 365 * 24 * 60 * 60 * 1000;
    const now = Date.now();

    return rows.map((p) => {
      const endTime = new Date(p.end_time).getTime();
      const timeLeft = endTime - now;

      return {
        id: p.id,
        title: p.title,
        category: p.category,
        categoryId: p.categoryId,
        image: p.image,
        description: p.description,
        postedDate: p.postedDate,
        end_time: p.end_time,

        auctionType: p.auctionType,
        buyNowPrice: p.buyNowPrice,

        currentBid: p.currentBid,
        bids: Number(p.bids),

        highestBidderId: p.highestBidderId,
        highestBidderName: p.highestBidderName,

        // ✅ LOGIC MỚI
        isHot: Number(p.currentBid) > 4000,
        endingSoon: timeLeft > 0 && timeLeft < TEN_YEARS_MS,
      };
    });
  }

  // ===============================
  // Watchlist - Add
  // ===============================
  static async addToWatchlist(userId: string, productId: string) {
    await db("watchlists")
      .where({ user_id: userId, product_id: productId })
      .del();

    try {
      await db("watchlists").insert({
        user_id: userId,
        product_id: productId,
        created_at: new Date(),
      });
    } catch (err: any) {
      // PostgreSQL unique_violation
      if (err.code === "23505") {
        return;
      }
      throw err;
    }
  }

  // ===============================
  // Watchlist - Remove
  // ===============================
  static async removeFromWatchlist(userId: string, productId: string) {
    await db("watchlists")
      .where({
        user_id: userId,
        product_id: productId,
      })
      .del();
  }

  // ===============================
  // Watchlist - Get product ids only
  // ===============================
  static async getWatchlistProductIds(userId: string): Promise<string[]> {
    const rows = await db("watchlists")
      .select("product_id")
      .where({ user_id: userId });

    return rows.map((r) => r.product_id);
  }

  static async removeManyFromWatchlist(userId: string, productIds: string[]) {
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return { deleted: 0 };
    }

    const deletedCount = await db("watchlists")
      .where("user_id", userId)
      .whereIn("product_id", productIds)
      .del();

    return {
      deleted: deletedCount,
    };
  }

  // ===============================
  // Profile - Get
  // ===============================
  static async getProfile(userId: string) {
    const user = await db("users")
      .select(
        "id",
        "email",
        "full_name",
        "dob",
        "address",
        "role",
        "created_at"
      )
      .where({ id: userId })
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  // ===============================
  // Profile - Update
  // ===============================
  static async updateProfile(
    userId: string,
    payload: {
      email?: string;
      fullName?: string;
      dob?: string;
      address?: string;
    }
  ) {
    const updateData: any = {};

    if (payload.email) updateData.email = payload.email;
    if (payload.fullName) updateData.full_name = payload.fullName;
    if (payload.dob) updateData.dob = payload.dob;
    if (payload.address) updateData.address = payload.address;

    if (Object.keys(updateData).length === 0) {
      throw new Error("No data to update");
    }

    await db("users").where({ id: userId }).update(updateData);

    return this.getProfile(userId);
  }

  // ===============================
  // Profile - Change Password
  // ===============================
  static async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ) {
    const user = await db("users")
      .select("password_hash")
      .where({ id: userId })
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isMatch) {
      throw new Error("Current password is incorrect");
    }

    const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await db("users").where({ id: userId }).update({ password_hash: newHash });

    return { success: true };
  }

  // ===============================
  // Ratings - Summary
  // ===============================
  static async getRatingSummary(userId: string) {
    const rows = await db("ratings").select("score").where("to_user", userId);

    let plus = 0;
    let minus = 0;

    for (const r of rows) {
      if (r.score === 1) plus++;
      if (r.score === -1) minus++;
    }

    const totalVotes = plus + minus;
    const totalScore = plus - minus;

    return {
      totalScore, // ví dụ: 1
      plus, // số phiếu +1
      minus, // số phiếu -1
      ratio: `${plus}/${totalVotes}`, // ví dụ: "2/3"
      totalVotes,
    };
  }

  // ===============================
  // Ratings - Detail list
  // ===============================
  static async getRatingDetails(userId: string) {
    const rows = await db("ratings as r")
      // người đánh giá
      .join("users as u", "u.id", "r.from_user")

      // sản phẩm được đánh giá
      .join("products as p", "p.id", "r.product_id")

      // ảnh main của product
      .leftJoin("product_images as pi", function () {
        this.on("pi.product_id", "=", "p.id").andOn(
          "pi.is_main",
          "=",
          db.raw("true")
        );
      })

      // category
      .leftJoin("categories as c", "c.id", "p.category_id")

      .select(
        // rating
        "r.id",
        "r.score",
        "r.comment",
        "r.created_at",

        // from user
        "u.id as fromUserId",
        "u.full_name as fromUserName",

        // product
        "p.id as productId",
        "p.title as productTitle",
        "c.name as category",

        db.raw(`COALESCE(pi.image_url, '') AS "productImage"`)
      )
      .where("r.to_user", userId)
      .orderBy("r.created_at", "desc");

    return rows.map((r) => ({
      id: r.id,
      score: r.score, // 1 | -1
      comment: r.comment,
      createdAt: r.created_at,

      fromUser: {
        id: r.fromUserId,
        fullName: r.fromUserName,
      },

      product: {
        id: r.productId,
        title: r.productTitle,
        image: r.productImage,
        category: r.category,
      },
    }));
  }

  // ===============================
  // Seller upgrade request (Bidder)
  // ===============================
  static async requestUpgradeToSeller(userId: string) {
    const user = await db("users").select("role").where({ id: userId }).first();

    if (!user) throw new Error("User not found");

    // ❌ Đã là seller
    if (user.role === "seller") {
      throw new Error("You are already a seller");
    }

    // Lấy request gần nhất
    const lastRequest = await db("seller_upgrade_requests")
      .where({ user_id: userId })
      .orderBy("requested_at", "desc")
      .first();

    // ❌ Pending
    if (lastRequest && lastRequest.status === "pending") {
      throw new Error("You already have a pending upgrade request");
    }

    // ❌ Approved (đề phòng role chưa sync)
    if (lastRequest && lastRequest.status === "approved") {
      throw new Error("Your upgrade request has already been approved");
    }

    // ✅ Chỉ cho request nếu:
    // - chưa có request
    // - hoặc request trước bị rejected
    await db("seller_upgrade_requests").insert({
      user_id: userId,
      status: "pending",
      requested_at: new Date(),
    });

    return {
      message: "Upgrade request submitted successfully",
    };
  }

  // ===============================
  // Seller upgrade - Get my request status
  // ===============================
  static async getUpgradeSellerRequestStatus(userId: string) {
    // check role
    const user = await db("users").select("role").where({ id: userId }).first();

    if (!user) throw new Error("User not found");

    if (user.role === "seller") {
      return {
        role: "seller",
        request: null,
      };
    }

    const request = await db("seller_upgrade_requests")
      .where({ user_id: userId })
      .orderBy("requested_at", "desc")
      .first();

    return {
      role: user.role,
      request: request
        ? {
            id: request.id,
            status: request.status, // pending | approved | rejected
            requestedAt: request.requested_at,
          }
        : null,
    };
  }

  // ===============================
  // Auctions bidder is participating in
  // ===============================
  static async getMyActiveBids(userId: string) {
    /* =============================
     * 1️⃣ Lấy toàn bộ bids của bidder
     * ============================= */
    const bidRows = await db("bids")
      .where("bidder_id", userId)
      .orderBy("bid_amount", "desc");

    if (bidRows.length === 0) {
      return [];
    }

    /* =============================
     * 2️⃣ Gom bids theo product_id
     * ============================= */
    const bidsByProduct: Record<
      string,
      {
        id: string;
        amount: number;
        time: Date;
      }[]
    > = {};

    for (const bid of bidRows) {
      (bidsByProduct[bid.product_id] ??= []).push({
        id: bid.id,
        amount: Number(bid.bid_amount),
        time: bid.bid_time,
      });
    }

    const productIds = Object.keys(bidsByProduct);

    /* =============================
     * 3️⃣ Lấy thông tin product
     * ============================= */
    const productRows = await db("products as p")
      .leftJoin("categories as c", "c.id", "p.category_id")
      .leftJoin("users as s", "s.id", "p.seller_id")
      .leftJoin("product_images as pi", function () {
        this.on("pi.product_id", "=", "p.id").andOn(
          "pi.is_main",
          "=",
          db.raw("true")
        );
      })
      .leftJoin("users as hb", "hb.id", "p.highest_bidder_id")
      .whereIn("p.id", productIds)
      .select(
        "p.id",
        "p.title",
        "p.status",
        "p.current_price",
        "p.start_price",
        "p.end_time",
        "p.highest_bidder_id",
        "p.auction_type",

        "c.name as category",
        "s.full_name as sellerName",
        "hb.full_name as highestBidderName",

        db.raw(`COALESCE(pi.image_url, '') AS image`)
      );

    /* =============================
     * 4️⃣ Trả dữ liệu cho FE
     * ============================= */
    return productRows.map((p) => ({
      product: {
        id: p.id,
        title: p.title,
        category: p.category,
        sellerName: p.sellerName,
        image: p.image,
        auctionType: p.auction_type,

        status: p.status, // active / closed
        isClosed: p.status !== "active",

        currentPrice: Number(p.current_price) ?? Number(p.start_price),

        endTime: p.end_time,

        highestBidder: p.highest_bidder_id
          ? {
              id: p.highest_bidder_id,
              name: p.highestBidderName,
            }
          : null,
      },

      myBids: bidsByProduct[p.id] ?? [],
    }));
  }
}
