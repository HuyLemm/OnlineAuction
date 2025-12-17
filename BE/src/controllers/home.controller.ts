// src/controllers/home.controller.ts
import { Request, Response } from "express";
import {
  getTop5EndingSoonService,
  getTop5MostBidsService,
  getTop5HighestPriceService,
} from "../services/home.service";
import { ok, fail } from "../utils/response";

export async function getTop5EndingSoonController(
  req: Request,
  res: Response
) {
  try {
    const data = await getTop5EndingSoonService();
    return ok(res, data);
  } catch (err) {
    console.error("❌ getTop5EndingSoon:", err);
    return fail(res);
  }
}

export async function getTop5MostBidsController(
  req: Request,
  res: Response
) {
  try {
    const data = await getTop5MostBidsService();
    return ok(res, data);
  } catch (err) {
    console.error("❌ getTop5MostBids:", err);
    return fail(res);
  }
}

export async function getTop5HighestPriceController(
  req: Request,
  res: Response
) {
  try {
    const data = await getTop5HighestPriceService();
    return ok(res, data);
  } catch (err) {
    console.error("❌ getTop5HighestPrice:", err);
    return fail(res);
  }
}
