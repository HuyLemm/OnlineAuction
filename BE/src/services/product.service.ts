import { db } from "../config/db";
import {
  AutoBidEventDTO,
  AUTO_BID_EVENT_DESCRIPTION,
  AutoBidEventRow,
  ViewerDTO,
} from "../dto/product.dto";
export class ProductService {
  // ==================================================
  // 🔧 Helpers
  // ==================================================

  private static async getDescendantCategories(
    categoryIds: number[]
  ): Promise<number[]> {
    const children = await db("categories")
      .select("id")
      .whereIn("parent_id", categoryIds);

    if (children.length === 0) return categoryIds;

    const childIds = children.map((c) => c.id);

    return [
      ...new Set([
        ...categoryIds,
        ...(await ProductService.getDescendantCategories(childIds)),
      ]),
    ];
  }

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
  private static buildTsQueryAND(keyword: string): string {
    return keyword
      .trim()
      .split(/\s+/)
      .map((w) => `${w}:*`)
      .join(" & ");
  }

  private static buildTsQueryOR(keyword: string): string {
    return keyword
      .trim()
      .split(/\s+/)
      .map((w) => `${w}:*`)
      .join(" | ");
  }

  static async getBrowseProducts({
    page,
    limit,
    sort,
    categories,
    minPrice,
    maxPrice,
  }: {
    page: number;
    limit: number;
    sort: string;
    categories: string[];
    minPrice: number;
    maxPrice: number;
  }) {
    const offset = (page - 1) * limit;

    let query = ProductService.baseQuery();

    if (categories && categories.length > 0) {
      const catIds = categories.map(Number);
      query = query.whereIn("p.category_id", catIds);
    }

    query = query.havingRaw(
      `COALESCE(p.current_price, p.start_price)::int BETWEEN ? AND ?`,
      [minPrice, maxPrice]
    );

    const filtered = await query.clone();
    const total = filtered.length;

    switch (sort) {
      case "ending-soon":
        query.orderBy("p.end_time", "asc");
        break;
      case "newly-listed":
        query.orderBy("p.created_at", "desc");
        break;
      case "price-low":
        query.orderBy("currentBid", "asc");
        break;
      case "price-high":
        query.orderBy("currentBid", "desc");
        break;
      case "most-bids":
        query.orderBy("currentBid", "desc");
        break;
    }

    const data = await query.limit(limit).offset(offset);

    return { data, total };
  }

  // ==================================================
  // 📦 Browse products (no keyword)
  // ==================================================

  static async searchProducts({
    keyword,
    categoryIds,
    page,
    limit,
    sort,
    newMinutes = 60,
  }: {
    keyword: string;
    categoryIds?: number[] | undefined;
    page: number;
    limit: number;
    sort: string;
    newMinutes?: number;
  }) {
    const offset = (page - 1) * limit;
    const hasKeyword = keyword.trim() !== "";

    const searchVector = "p.search_vector";
    const queryAND = ProductService.buildTsQueryAND(keyword);
    const queryOR = ProductService.buildTsQueryOR(keyword);

    let query = ProductService.baseQuery();

    // Category filter
    if (categoryIds && categoryIds.length > 0) {
      const allCats = await ProductService.getDescendantCategories(categoryIds);
      query.whereIn("p.category_id", allCats);
    }

    if (hasKeyword) {
      query
        .select(
          db.raw(`ts_rank(${searchVector}, to_tsquery('english', ?)) AS rank`, [
            queryAND,
          ])
        )
        .whereRaw(`${searchVector} @@ to_tsquery('english', ?)`, [queryAND]);
    }

    let total = (await query.clone()).length;

    if (hasKeyword && total === 0) {
      query = ProductService.baseQuery();

      if (categoryIds && categoryIds.length > 0) {
        const allCats = await ProductService.getDescendantCategories(
          categoryIds
        );
        query.whereIn("p.category_id", allCats);
      }

      query
        .select(
          db.raw(`ts_rank(${searchVector}, to_tsquery('english', ?)) AS rank`, [
            queryOR,
          ])
        )
        .whereRaw(`${searchVector} @@ to_tsquery('english', ?)`, [queryOR]);

      total = (await query.clone()).length;
    }

    if (hasKeyword) {
      switch (sort) {
        case "price_asc":
          query.orderBy("currentBid", "asc");
          break;
        case "price_desc":
          query.orderBy("currentBid", "desc");
          break;
        case "newest":
          query.orderBy("p.created_at", "desc");
          break;
        case "oldest":
          query.orderBy("p.created_at", "asc");
          break;
        case "ending_soon":
          query.orderBy("p.end_time", "asc");
          break;
      }
      query.orderBy("rank", "desc");
    } else {
      switch (sort) {
        case "price_asc":
          query.orderBy("currentBid", "asc");
          break;
        case "price_desc":
          query.orderBy("currentBid", "desc");
          break;
        case "newest":
          query.orderBy("p.created_at", "desc");
          break;
        case "oldest":
          query.orderBy("p.created_at", "asc");
          break;
        case "ending_soon":
          query.orderBy("p.end_time", "asc");
          break;
      }
    }

    const data = await query.limit(limit).offset(offset);

    return {
      success: true,
      keyword,
      sort,
      page,
      limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      data,
    };
  }

