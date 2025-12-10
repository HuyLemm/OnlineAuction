import { Request, Response } from "express";
import {
  getBrowseProductsService,
  searchProductsService,
} from "../services/product.service";
import dayjs from "dayjs";

function formatBrowseItem(item: any) {
  const end = dayjs(item.end_time);
  const now = dayjs();
  const diffYears = end.diff(now, "year");

  return {
    id: item.id,
    title: item.title,
    category: item.category,
    image: item.image,
    postedDate: item.postedDate,
    auctionType: item.auctionType,
    buyNowPrice: item.buyNowPrice,
    end_time: item.end_time,
    description: item.description,
    currentBid: Number(item.currentBid),
    bids: Number(item.bids),
    highestBidderId: item.highestBidderId ?? null,
    highestBidderName: item.highestBidderName ?? null,
    isHot: Number(item.bids) > 7,
    endingSoon: diffYears < 10,
  };
}

export async function getBrowseProductsController(req: Request, res: Response) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const sort = (req.query.sort as string) || "default";

    // 🔥 Filter Params
    let categories: string[] = [];
    if (req.query.categories) {
      categories = (req.query.categories as string)
        .split(",")
        .filter((x) => x !== "");
    }

    const minPrice = Number(req.query.minPrice) || 0;
    const maxPrice = Number(req.query.maxPrice) || 999999999;

    const { data, total } = await getBrowseProductsService({
      page,
      limit,
      sort,
      categories,
      minPrice,
      maxPrice,
    });

    res.json({
      success: true,
      page,
      limit,
      sort,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      data: data.map(formatBrowseItem),
    });
  } catch (error) {
    console.error("❌ getBrowseProducts Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function searchProductsController(req: Request, res: Response) {
  try {
    const keyword = (req.query.keyword as string) || "";
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 12, 48);
    const sort = (req.query.sort as string) || "default";
    const newMinutes = req.query.newMinutes ? Number(req.query.newMinutes) : 60;

    const categoryIds = req.query.categoryIds
      ? (req.query.categoryIds as string).split(",").map(Number)
      : undefined;

    const result = await searchProductsService({
      keyword,
      categoryIds,
      page,
      limit,
      sort,
      newMinutes,
    });

    return res.json(result);
  } catch (error) {
    console.error("❌ searchProductsController error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
