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

  // Category Filter
  if (categories && categories.length > 0) {
    const catIds = categories.map(Number); // chuyển string → number array
    query = query.whereIn("p.category_id", catIds);
  }

  // PRICE FILTER using HAVING for aggregated expression
  query = query.havingRaw(
    `COALESCE(p.current_price, p.start_price)::int BETWEEN ? AND ?`,
    [minPrice, maxPrice]
  );

  // Clone before sorting/pagination
  const filtered = await query.clone();
  const total = filtered.length;

  // Sort
  switch (sort) {
    case "ending-soon":
      query = query.orderBy("p.end_time", "asc");
      break;
    case "newly-listed":
      query = query.orderBy("p.created_at", "desc");
      break;
    case "price-low":
      query = query.orderBy("currentBid", "asc");
      break;
    case "price-high":
      query = query.orderBy("currentBid", "desc");
      break;
    case "most-bids":
      query = query.orderBy("currentBid", "desc");
      break;
  }

  const data = await query.limit(limit).offset(offset);

  return { data, total };
}

// 🔥 Full-Text Search + Prefix + Ranking + Category Filter + Sorting + Pagination
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

  const formattedKeyword = hasKeyword
    ? keyword.trim().replace(/\s+/g, " & ") + ":*"
    : "";

  const searchVector = `to_tsvector('english', p.title || ' ' || c.name)`;
  const searchQuery = `to_tsquery('english', ?)`;

  let query = baseQuery();

  // Category filter (parent + children)
  if (categoryIds && categoryIds.length > 0) {
    const allCats = await getDescendantCategories(categoryIds);
    query.whereIn("p.category_id", allCats);
  }

  // Full-text search chỉ chạy khi có keyword
  if (hasKeyword) {
    query
      .select(
        db.raw(`ts_rank(${searchVector}, ${searchQuery}) AS rank`, [
          formattedKeyword,
        ])
      )
      .whereRaw(`${searchVector} @@ ${searchQuery}`, [formattedKeyword]);
  }

  if (hasKeyword) {
    query.orderBy("rank", "desc"); // luôn ưu tiên rank

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
      case "default":
      default:
        break; // không sort thêm khi default
    }
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
      case "default":
      default:
        break; // ❌ không sort gì hết
    }
  }

  const total = (await query.clone()).length;
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
