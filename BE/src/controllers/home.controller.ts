import { Request, Response } from "express";
import dayjs from "dayjs";
import {
  getTop5EndingSoonService,
  getTop5MostBidsService,
  getTop5HighestPriceService,
} from "../services/home.service";

function formatItem(item: any) {
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
    auctionType: item.auctionType,
    buyNowPrice: item.buyNowPrice,
    end_time: item.end_time,

    currentBid: Number(item.currentBid),
    bids: Number(item.bids),

    highestBidderId: item.highestBidderId ?? null,
    highestBidderName: item.highestBidderName ?? null,

    isHot: Number(item.bids) > 7,
    endingSoon: diffYears < 10,
  };
}

export async function getTop5EndingSoonController(req: Request, res: Response) {
  try {
    const result = await getTop5EndingSoonService();
    res.json({ success: true, data: result.map(formatItem) });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getTop5MostBidsController(req: Request, res: Response) {
  try {
    const result = await getTop5MostBidsService();
    res.json({ success: true, data: result.map(formatItem) });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getTop5HighestPriceController(
  req: Request,
  res: Response
) {
  try {
    const result = await getTop5HighestPriceService();
    res.json({ success: true, data: result.map(formatItem) });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
