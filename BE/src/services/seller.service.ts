import { db } from "../config/db";
import {
  CreateAuctionDTO,
  SellerActiveProductDTO,
  EndedAuctionRow,
} from "../dto/product.dto";

import { RateWinnerInput } from "../dto/seller.dto";

import { supabase } from "../config/supabase";
import crypto from "crypto";
import path from "path";

import { sendQuestionNotificationMail } from "../utils/sendOtpMail";
import { getDbNowMs } from "../utils/time";

/* ===============================
 * Types
 * =============================== */
type AutoExtendSettings = {
  thresholdMinutes: number;
  durationMinutes: number;
};

type UploadedImage = {
  url: string;
  isMain: boolean;
};

type ActiveListingRow = {
  id: string;
  title: string;
  description: string;

  start_price: number;
  current_price: number | null;
  buy_now_price: number | null;

  bid_step: number;

  end_time: Date;

  category: string;
  image: string | null;

  bid_count: string; // COUNT() từ Postgres
};

export class SellerService {
  /* ===============================
   * INTERNAL: read auto-extend config
   * =============================== */
  static async getAutoExtendSettings(): Promise<AutoExtendSettings> {
    const rows = await db("system_settings").select("key", "value");

    let thresholdMinutes: number | null = null;
    let durationMinutes: number | null = null;

    for (const row of rows) {
      const key = String(row.key).trim();
      const value = Number(String(row.value).trim());

      if (Number.isNaN(value)) continue;

      if (key.includes("threshold") && key.includes("minute")) {
        thresholdMinutes = value;
      }

      if (key.includes("duration") && key.includes("minute")) {
        durationMinutes = value;
      }
    }

    if (
      thresholdMinutes === null ||
      durationMinutes === null ||
      thresholdMinutes <= 0 ||
      durationMinutes <= 0
    ) {
      throw new Error("Auto-extend system settings are invalid");
    }

    return {
      thresholdMinutes,
      durationMinutes,
    };
  }

  /* ===============================
   * PUBLIC: get auto-extend config
   * =============================== */
  static async getAutoExtendConfig() {
    try {
      return await SellerService.getAutoExtendSettings();
    } catch {
      return {
        thresholdMinutes: 0,
        durationMinutes: 0,
      };
    }
  }

  /* ===============================
   * Upload image to Supabase Storage (TEMP)
   * =============================== */
  static async uploadTempProductImage(params: {
    file: Express.Multer.File;
    uploadSessionId: string;
  }) {
    const { file, uploadSessionId } = params;

    if (!file) throw new Error("No file uploaded");
    if (!uploadSessionId) throw new Error("uploadSessionId is required");
    if (!file.mimetype.startsWith("image/")) {
      throw new Error("Only image files are allowed");
    }

    const ext = path.extname(file.originalname) || ".jpg";
    const fileName = `${crypto.randomUUID()}${ext}`;
    const storagePath = `tmp/${uploadSessionId}/${fileName}`;

    const { error } = await supabase.storage
      .from("product_images")
      .upload(storagePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) throw new Error(error.message);

    const { data } = supabase.storage
      .from("product_images")
      .getPublicUrl(storagePath);

    return {
      url: data.publicUrl,
      path: storagePath,
    };
  }

  /* ===============================
   * INTERNAL: move images tmp → products/{productId}
   * =============================== */
  private static async moveImagesFromTmpToProduct(
    uploadSessionId: string,
    productId: string
  ): Promise<UploadedImage[]> {
    const bucket = supabase.storage.from("product_images");

    const { data: files, error } = await bucket.list(`tmp/${uploadSessionId}`);

    if (!files || files.length === 0) {
      throw new Error("No uploaded images found");
    }

    files.sort((a, b) => {
      const t1 = new Date(a.created_at ?? 0).getTime();
      const t2 = new Date(b.created_at ?? 0).getTime();
      return t1 - t2;
    });

    if (error) {
      throw new Error("Failed to list uploaded images");
    }

    if (!files || files.length === 0) {
      throw new Error("No uploaded images found");
    }

    const movedImages: UploadedImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file) continue;

      const fromPath = `tmp/${uploadSessionId}/${file.name}`;
      const toPath = `products/${productId}/${file.name}`;

