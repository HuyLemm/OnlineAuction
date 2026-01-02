import bcrypt from "bcrypt";
import { db } from "../config/db";
import { sendQuestionNotificationMail } from "../utils/sendOtpMail";

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
      .andWhere("p.status", "active")
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

  // ===============================
  // Questions - Ask seller about product
  // ===============================
  static async askQuestion(userId: string, productId: string, content: string) {
    if (!content || !content.trim()) {
      throw new Error("Question content is required");
    }

    /* =============================
     * 1️⃣ Check user
     * ============================= */
    const user = await db("users")
      .select("id", "role", "is_blocked", "full_name")
      .where({ id: userId })
      .first();

    if (!user) throw new Error("User not found");
    if (user.is_blocked) throw new Error("Your account is blocked");

    if (user.role !== "bidder") {
      throw new Error("Only bidders can ask questions");
    }

    /* =============================
     * 2️⃣ Check product + seller
     * ============================= */
    const product = await db("products as p")
      .join("users as s", "s.id", "p.seller_id")
      .select(
        "p.id as productId",
        "p.title as productTitle",
        "p.status as productStatus",

        "s.id as sellerId",
        "s.full_name as sellerName",
        "s.email as sellerEmail"
      )
      .where("p.id", productId)
      .first();

    if (!product) throw new Error("Product not found");

    // ✅ ĐÚNG FIELD
    if (product.productStatus !== "active") {
      throw new Error("Cannot ask question for inactive product");
    }

    // ❌ không được hỏi sản phẩm của chính mình
    if (product.sellerId === userId) {
      throw new Error("You cannot ask question on your own product");
    }

    /* =============================
     * 3️⃣ Insert question
     * ============================= */
    const [question] = await db("questions")
      .insert({
        product_id: productId,
        user_id: userId,
        content: content.trim(),
        created_at: new Date(),
      })
      .returning(["id", "content", "created_at"]);

    /* =============================
     * 4️⃣ Email notify seller
     * ============================= */
    await sendQuestionNotificationMail({
      to: product.sellerEmail,
      receiverName: product.sellerName,
      senderName: user.full_name,
      productTitle: product.productTitle,
      productId: product.productId,
      message: content,
    });

    return {
      id: question.id,
      content: question.content,
      createdAt: question.created_at,
    };
  }

  /* ===============================
   * Q&A - Bidder reply question
   * =============================== */
  static async replyQuestionAsBidder(params: {
    bidderId: string;
    questionId: string;
    content: string;
  }) {
    const { bidderId, questionId, content } = params;

    if (!content || !content.trim()) {
      throw new Error("Reply content is required");
    }

    return await db.transaction(async (trx) => {
      /* =============================
       * 1️⃣ Check bidder
       * ============================= */
      const bidder = await trx("users")
        .select("id", "role", "is_blocked", "full_name", "email")
        .where({ id: bidderId })
        .first();

      if (!bidder) throw new Error("User not found");
      if (bidder.role !== "bidder") {
        throw new Error("Only bidders can reply here");
      }
      if (bidder.is_blocked) {
        throw new Error("Your account is blocked");
      }

      /* =============================
       * 2️⃣ Get question + product + seller + asker
       * ============================= */
      const question = await trx("questions as q")
        .join("products as p", "p.id", "q.product_id")
        .join("users as s", "s.id", "p.seller_id") // seller
        .join("users as a", "a.id", "q.user_id") // asker (bidder hỏi ban đầu)
        .select(
          "q.id as questionId",
          "q.product_id as productId",

          "p.title as productTitle",
          "p.status as productStatus",

          "s.id as sellerId",
          "s.full_name as sellerName",
          "s.email as sellerEmail",

          "a.id as askerId",
          "a.full_name as askerName",
          "a.email as askerEmail"
        )
        .where("q.id", questionId)
        .first();

      if (!question) {
        throw new Error("Question not found");
      }

      if (question.productStatus !== "active") {
        throw new Error("Cannot reply to question of inactive product");
      }

      /* =============================
       * 3️⃣ Insert reply (TIMELINE)
       * ============================= */
      const [reply] = await trx("answers")
        .insert({
          question_id: questionId,
          user_id: bidderId,
          role: "bidder",
          content: content.trim(),
          created_at: new Date(),
        })
        .returning(["id", "content", "created_at"]);

      /* =============================
       * 4️⃣ Send notification emails
       * Rule:
       * - Không gửi cho chính người reply
       * - Seller luôn nhận nếu không phải người reply
       * - Asker nhận nếu khác người reply
       * ============================= */
      const notifiedEmails = new Set<string>();

      // 📧 Notify seller
      if (question.sellerEmail && question.sellerId !== bidderId) {
        notifiedEmails.add(question.sellerEmail);

        await sendQuestionNotificationMail({
          to: question.sellerEmail,
          receiverName: question.sellerName,
          senderName: bidder.full_name,
          productTitle: question.productTitle,
          productId: question.productId,
          message: content,
        });
      }

      // 📧 Notify asker (nếu bidder hiện tại không phải người hỏi ban đầu)
      if (
        question.askerEmail &&
        question.askerId !== bidderId &&
        !notifiedEmails.has(question.askerEmail)
      ) {
        await sendQuestionNotificationMail({
          to: question.askerEmail,
          receiverName: question.askerName,
          senderName: bidder.full_name,
          productTitle: question.productTitle,
          productId: question.productId,
          message: content,
        });
      }

      /* =============================
       * 5️⃣ Return
       * ============================= */
      return {
        id: reply.id,
        content: reply.content,
        createdAt: reply.created_at,
      };
    });
  }

  // ===============================
  // Get system settings by keys
  // ===============================
  static async getSystemSettings(
    keys: string[],
    trx?: any
  ): Promise<Record<string, number>> {
    const query = trx ?? db;

    const rows = await query("system_settings")
      .whereIn("key", keys)
      .select("key", "value");

    const map: Record<string, number> = {};

    for (const row of rows) {
      const num = Number(row.value);
      if (!Number.isNaN(num)) {
        map[row.key] = num;
      }
    }

    return map;
  }

  // ===============================
  // Auto Bid - Place max bid (CORE)
  // ===============================
  static async placeAutoBid(params: {
    userId: string;
    productId: string;
    maxPrice: number;
  }) {
    const { userId, productId, maxPrice } = params;

    if (!Number.isFinite(maxPrice) || maxPrice <= 0) {
      throw new Error("Invalid max price");
    }

    return await db.transaction(async (trx) => {
      /* =============================
       * 1️⃣ Validate bidder
       * ============================= */
      const bidder = await trx("users")
        .select("id", "role", "allow_bid", "is_blocked")
        .where({ id: userId })
        .first();

      if (!bidder) throw new Error("User not found");
      if (bidder.role !== "bidder") throw new Error("Only bidders can bid");
      if (!bidder.allow_bid) throw new Error("You are not allowed to bid");
      if (bidder.is_blocked) throw new Error("Your account is blocked");

      /* =============================
       * 2️⃣ Load product
       * ============================= */
      const product = await trx("products")
        .select(
          "id",
          "seller_id",
          "status",
          "start_price",
          "bid_step",
          "current_price",
          "highest_bidder_id",
          "buy_now_price",
          "end_time",
          "auto_extend"
        )
        .where({ id: productId })
        .first();

      if (!product) throw new Error("Product not found");
      if (product.status !== "active") throw new Error("Auction is not active");
      if (product.seller_id === userId)
        throw new Error("You cannot bid on your own product");

      /* =============================
       * 3️⃣ Blocked bidder
       * ============================= */
      const blocked = await trx("blocked_bidders")
        .where({ product_id: productId, bidder_id: userId })
        .first();

      if (blocked) {
        throw new Error(blocked.reason || "You are blocked from bidding");
      }

      /* =============================
       * 4️⃣ Existing auto bid
       * ============================= */
      const existingAutoBid = await trx("auto_bids")
        .where({ product_id: productId, bidder_id: userId })
        .first();

      if (existingAutoBid && maxPrice <= Number(existingAutoBid.max_price)) {
        throw new Error(
          `New max bid must be higher than your current max (${existingAutoBid.max_price})`
        );
      }

      /* =============================
       * 5️⃣ Upsert auto_bids
       * ============================= */
      await trx("auto_bids")
        .insert({
          product_id: productId,
          bidder_id: userId,
          max_price: maxPrice,
          created_at: new Date(),
        })
        .onConflict(["product_id", "bidder_id"])
        .merge({
          max_price: maxPrice,
          created_at: new Date(), // chỉ dùng cho tie-break
        });

      await trx("auto_bid_events").insert({
        product_id: productId,
        bidder_id: userId,
        type: existingAutoBid ? "max_bid_updated" : "max_bid_set",
        max_bid: maxPrice,
        description: existingAutoBid
          ? "Updated maximum auto bid"
          : "Set maximum auto bid",
      });

      /* =============================
       * 6️⃣ Get top 2 auto bids (KHÔNG sort winner ở SQL)
       * ============================= */
      const autoBids = await trx("auto_bids")
        .where({ product_id: productId })
        .select("bidder_id", "max_price", "created_at")
        .orderBy([
          { column: "max_price", order: "desc" },
          { column: "created_at", order: "asc" }, // chỉ dùng khi max bằng nhau
        ])
        .limit(2);

      /* =============================
       * 7️⃣ Compute winner & price (FINAL – CORRECT)
       * ============================= */

      const bidStep = Number(product.bid_step);
      const startPrice = Number(product.start_price);

      const previousPrice =
        product.current_price !== null
          ? Number(product.current_price)
          : startPrice;

      let newCurrentPrice = previousPrice;
      let highestBidderId = product.highest_bidder_id;

      // CASE 1: chỉ có 1 auto bid
      if (autoBids.length === 1) {
        newCurrentPrice = startPrice + bidStep;
        highestBidderId = autoBids[0].bidder_id;
      }

      // CASE 2: có 2 auto bids
      // CASE 2: có 2 auto bids
      else if (autoBids.length === 2) {
        let [a, b] = autoBids;

        let winner = a;
        let loser = b;

        const aMax = Number(a.max_price);
        const bMax = Number(b.max_price);

        // 1️⃣ ai max lớn hơn → thắng
        if (bMax > aMax) {
          winner = b;
          loser = a;
        }

        // 2️⃣ max bằng nhau → tie-break theo created_at
        else if (aMax === bMax) {
          if (new Date(b.created_at) < new Date(a.created_at)) {
            winner = b;
            loser = a;
          }

          await trx("auto_bid_events").insert({
            product_id: productId,
            bidder_id: winner.bidder_id,
            type: "tie_break_win",
            max_bid: aMax,
            description: "Won tie-break by placing max bid earlier",
          });
        }

        highestBidderId = winner.bidder_id;

        const winnerMax = Number(winner.max_price);
        const loserMax = Number(loser.max_price);

        /**
         * RULE GIÁ (QUAN TRỌNG):
         * - Nếu userId (người vừa đặt/update auto bid) THẮNG
         *   → chỉ cần vượt người cũ 1 step
         *   → min(winnerMax, loserMax + bidStep)
         *
         * - Nếu userId THUA
         *   → giá = max của người mới (loser)
         */
        if (winner.bidder_id === userId) {
          newCurrentPrice = Math.min(winnerMax, loserMax + bidStep);
        } else {
          newCurrentPrice = loserMax;
        }

        // ❌ không cho giảm giá
        if (newCurrentPrice < previousPrice) {
          newCurrentPrice = previousPrice;
        }
      }

      /* =============================
       * 8️⃣ BUY NOW
       * ============================= */
      if (product.buy_now_price && maxPrice >= Number(product.buy_now_price)) {
        await trx("products").where({ id: productId }).update({
          current_price: product.buy_now_price,
          highest_bidder_id: userId,
          status: "closed",
        });

        await trx("bids").insert({
          product_id: productId,
          bidder_id: userId,
          bid_amount: product.buy_now_price,
          bid_time: new Date(),
        });

        await trx("auto_bid_events").insert({
          product_id: productId,
          bidder_id: userId,
          type: "winning",
          amount: product.buy_now_price,
          description: "Won instantly via Buy Now",
        });

        return {
          productId,
          currentPrice: product.buy_now_price,
          highestBidderId: userId,
          isBuyNow: true,
        };
      }

      /* =============================
       * 9️⃣ Apply price change
       * ============================= */
      const priceChanged = newCurrentPrice > previousPrice;
      const winnerChanged = highestBidderId !== product.highest_bidder_id;

      // 👉 Update product nếu CÓ thay đổi
      if (priceChanged || winnerChanged) {
        await trx("products").where({ id: productId }).update({
          current_price: newCurrentPrice,
          highest_bidder_id: highestBidderId,
        });
      }

      // 👉 Chỉ insert bid khi giá tăng
      if (priceChanged) {
        await trx("bids").insert({
          product_id: productId,
          bidder_id: highestBidderId,
          bid_amount: newCurrentPrice,
          bid_time: new Date(),
        });

        await trx("auto_bid_events").insert({
          product_id: productId,
          bidder_id: highestBidderId,
          type: "auto_bid",
          amount: newCurrentPrice,
          description: "System automatically placed a bid",
        });

        const loser = autoBids.find((b) => b.bidder_id !== highestBidderId);

        if (loser) {
          await trx("auto_bid_events").insert({
            product_id: productId,
            bidder_id: loser.bidder_id,
            type: "outbid_instantly",
            amount: newCurrentPrice,
            related_bidder_id: highestBidderId,
            description:
              "Your bid was instantly surpassed by an existing auto bid",
          });
        }
      }

      if (product.auto_extend && priceChanged) {
        // 1️⃣ Load config
        const settings = await trx("system_settings")
          .whereIn("key", [
            "auto_extend_threshold_minutes",
            "auto_extend_duration_minutes",
          ])
          .select("key", "value");

        const cfg = Object.fromEntries(
          settings.map((s) => [s.key, Number(String(s.value).trim())])
        );

        const thresholdMin = cfg.auto_extend_threshold_minutes;
        const durationMin = cfg.auto_extend_duration_minutes;

        if (!Number.isFinite(thresholdMin) || !Number.isFinite(durationMin)) {
          throw new Error("Invalid auto extend config");
        }

        // 2️⃣ Convert minutes → milliseconds
        const thresholdMs = thresholdMin * 60_000;
        const durationMs = durationMin * 60_000;

        // 3️⃣ Reload fresh end_time
        const freshProduct = await trx("products")
          .select("end_time")
          .where({ id: productId })
          .first();

        // 4️⃣ Lấy thời gian từ DB (KHÔNG dùng Date.now)
        const [{ now }] = (await trx.raw("SELECT NOW()")).rows;
        const dbNow = new Date(now).getTime();

        const endTime = new Date(freshProduct.end_time).getTime();
        const remainingMs = endTime - dbNow;

        console.log("[AUTO EXTEND CHECK]", {
          remainingMinutes: Math.round(remainingMs / 60000),
          thresholdMinutes: thresholdMin,
        });

        // 5️⃣ Chỉ extend khi auction CHƯA HẾT & trong threshold
        if (remainingMs > 0 && remainingMs <= thresholdMs) {
          const newEndTime = new Date(endTime + durationMs);

          await trx("products").where({ id: productId }).update({
            end_time: newEndTime,
          });

          console.log("[AUTO EXTENDED]", {
            oldEndTime: new Date(endTime),
            newEndTime,
          });
        }
      }

      return {
        productId,
        currentPrice: newCurrentPrice,
        highestBidderId,
        isBuyNow: false,
        isUpdate: !!existingAutoBid,
      };
    });
  }

  static async sendBidRequest(params: {
    productId: string;
    bidderId: string;
    message?: string;
  }) {
    const { productId, bidderId, message } = params;

    return await db.transaction(async (trx) => {
      /* =============================
       * 1️⃣ Load product
       * ============================= */
      const product = await trx("products")
        .select("id", "seller_id", "bid_requirement", "status")
        .where({ id: productId })
        .first();

      if (!product) throw new Error("Product not found");
      if (product.status !== "active") throw new Error("Auction is not active");

      if (product.bid_requirement !== "qualified") {
        throw new Error("This auction does not require approval");
      }

      if (product.seller_id === bidderId) {
        throw new Error("You cannot request bidding on your own product");
      }

      /* =============================
       * 2️⃣ Check existing request
       * ============================= */
      const existing = await trx("bid_requests")
        .where({
          product_id: productId,
          bidder_id: bidderId,
        })
        .first();

      if (existing) {
        throw new Error(`You already sent a request (${existing.status})`);
      }

      /* =============================
       * 3️⃣ Create request
       * ============================= */
      const [request] = await trx("bid_requests")
        .insert({
          product_id: productId,
          bidder_id: bidderId,
          seller_id: product.seller_id,
          message: message ?? null,
        })
        .returning("*");
      return request;
    });
  }

  // ===============================
  // Buy Now - Instant purchase
  // ===============================
  static async buyNow(params: { userId: string; productId: string }) {
    const { userId, productId } = params;

    return await db.transaction(async (trx) => {
      /* =============================
       * 1️⃣ Lock product (chống race)
       * ============================= */
      const product = await trx("products")
        .where({ id: productId })
        .forUpdate()
        .first();

      if (!product) throw new Error("Product not found");
      if (product.status !== "active") throw new Error("Auction is not active");
      if (!product.buy_now_price) throw new Error("Buy Now is not available");
      if (product.seller_id === userId)
        throw new Error("You cannot buy your own product");

      /* =============================
       * 2️⃣ Check auction time (DB clock)
       * ============================= */
      const [{ now }] = (await trx.raw("SELECT NOW()")).rows;
      const dbNow = new Date(now).getTime();
      const endTime = new Date(product.end_time).getTime();

      if (endTime <= dbNow) {
        throw new Error("Auction has already ended");
      }

      /* =============================
       * 3️⃣ Check buyer eligibility
       * ============================= */
      const bidder = await trx("users")
        .select("id", "role", "allow_bid", "is_blocked")
        .where({ id: userId })
        .first();

      if (!bidder) throw new Error("User not found");
      if (bidder.role !== "bidder") throw new Error("Only bidders can buy now");
      if (!bidder.allow_bid) throw new Error("You are not allowed to bid");
      if (bidder.is_blocked) throw new Error("Your account is blocked");

      /* =============================
       * 5️⃣ Close auction immediately
       * ============================= */
      await trx("products").where({ id: productId }).update({
        status: "closed",
        current_price: product.buy_now_price,
        highest_bidder_id: userId,
        end_time: now,
      });

      /* =============================
       * 6️⃣ Insert bid record (type = buy_now)
       * ============================= */
      await trx("bids").insert({
        product_id: productId,
        bidder_id: userId,
        bid_amount: product.buy_now_price,
        bid_time: now,
      });

      /* =============================
       * 7️⃣ Create order (idempotent)
       * ============================= */
      await trx("orders")
        .insert({
          product_id: productId,
          buyer_id: userId,
          seller_id: product.seller_id,
          final_price: product.buy_now_price,
          status: "pending_payment",
          payment_deadline: trx.raw("NOW() + INTERVAL '24 HOURS'"),
        })
        .onConflict("product_id")
        .ignore();

      /* =============================
       * 8️⃣ Event log
       * ============================= */
      await trx("auto_bid_events").insert({
        product_id: productId,
        bidder_id: userId,
        type: "winning",
        amount: product.buy_now_price,
        description: "Auction won via Buy Now",
      });

      return {
        productId,
        finalPrice: product.buy_now_price,
        buyerId: userId,
        status: "closed",
        isBuyNow: true,
      };
    });
  }
}
