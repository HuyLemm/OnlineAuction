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
    .leftJoin("bids as b", "b.product_id", "p.id")
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
      "p.end_time as end_time",
      "c.name as category",
      "c.id as categoryId",
      db.raw(`COALESCE(MAX(b.bid_amount), p.start_price) AS "currentBid"`),
      db.raw(`COUNT(b.id) AS "bids"`),
      db.raw(`COALESCE(pi.image_url, '') AS "image"`)
    )
    .groupBy("p.id", "pi.image_url", "c.name", "c.id", "u.full_name");
}

export async function getTop5EndingSoonService() {
  return baseQuery()
    .where("p.status", "active")
    .orderBy("p.end_time", "asc")
    .limit(5);
}

export async function getTop5MostBidsService() {
  return baseQuery()
    .where("p.status", "active")
    .havingRaw("COUNT(b.id) > 0")
    .orderBy("bids", "desc")
    .limit(5);
}

export async function getTop5HighestPriceService() {
  return baseQuery()
    .where("p.status", "active")
    .orderBy("currentBid", "desc")
    .limit(5);
}