  static async getProductDetail(productId: string, viewerUserId?: string) {
    // ----------------------------
    // Product core info
    // ----------------------------
    const product = await db("products as p")
      .leftJoin("categories as c", "c.id", "p.category_id")
      .select(
        "p.id",
        "p.title",
        "p.description",
        "p.created_at as postedDate",
        "p.end_time as endTime",
        "p.auction_type as auctionType",
        "p.buy_now_price as buyNowPrice",
        "p.category_id as categoryId",
        "c.name as categoryName",
        "p.bid_step as bidStep",
        "p.highest_bidder_id as highestBidderId",
        "p.bid_requirement as bidRequirement",
        db.raw(`COALESCE(p.current_price, p.start_price)::int AS "currentBid"`)
      )
      .where("p.id", productId)
      .first();

    if (!product) throw new Error("Product not found");

    // ----------------------------
    // Viewer (current logged-in user)
    // ----------------------------
    let viewer: ViewerDTO | null = null;

    if (viewerUserId) {
      const viewerRaw = await db("users")
        .select("id", "role")
        .where("id", viewerUserId)
        .first();

      if (viewerRaw) {
        viewer = {
          id: viewerRaw.id,
          role: viewerRaw.role as ViewerDTO["role"],
        };
      }
    }

    // ----------------------------
    // Viewer rating (ONLY bidder)
    // ----------------------------
    if (viewer && viewer.role === "bidder") {
      const viewerRatingRaw = await db("ratings")
        .select(
          db.raw("COUNT(*) AS total"),
          db.raw("SUM(CASE WHEN score > 0 THEN 1 ELSE 0 END) AS positive")
        )
        .where("to_user", viewer.id)
        .first();

      const totalVotes = Number(viewerRatingRaw?.total ?? 0);
      const positiveVotes = Number(viewerRatingRaw?.positive ?? 0);

      viewer.rating = {
        totalVotes,
        positiveVotes,
        positiveRate:
          totalVotes > 0
            ? Number(((positiveVotes / totalVotes) * 100).toFixed(1))
            : 0,
      };
    }

    // ----------------------------
    // Viewer bid eligibility
    // ----------------------------
    if (viewer && viewer.role === "bidder") {
      /* =============================
       * NORMAL AUCTION
       * ============================= */
      if (product.bidRequirement === "normal") {
        viewer.bidEligibility = {
          requirement: "normal",
          status: "allowed",
        };
      }

      /* =============================
       * QUALIFIED AUCTION
       * ============================= */
      if (product.bidRequirement === "qualified") {
        let eligibility: ViewerDTO["bidEligibility"] | null = null;
        // 🔍 1️⃣ Check bid request trước
        const bidRequest = await db("bid_requests")
          .where({
            product_id: product.id,
            bidder_id: viewer.id,
          })
          .first();

        if (bidRequest) {
          if (bidRequest.status === "pending") {
            eligibility = {
              requirement: "qualified",
              status: "pending",
              reason: "Waiting for seller approval",
            };
          } else if (bidRequest.status === "approved") {
            eligibility = {
              requirement: "qualified",
              status: "allowed",
            };
          } else if (bidRequest.status === "rejected") {
            eligibility = {
              requirement: "qualified",
              status: "blocked",
              reason: "Seller rejected your request",
            };
          }
        }

        if (!eligibility) {
          const rating = viewer.rating;

          // ❌ No rating yet
          if (!rating || rating.totalVotes === 0) {
            eligibility = {
              requirement: "qualified",
              status: "need_approval",
              reason: "No rating yet. Seller approval required.",
            };
          }

          // ❌ Rating below threshold
          else if (rating.positiveRate < 80) {
            eligibility = {
              requirement: "qualified",
              status: "blocked",
              reason: "Rating below required 80%",
            };
          }

          // ✅ Qualified
          else {
            eligibility = {
              requirement: "qualified",
              status: "allowed",
            };
          }
        }

        viewer.bidEligibility = eligibility;
      }
    }

    // ----------------------------
    // myAutoBid (max_price của viewer)
    // ----------------------------
    let myAutoBid: {
      maxPrice: number;
      createdAt: Date;
    } | null = null;

    if (viewerUserId) {
      const myBid = await db("auto_bids")
        .where({
          product_id: productId,
          bidder_id: viewerUserId,
        })
        .first();

      if (myBid) {
        myAutoBid = {
          maxPrice: Number(myBid.max_price),
          createdAt: myBid.created_at,
        };
      }
    }

    // ----------------------------
    // isWinning = đang dẫn đầu HIỆN TẠI
    // ----------------------------
    const isWinning =
      !!viewerUserId &&
      !!product.highestBidderId &&
      viewerUserId === product.highestBidderId;

    // ----------------------------
    // Images
    // ----------------------------
    const images = await db("product_images")
      .select("image_url", "is_main")
      .where("product_id", productId);

    // ----------------------------
    // Seller
    // ----------------------------
    const seller = await db("users")
      .select("id", "full_name")
      .where("id", db("products").select("seller_id").where("id", productId))
      .first();

    if (!seller) throw new Error("Seller not found");

    // ----------------------------
    // Seller rating
    // ----------------------------
    const sellerRatingRaw = await db("ratings")
      .select(
        db.raw("COALESCE(SUM(score), 0) AS score"),
        db.raw("COUNT(*) AS total")
      )
      .where("to_user", seller.id)
      .first();

    const positiveVotesRaw = await db("ratings")
      .where("to_user", seller.id)
      .andWhere("score", ">", 0)
      .count<{ count: string }>("id as count")
      .first();

    const totalSalesRaw = await db("products")
      .where("seller_id", seller.id)
      .count<{ count: string }>("id as count")
      .first();

    const totalVotes = Number(sellerRatingRaw?.total ?? 0);
    const positiveVotes = Number(positiveVotesRaw?.count ?? 0);

    const sellerDTO = {
      id: seller.id,
      name: seller.full_name,
      rating: {
        score: Number(sellerRatingRaw?.score ?? 0),
        total: totalVotes,
      },
      totalSales: Number(totalSalesRaw?.count ?? 0),
      positive: {
        rate:
          totalVotes > 0
            ? Number(((positiveVotes / totalVotes) * 100).toFixed(1))
            : 0,
        votes: positiveVotes,
      },
    };

    // ----------------------------
    // Highest bidder (DÙNG product.highestBidderId)
    // ----------------------------
    let highestBidder: { id: string; full_name: string } | null = null;
    let highestBidderRating = { score: 0, total: 0 };

    if (product.highestBidderId) {
      highestBidder = await db("users")
        .select("id", "full_name")
        .where("id", product.highestBidderId)
        .first();

      if (highestBidder) {
        const bidderRatingRaw = (await db
          .select(
            db.raw("COALESCE(SUM(score), 0) AS score"),
            db.raw("COUNT(*) AS total")
          )
          .from("ratings")
          .where("to_user", product.highestBidderId)
          .first()) as { score: number; total: number } | undefined;

        highestBidderRating = {
          score: Number(bidderRatingRaw?.score ?? 0),
          total: Number(bidderRatingRaw?.total ?? 0),
        };
      }
    }

    // ----------------------------
    // Auto bids (raw – debug / admin)
    // ----------------------------
    const autoBids = await db("auto_bids")
      .where("product_id", productId)
      .select("id", "bidder_id", "max_price", "created_at");

    // ----------------------------
    // Bid history (MASK NAME)
    // ----------------------------
    const bidHistoryRaw = await db("bids as b")
      .join("users as u", "u.id", "b.bidder_id")
      .where("b.product_id", productId)
      .orderBy("b.bid_time", "desc")
      .select(
        "b.id as bidId",
        "b.bid_amount as amount",
        "b.bid_time as createdAt",
        "u.id as bidderId",
        "u.full_name as bidderName"
      );

    const maskName = (name: string) =>
      name.length <= 2 ? "**" : "*".repeat(name.length - 2) + name.slice(-2);

    const bidderRatingMap = new Map<string, { score: number; total: number }>();

    for (const bid of bidHistoryRaw) {
      if (bidderRatingMap.has(bid.bidderId)) continue;

      const ratingRaw = (await db
        .select(
          db.raw("COALESCE(SUM(score), 0) AS score"),
          db.raw("COUNT(*) AS total")
        )
        .from("ratings")
        .where("to_user", bid.bidderId)
        .first()) as { score: number; total: number } | undefined;

      bidderRatingMap.set(bid.bidderId, {
        score: Number(ratingRaw?.score ?? 0),
        total: Number(ratingRaw?.total ?? 0),
      });
    }

    const bidHistory = bidHistoryRaw.map((b) => ({
      id: b.bidId,
      amount: Number(b.amount),
      createdAt: b.createdAt,
      bidder: {
        id: b.bidderId,
        name: maskName(b.bidderName),
        rating: bidderRatingMap.get(b.bidderId) ?? { score: 0, total: 0 },
      },
    }));

    // ----------------------------
    // Q&A (GIỮ NGUYÊN)
    // ----------------------------
    const questionsRaw = await db("questions as q")
      .join("users as u", "u.id", "q.user_id")
      .where("q.product_id", productId)
      .select(
        "q.id as questionId",
        "q.content as questionContent",
        "q.created_at as questionCreatedAt",
        "u.id as askerId",
        "u.full_name as askerName"
      )
      .orderBy("q.created_at", "asc");

    const answersRaw = questionsRaw.length
      ? await db("answers as a")
          .join("users as u", "u.id", "a.user_id")
          .whereIn(
            "a.question_id",
            questionsRaw.map((q) => q.questionId)
          )
          .select(
            "a.id as answerId",
            "a.question_id as questionId",
            "a.content",
            "a.created_at",
            "a.role",
            "u.id as userId",
            "u.full_name as userName"
          )
          .orderBy("a.created_at", "asc")
      : [];

    const answersByQuestion = new Map<string, any[]>();

    for (const ans of answersRaw) {
      if (!answersByQuestion.has(ans.questionId)) {
        answersByQuestion.set(ans.questionId, []);
      }

      answersByQuestion.get(ans.questionId)!.push({
        id: ans.answerId,
        content: ans.content,
        createdAt: ans.created_at,
        sender: {
          id: ans.userId,
          name: ans.userName,
          role: ans.role,
        },
      });
    }

    const questions = questionsRaw.map((q) => ({
      id: q.questionId,
      question: {
        content: q.questionContent,
        askedBy: {
          id: q.askerId,
          name: q.askerName,
        },
        askedAt: q.questionCreatedAt,
      },
      messages: answersByQuestion.get(q.questionId) ?? [],
    }));

    // ----------------------------
    // Related products (GIỮ NGUYÊN)
    // ----------------------------
    const relatedProducts = await db("products as p")
      .leftJoin("categories as c", "c.id", "p.category_id")
      .leftJoin("users as u", "u.id", "p.highest_bidder_id")
      .leftJoin("bids as b", "b.product_id", "p.id")
      .leftJoin("product_images as pi", function () {
        this.on("pi.product_id", "=", "p.id").andOn(
          "pi.is_main",
          "=",
          db.raw("true")
        );
      })
      .select(
        "p.id",
        "p.title",
        "p.end_time as endTime",
        "p.auction_type as auctionType",
        "p.buy_now_price as buyNowPrice",
        "p.created_at as postedDate",
        "c.name as category",
        "c.id as categoryId",
        "u.full_name as highestBidderName",
        db.raw(`COALESCE(p.current_price, p.start_price)::int AS "currentBid"`),
        db.raw(`COALESCE(pi.image_url, '') AS "image"`),
        db.raw(`COUNT(b.id)::int AS "bids"`)
      )
      .where("p.status", "active")
      .andWhere("p.category_id", product.categoryId)
      .andWhereNot("p.id", productId)
      .groupBy("p.id", "c.id", "c.name", "pi.image_url", "u.full_name")
      .limit(5);

    const autoBidEventsRaw = (await db("auto_bid_events as e")
      .join("users as u", "u.id", "e.bidder_id")
      .where("e.product_id", productId)
      .orderBy("e.created_at", "asc")
      .select(
        "e.id",
        "e.type as type",
        "e.amount as amount",
        "e.max_bid as maxBid",
        "e.created_at as createdAt",
        "u.id as bidderId",
        "u.full_name as bidderName",
        "e.related_bidder_id as relatedBidderId"
      )) as AutoBidEventRow[];

    const autoBidEvents = autoBidEventsRaw.map((e) => ({
      id: e.id,
      type: e.type,
      bidderId: e.bidderId,
      bidderName: maskName(e.bidderName),
      ...(e.amount != null && { amount: Number(e.amount) }),
      ...(viewerUserId === e.bidderId &&
        e.maxBid != null && {
          maxBid: Number(e.maxBid),
        }),
      createdAt: e.createdAt.toISOString(),
      isYou: viewerUserId === e.bidderId,
      description: AUTO_BID_EVENT_DESCRIPTION[e.type],
      relatedBidderId: e.relatedBidderId,
    }));

    // ----------------------------
    // FINAL RESULT
    // ----------------------------

    return {
      viewer,
      product,
      myAutoBid,
      isWinning,

      images,
      seller: sellerDTO,

      highestBidder: highestBidder
        ? {
            id: highestBidder.id,
            name: highestBidder.full_name,
            rating: highestBidderRating,
          }
        : null,

      autoBids,
      autoBidEvents,
      bidHistory,
      questions,
      relatedProducts,
    };
  }
}
