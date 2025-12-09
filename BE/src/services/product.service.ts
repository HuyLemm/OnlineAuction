import { db } from "../config/db";

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
      db.raw(`COALESCE(pi.image_url, '') AS "image"`)
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
  if (categories.length > 0) {
    query = query.whereIn("p.category_id", categories);
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