      // download
      const { data: fileData } = await bucket.download(fromPath);
      if (!fileData) continue;

      // upload to final location
      await bucket.upload(toPath, fileData, {
        upsert: true,
      });

      // delete temp
      await bucket.remove([fromPath]);

      const { data: publicUrl } = bucket.getPublicUrl(toPath);

      movedImages.push({
        url: publicUrl.publicUrl,
        isMain: i === 0, // ảnh đầu tiên là main
      });
    }

    return movedImages;
  }

  /* ===============================
   * Create Auction (FINAL)
   * =============================== */
  static async createAuction(dto: CreateAuctionDTO) {
    return await db.transaction(async (trx) => {
      /* 1️⃣ Check seller */
      const seller = await trx("users")
        .select("id", "role", "is_blocked")
        .where({ id: dto.sellerId })
        .first();

      if (!seller) throw new Error("Seller not found");
      if (seller.role !== "seller") {
        throw new Error("Only sellers can create auctions");
      }
      if (seller.is_blocked) {
        throw new Error("Your account is blocked");
      }

      /* 2️⃣ Auto-extend config */
      let autoExtendConfig: AutoExtendSettings | null = null;
      if (dto.autoExtend === true) {
        autoExtendConfig = await SellerService.getAutoExtendSettings();
      }

      /* 3️⃣ Validate duration */
      if (!dto.durationMinutes || dto.durationMinutes <= 0) {
        throw new Error("Invalid auction duration");
      }

      if (!dto.uploadSessionId) {
        throw new Error("uploadSessionId is required");
      }

      const dbNowMs = await getDbNowMs(trx);
      const endTime = new Date(dbNowMs + dto.durationMinutes * 60 * 1000);

      /* 4️⃣ Insert product */
      const [product] = await trx("products")
        .insert({
          title: dto.title,
          category_id: dto.categoryId,
          seller_id: dto.sellerId,

          start_price: dto.startPrice,
          bid_step: dto.bidStep,
          buy_now_price: dto.buyNowPrice ?? null,

          current_price: dto.startPrice,
          highest_bidder_id: null,
          bid_requirement: dto.bidRequirement,

          auction_type: dto.auctionType,
          status: "active",

          description: dto.description,

          auto_extend: dto.autoExtend,
          end_time: endTime,

          created_at: trx.raw("NOW()"),
        })
        .returning(["id"]);

      const images = await SellerService.moveImagesFromTmpToProduct(
        dto.uploadSessionId,
        product.id
      );

      if (images.length < 3) {
        throw new Error("At least 3 images are required");
      }

      await trx("product_images").insert(
        images.map((img) => ({
          product_id: product.id,
          image_url: img.url,
          is_main: img.isMain,
        }))
      );

      return {
        message: "Auction created successfully",
        productId: product.id,
        endTime,
        autoExtend: dto.autoExtend ? autoExtendConfig : null,
      };
    });
  }
  /* ===============================
   * Get active listings of seller
   * =============================== */
  static async getMyActiveListings(
    sellerId: string
  ): Promise<SellerActiveProductDTO[]> {
    const rows = (await db("products as p")
      .join("categories as c", "c.id", "p.category_id")
      .leftJoin("product_images as img", function () {
        this.on("img.product_id", "p.id").andOn("img.is_main", db.raw("true"));
      })
      .leftJoin("bids as b", "b.product_id", "p.id")
      .where("p.seller_id", sellerId)
      .andWhere("p.status", "active")
      .groupBy("p.id", "c.name", "img.image_url")
      .orderBy("p.end_time", "asc")
      .select(
        "p.id",
        "p.title",
        "p.description",
        "p.start_price",
        "p.current_price",
        "p.bid_step",
        "p.buy_now_price",
        "p.end_time",
        "c.name as category",
        "img.image_url as image"
      )
      .count("b.id as bid_count")) as ActiveListingRow[];

    const dbNowMs = await getDbNowMs();

    return rows.map((row) => ({
      id: String(row.id),
      title: row.title,
      category: row.category,
      description: row.description,

      startingBid: Number(row.start_price),
      currentBid:
        row.current_price !== null
          ? Number(row.current_price)
          : Number(row.start_price),

      bid_count: row.bid_count,

      bid_step: Number(row.bid_step),

      buyNowPrice:
        row.buy_now_price !== null ? Number(row.buy_now_price) : null,

      image: row.image ?? null,

      endDate: new Date(row.end_time).toISOString(),
      timeLeft: Math.max(
        0,
        Math.floor((new Date(row.end_time).getTime() - dbNowMs) / 1000)
      ),
    }));
  }

  static async appendProductDescription(params: {
    sellerId: string;
    productId: string;
    content: string;
  }) {
    const { sellerId, productId, content } = params;

    return await db.transaction(async (trx) => {
      const product = await trx("products")
        .select("id", "description", "seller_id", "status")
        .where({ id: productId })
        .first();

      if (!product) throw new Error("Product not found");
      if (product.seller_id !== sellerId) throw new Error("Not allowed");
      if (product.status !== "active")
        throw new Error("Cannot edit inactive auction");

      const [{ now }] = (await trx.raw("SELECT NOW()")).rows;
      const today = new Date(now).toLocaleDateString("vi-VN");

      const appendedBlock = `
      <hr />
      <p><strong>${today}</strong> - ${content}</p>
    `;

      const newDescription = (product.description ?? "") + appendedBlock;

      await trx("products").where({ id: productId }).update({
        description: newDescription,
      });

      return { success: true };
    });
  }

  /* ===============================
   * Get ended auctions with winner + rating
   * =============================== */
  static async getEndedAuctions(sellerId: string): Promise<EndedAuctionRow[]> {
    const rows = (await db("products as p")
      // winner
      .join("users as u", "u.id", "p.highest_bidder_id")

      // main image
      .leftJoin("product_images as img", function () {
        this.on("img.product_id", "p.id").andOn("img.is_main", db.raw("true"));
      })

      // ⭐ aggregate rating of buyer (all users)
      .leftJoin(
        db("ratings")
          .select(
            "to_user",
            db.raw("COALESCE(SUM(score), 0) AS score"),
            db.raw("COUNT(*) AS total")
          )
          .groupBy("to_user")
          .as("r_agg"),
        "r_agg.to_user",
        "u.id"
      )

      // ⭐ rating của CHÍNH seller này cho product này
      .leftJoin("ratings as r_my", function () {
        this.on("r_my.product_id", "p.id").andOn(
          "r_my.from_user",
          db.raw("?", [sellerId])
        );
      })

      // 🔒 quyền + trạng thái
      .where("p.seller_id", sellerId)
      .whereIn("p.status", ["closed", "expired"])

      .orderBy("p.end_time", "desc")

      .select(
        "p.id",
        "p.title",
        "p.current_price",
        "p.end_time",

        "u.id as buyer_id",
        "u.full_name as buyer_name",

        "img.image_url as image",

        // aggregate buyer rating
        db.raw("COALESCE(r_agg.score, 0) AS buyer_rating_score"),
        db.raw("COALESCE(r_agg.total, 0) AS buyer_rating_total"),

        // ⭐ rating của seller hiện tại
        "r_my.score as my_rating_score",
        "r_my.comment as my_rating_comment"
      )) as EndedAuctionRow[];

    return rows;
  }

  /* ===============================
   * Rate winner of ended auction
   * =============================== */
  static async rateWinner(input: RateWinnerInput) {
    const { sellerId, productId, score, comment } = input;

    if (![1, -1].includes(score)) {
      throw new Error("Invalid score");
    }

    if (!comment || !comment.trim()) {
      throw new Error("Comment is required");
    }

    return await db.transaction(async (trx) => {
      /* 1️⃣ Lấy product + check quyền */
      const product = await trx("products")
        .select("id", "seller_id", "status", "highest_bidder_id")
        .where({ id: productId })
        .first();

      if (!product) {
        throw new Error("Product not found");
      }

      if (product.seller_id !== sellerId) {
        throw new Error("You are not the seller of this product");
      }

      if (product.status !== "closed") {
        throw new Error("Auction is not ended");
      }

      if (!product.highest_bidder_id) {
        throw new Error("This auction has no winner");
      }

      /* 2️⃣ Check rating đã tồn tại chưa */
      const existing = await trx("ratings")
        .where({
          from_user: sellerId,
          product_id: productId,
        })
        .first();

      /* 3️⃣ INSERT hoặc UPDATE */
      if (existing) {
        // 👉 UPDATE (EDIT rating)
        await trx("ratings").where({ id: existing.id }).update({
          score,
          comment: comment.trim(),
          created_at: trx.raw("NOW()"), // hoặc updated_at nếu bạn có
        });

        return {
          message: "Rating updated successfully",
          score,
          updated: true,
        };
      }

      // 👉 INSERT (rate lần đầu)
      await trx("ratings").insert({
        from_user: sellerId,
        to_user: product.highest_bidder_id,
        product_id: productId,
        score,
        comment: comment.trim(),
        created_at: trx.raw("NOW()"),
      });

      return {
        message: "Rating submitted successfully",
        score,
        created: true,
      };
    });
  }

  /* ===============================
   * Q&A - Seller answer question
   * =============================== */
  static async answerQuestion(params: {
    sellerId: string;
    questionId: string;
    content: string;
  }) {
    const { sellerId, questionId, content } = params;

    if (!content || !content.trim()) {
      throw new Error("Answer content is required");
    }

    return await db.transaction(async (trx) => {
      /* =============================
       * 1️⃣ Check seller
       * ============================= */
      const seller = await trx("users")
        .select("id", "role", "is_blocked", "full_name")
        .where({ id: sellerId })
        .first();

      if (!seller) throw new Error("Seller not found");
      if (seller.role !== "seller") {
        throw new Error("Only sellers can answer questions");
      }
      if (seller.is_blocked) {
        throw new Error("Your account is blocked");
      }

      /* =============================
       * 2️⃣ Get question + product + bidder
       * ============================= */
      const question = await trx("questions as q")
        .join("products as p", "p.id", "q.product_id")
        .join("users as u", "u.id", "q.user_id") // bidder
        .select(
          "q.id as questionId",
          "q.product_id as productId",

          "p.title as productTitle",
          "p.seller_id as sellerId",
          "p.status as productStatus",

          "u.id as bidderId",
          "u.full_name as bidderName",
          "u.email as bidderEmail"
        )
        .where("q.id", questionId)
        .first();

      if (!question) {
        throw new Error("Question not found");
      }

      if (question.sellerId !== sellerId) {
        throw new Error("You are not the seller of this product");
      }

      if (question.productStatus !== "active") {
        throw new Error("Cannot answer question for inactive product");
      }

      /* =============================
       * 3️⃣ Insert answer (timeline)
       * ============================= */
      const [answer] = await trx("answers")
        .insert({
          question_id: questionId,
          user_id: sellerId,
          role: "seller",
          content: content.trim(),
          created_at: trx.raw("NOW()"),
        })
        .returning(["id", "content", "created_at"]);

      /* =============================
       * 4️⃣ Send mail to bidder
       * ============================= */
      if (question.bidderEmail) {
        await sendQuestionNotificationMail({
          to: question.bidderEmail,
          receiverName: question.bidderName,
          senderName: seller.full_name,
          productTitle: question.productTitle,
          productId: question.productId,
          message: content,
        });
      }

      return {
        id: answer.id,
        content: answer.content,
        createdAt: answer.created_at,
      };
    });
  }

  /* ======================================
   * 1️⃣ GET – List bid requests of a product
   * ====================================== */
  static async getBidRequests(params: { sellerId: string; productId: string }) {
    const { sellerId, productId } = params;

    const rows = await db("bid_requests as br")
      .join("users as u", "u.id", "br.bidder_id")
      .leftJoin("ratings as r", "r.to_user", "u.id")
      .where({
        "br.product_id": productId,
        "br.seller_id": sellerId,
      })
      .groupBy("br.id", "u.id")
      .select(
        "br.id",
        "br.status",
        "br.message",
        "br.created_at",
        "u.id as bidderId",
        "u.full_name as bidderName",
        db.raw("COUNT(r.id) AS totalVotes"),
        db.raw("SUM(CASE WHEN r.score > 0 THEN 1 ELSE 0 END) AS positiveVotes")
      )
      .orderBy("br.created_at", "desc");

    return rows.map((r) => {
      const totalVotes = Number(r.totalVotes ?? 0);
      const positiveVotes = Number(r.positiveVotes ?? 0);

      return {
        id: r.id,
        status: r.status,
        message: r.message,
        createdAt: r.created_at,
        bidder: {
          id: r.bidderId,
          name: r.bidderName,
          rating: {
            totalVotes,
            positiveVotes,
            positiveRate:
              totalVotes > 0
                ? Number(((positiveVotes / totalVotes) * 100).toFixed(1))
                : 0,
          },
        },
      };
    });
  }

  /* ======================================
   * 2️⃣ POST – Approve / Reject bid request
   * ====================================== */
  static async handleBidRequest(params: {
    sellerId: string;
    requestId: string;
    action: "approve" | "reject";
  }) {
    const { sellerId, requestId, action } = params;

    const request = await db("bid_requests")
      .where({
        id: requestId,
        seller_id: sellerId,
      })
      .first();

    if (!request) {
      throw new Error("Bid request not found or not authorized");
    }

    if (request.status !== "pending") {
      throw new Error("Request already processed");
    }

    const newStatus = action === "approve" ? "approved" : "rejected";

    await db("bid_requests").where({ id: requestId }).update({
      status: newStatus,
      updated_at: db.raw("NOW()"),
    });

    return {
      requestId,
      status: newStatus,
      productId: request.product_id,
      bidderId: request.bidder_id,
    };
  }

  static async getActiveBidders(productId: string, sellerId: string) {
    // =============================
    // 1️⃣ Check product ownership
    // =============================
    const product = await db("products")
      .select("id", "seller_id")
      .where({ id: productId })
      .first();

    if (!product) throw new Error("Product not found");
    if (product.seller_id !== sellerId)
      throw new Error("You are not allowed to view bidders of this product");

    // =============================
    // 2️⃣ Active bidders = bids ∪ auto_bids
    // =============================
    const bidders = await db
      .with("active_bidders", (qb) => {
        qb.select("bidder_id")
          .from("bids")
          .where("product_id", productId)
          .union(
            db("auto_bids").select("bidder_id").where("product_id", productId)
          );
      })
      .select(
        "u.id",
        "u.full_name",
        "u.email",
        db.raw("COUNT(DISTINCT b.id)::int AS bidsCount"),
        db.raw("MAX(b.bid_amount)::int AS highestBid"),
        db.raw("MAX(ab.max_price)::int AS maxAutoBid")
      )
      .from("active_bidders as abx")
      .join("users as u", "u.id", "abx.bidder_id")
      .leftJoin("bids as b", function () {
        this.on("b.bidder_id", "=", "u.id").andOn(
          "b.product_id",
          "=",
          db.raw("?", [productId])
        );
      })
      .leftJoin("auto_bids as ab", function () {
        this.on("ab.bidder_id", "=", "u.id").andOn(
          "ab.product_id",
          "=",
          db.raw("?", [productId])
        );
      })
      // ❌ loại bidder đã bị block
      .whereNotExists(function () {
        this.select(1)
          .from("blocked_bidders")
          .whereRaw("blocked_bidders.product_id = ?", [productId])
          .andWhereRaw("blocked_bidders.bidder_id = u.id");
      })
      .groupBy("u.id", "u.full_name", "u.email")
      // ✅ ORDER BY ĐÚNG
      .orderByRaw("MAX(b.bid_amount) DESC NULLS LAST");

    return bidders;
  }

  static async kickBidderFromAuction(params: {
    sellerId: string;
    productId: string;
    bidderId: string;
    reason?: string;
  }) {
    const { sellerId, productId, bidderId, reason } = params;

    return await db.transaction(async (trx) => {
      /* =============================
       * 1️⃣ Check product ownership
       * ============================= */
      const product = await trx("products")
        .select("id", "seller_id", "highest_bidder_id")
        .where({ id: productId })
        .first();

      if (!product) throw new Error("Product not found");
      if (product.seller_id !== sellerId) {
        throw new Error(
          "You are not allowed to block bidders for this product"
        );
      }

      if (product.seller_id === bidderId) {
        throw new Error("Seller cannot block himself");
      }

      /* =============================
       * 2️⃣ Insert blocked bidder
       * ============================= */
      await trx("blocked_bidders")
        .insert({
          product_id: productId,
          bidder_id: bidderId,
          seller_id: sellerId,
          reason: reason || "Blocked by seller",
          created_at: trx.raw("NOW()"),
        })
        .onConflict(["product_id", "bidder_id"])
        .ignore();

      /* =============================
       * 3️⃣ Remove auto-bid
       * ============================= */
      await trx("auto_bids")
        .where({
          product_id: productId,
          bidder_id: bidderId,
        })
        .del();

      /* =============================
       * 4️⃣ Log kick event (CHỈ 1 LẦN)
       * ============================= */
      await trx("auto_bid_events").insert({
        product_id: productId,
        bidder_id: bidderId,
        type: "kicked",
        description: "Bidder was removed by seller during auction",
      });

      return {
        productId,
        bidderId,
        wasHighest: product.highest_bidder_id === bidderId,
      };
    });
  }

  static async recalculateAfterKick(params: {
    productId: string;
    kickedBidderId: string;
  }) {
    const { productId, kickedBidderId } = params;

    return await db.transaction(async (trx) => {
      /* =============================
       * 1️⃣ Load product
       * ============================= */
      const product = await trx("products")
        .select(
          "id",
          "status",
          "start_price",
          "bid_step",
          "current_price",
          "highest_bidder_id"
        )
        .where({ id: productId })
        .first();

      if (!product) throw new Error("Product not found");
      if (product.status !== "active") return null;

      // Nếu bidder bị kick KHÔNG phải highest → không cần recalc
      if (product.highest_bidder_id !== kickedBidderId) {
        return {
          productId,
          skipped: true,
          reason: "Kicked bidder was not highest bidder",
        };
      }

      const startPrice = Number(product.start_price);
      const bidStep = Number(product.bid_step);

      /* =============================
       * 2️⃣ Load auto-bids còn lại
       * ============================= */
      const autoBids = await trx("auto_bids")
        .where({ product_id: productId })
        .select("bidder_id", "max_price", "created_at")
        .orderBy([
          { column: "max_price", order: "desc" },
          { column: "created_at", order: "asc" },
        ])
        .limit(2);

      let newHighestBidderId: string | null = null;
      let newCurrentPrice: number;

      /* =============================
       * 3️⃣ Compute winner & price
       * (CHO PHÉP GIẢM GIÁ KHI KICK)
       * ============================= */

      // CASE A: không còn auto-bid nào
      if (autoBids.length === 0) {
        newHighestBidderId = null;
        newCurrentPrice = startPrice;
      }

      // CASE B: chỉ còn 1 auto-bid
      else if (autoBids.length === 1) {
        newHighestBidderId = autoBids[0].bidder_id;
        newCurrentPrice = startPrice + bidStep;
      }

      // CASE C: còn ≥ 2 auto-bids
      else {
        let [a, b] = autoBids;

        let winner = a;
        let loser = b;

        const aMax = Number(a.max_price);
        const bMax = Number(b.max_price);

        // 1️⃣ Max lớn hơn thắng
        if (bMax > aMax) {
          winner = b;
          loser = a;
        }

        // 2️⃣ Max bằng nhau → tie-break theo created_at
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
            description: "Won tie-break after bidder removal",
          });
        }

        newHighestBidderId = winner.bidder_id;

        // ✅ GIÁ ĐÚNG SAU KICK
        newCurrentPrice = Math.min(
          Number(winner.max_price),
          Number(loser.max_price) + bidStep
        );
      }

      /* =============================
       * 4️⃣ Update product state
       * ============================= */
      await trx("products").where({ id: productId }).update({
        highest_bidder_id: newHighestBidderId,
        current_price: newCurrentPrice,
      });

      /* =============================
       * 5️⃣ Log system event ONLY
       * ============================= */
      if (newHighestBidderId) {
        await trx("auto_bid_events").insert({
          product_id: productId,
          bidder_id: newHighestBidderId,
          type: "auto_bid",
          amount: newCurrentPrice,
          description: "Auction recalculated after bidder removal",
        });
      }

      return {
        productId,
        newCurrentPrice,
        newHighestBidderId,
      };
    });
  }
}
