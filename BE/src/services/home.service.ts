// src/services/home.service.ts
import dayjs from "dayjs";
import { db } from "../config/db";
import { HomeProductDTO } from "../dto/home.dto";

export class HomeService {
  // ===============================
  // Helpers
  // ===============================

  private static baseQuery() {
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

  /**
   * Map raw DB row → HomeProductDTO
   */
  private static mapToHomeDTO(item: any): HomeProductDTO {
    const end = dayjs(item.end_time);
    const now = dayjs();
    const diffYears = end.diff(now, "year");

    return {
      id: item.id,
      title: item.title,

      category: item.category,
      categoryId: item.categoryId,

      image: item.image,

      postedDate: item.postedDate,
      end_time: item.end_time,

      auctionType: item.auctionType,
      buyNowPrice: item.buyNowPrice,

      currentBid: Number(item.currentBid),
      bids: Number(item.bids),

      highestBidderId: item.highestBidderId ?? null,
      highestBidderName: item.highestBidderName ?? null,

      isHot: Number(item.bids) > 7,
      endingSoon: diffYears < 10,
    };
  }

  // ===============================
  // GET Top 5 Ending Soon
  // ===============================
  static async getTop5EndingSoon(): Promise<HomeProductDTO[]> {
    const rows = await HomeService.baseQuery()
      .where("p.status", "active")
      .orderBy("p.end_time", "asc")
      .limit(5);

    return rows.map(HomeService.mapToHomeDTO);
  }

  // ===============================
  // GET Top 5 Most Bids
  // ===============================
  static async getTop5MostBids(): Promise<HomeProductDTO[]> {
    const rows = await HomeService.baseQuery()
      .where("p.status", "active")
      .havingRaw("COUNT(b.id) > 0")
      .orderBy("bids", "desc")
      .limit(5);

    return rows.map(HomeService.mapToHomeDTO);
  }

  // ===============================
  // GET Top 5 Highest Price
  // ===============================
  static async getTop5HighestPrice(): Promise<HomeProductDTO[]> {
    const rows = await HomeService.baseQuery()
      .where("p.status", "active")
      .orderBy("currentBid", "desc")
      .limit(5);

    return rows.map(HomeService.mapToHomeDTO);
  }
}
