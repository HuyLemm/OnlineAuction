"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTop5EndingSoonService = getTop5EndingSoonService;
exports.getTop5MostBidsService = getTop5MostBidsService;
exports.getTop5HighestPriceService = getTop5HighestPriceService;
const db_1 = require("../config/db");
function baseQuery() {
    return (0, db_1.db)("products as p")
        .leftJoin("product_images as pi", function () {
        this.on("pi.product_id", "=", "p.id").andOn("pi.is_main", "=", db_1.db.raw("true"));
    })
        .leftJoin("bids as b", "b.product_id", "p.id")
        .leftJoin("categories as c", "c.id", "p.category_id")
        .leftJoin("users as u", "u.id", "p.highest_bidder_id")
        .select("p.id", "p.title", "p.auction_type as auctionType", "p.highest_bidder_id as highestBidderId", "u.full_name as highestBidderName", "p.buy_now_price as buyNowPrice", "p.created_at as postedDate", "p.end_time as end_time", "c.name as category", db_1.db.raw(`COALESCE(MAX(b.bid_amount), p.start_price) AS "currentBid"`), db_1.db.raw(`COUNT(b.id) AS "bids"`), db_1.db.raw(`COALESCE(pi.image_url, '') AS "image"`))
        .groupBy("p.id", "pi.image_url", "c.name", "u.full_name");
}
async function getTop5EndingSoonService() {
    return baseQuery()
        .where("p.status", "active")
        .orderBy("p.end_time", "asc")
        .limit(5);
}
async function getTop5MostBidsService() {
    return baseQuery()
        .where("p.status", "active")
        .havingRaw("COUNT(b.id) > 0")
        .orderBy("bids", "desc")
        .limit(5);
}
async function getTop5HighestPriceService() {
    return baseQuery()
        .where("p.status", "active")
        .orderBy("currentBid", "desc")
        .limit(5);
}
//# sourceMappingURL=home.service.js.map