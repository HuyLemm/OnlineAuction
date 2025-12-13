import { db } from "../config/db";

async function getDescendantCategories(
  categoryIds: number[]
): Promise<number[]> {
  const children = await db("categories")
    .select("id")
    .whereIn("parent_id", categoryIds);

  if (children.length === 0) return categoryIds;

  const childIds = children.map((c) => c.id);

  return [
    ...new Set([...categoryIds, ...(await getDescendantCategories(childIds))]),
  ];
}

function baseQuery() {
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
      "c.name as category",

      db.raw(`COALESCE(p.current_price, p.start_price)::int AS "currentBid"`),
      db.raw(`COALESCE(pi.image_url, '') AS "image"`),
      db.raw("COUNT(b.id) AS bids")
    )
    .where("p.status", "active")
    .groupBy("p.id", "pi.image_url", "c.name", "u.full_name");
}

// --------------------------------------------------
// 🔥 Full Text Search utilities: AND + OR fallback
// --------------------------------------------------

function buildTsQueryAND(keyword: string): string {
  return keyword
    .trim()
    .split(/\s+/)
    .map((w) => `${w}:*`)
    .join(" & ");
}

function buildTsQueryOR(keyword: string): string {
  return keyword
    .trim()
    .split(/\s+/)
    .map((w) => `${w}:*`)
    .join(" | ");
}

// --------------------------------------------------
// 🔥 Browse (no keyword search)
// --------------------------------------------------

export async function getBrowseProductsService({
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

  let query = baseQuery();

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

export async function searchProductsService({
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
  const queryAND = buildTsQueryAND(keyword);
  const queryOR = buildTsQueryOR(keyword);

  let query = baseQuery();

  // Category filter
  if (categoryIds && categoryIds.length > 0) {
    const allCats = await getDescendantCategories(categoryIds);
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
    query = baseQuery();

    if (categoryIds && categoryIds.length > 0) {
      const allCats = await getDescendantCategories(categoryIds);
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

export async function getProductDetailService(productId: string) {
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
      db.raw(`COALESCE(p.current_price, p.start_price)::int AS "currentBid"`)
    )
    .where("p.id", productId)
    .first();

  if (!product) throw new Error("Product not found");

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
  // Seller rating (SUM score)
  // ----------------------------
  const sellerRatingRaw = (await db
    .select(
      db.raw("COALESCE(SUM(score), 0) AS score"),
      db.raw("COUNT(*) AS total")
    )
    .from("ratings")
    .where("to_user", seller.id)
    .first()) as { score: number; total: number } | undefined;

  const sellerRating = {
    score: Number(sellerRatingRaw?.score ?? 0),
    total: Number(sellerRatingRaw?.total ?? 0),
  };

  // ----------------------------
  // Highest bid
  // ----------------------------
  const highestBid = await db("bids")
    .where("product_id", productId)
    .orderBy("bid_amount", "desc")
    .first();

  // ----------------------------
  // Highest bidder + rating
  // ----------------------------
  let highestBidder: { id: string; full_name: string } | null = null;
  let highestBidderRating = { score: 0, total: 0 };

  if (highestBid) {
    highestBidder = await db("users")
      .select("id", "full_name")
      .where("id", highestBid.bidder_id)
      .first();

    if (highestBidder) {
      const bidderRatingRaw = (await db
        .select(
          db.raw("COALESCE(SUM(score), 0) AS score"),
          db.raw("COUNT(*) AS total")
        )
        .from("ratings")
        .where("to_user", highestBid.bidder_id)
        .first()) as { score: number; total: number } | undefined;

      highestBidderRating = {
        score: Number(bidderRatingRaw?.score ?? 0),
        total: Number(bidderRatingRaw?.total ?? 0),
      };
    }
  }

  // ----------------------------
  // Auto bids
  // ----------------------------
  const autoBids = await db("auto_bids")
    .where("product_id", productId)
    .select("id", "bidder_id", "max_price", "created_at");

  // ----------------------------
  // Q&A
  // ----------------------------
  const questions = await db("questions")
    .where("product_id", productId)
    .select("id", "content", "user_id", "created_at");

  const answers = questions.length
    ? await db("answers")
        .whereIn(
          "question_id",
          questions.map((q) => q.id)
        )
        .select("question_id", "content", "created_at", "user_id")
    : [];

  // ----------------------------
  // Related products
  // ----------------------------
  const relatedProducts = await db("products")
    .where("category_id", product.categoryId)
    .andWhereNot("id", productId)
    .limit(5);

  // ----------------------------
  // FINAL RAW RESULT
  // ----------------------------
  return {
    product,
    images,
    seller: {
      id: seller.id,
      name: seller.full_name,
      rating: sellerRating,
    },
    highestBid,
    highestBidder: highestBidder
      ? {
          id: highestBidder.id,
          name: highestBidder.full_name,
          rating: highestBidderRating,
        }
      : null,
    autoBids,
    questions,
    answers,
    relatedProducts,
  };
}
