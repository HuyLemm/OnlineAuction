// src/controllers/home.controller.ts
import { Request, Response } from "express";
import { HomeService } from "../services/home.service";
import { ok, fail } from "../utils/response";

export class HomeController {
  // ===============================
  // GET /home/top-5-ending-soon
  // ===============================
  static async getTop5EndingSoon(req: Request, res: Response) {
    try {
      const data = await HomeService.getTop5EndingSoon();
      return ok(res, data);
    } catch (error) {
      console.error("❌ HomeController.getTop5EndingSoon:", error);
      return fail(res);
    }
  }

  // ===============================
  // GET /home/top-5-most-bids
  // ===============================
  static async getTop5MostBids(req: Request, res: Response) {
    try {
      const data = await HomeService.getTop5MostBids();
      return ok(res, data);
    } catch (error) {
      console.error("❌ HomeController.getTop5MostBids:", error);
      return fail(res);
    }
  }

  // ===============================
  // GET /home/top-5-highest-price
  // ===============================
  static async getTop5HighestPrice(req: Request, res: Response) {
    try {
      const data = await HomeService.getTop5HighestPrice();
      return ok(res, data);
    } catch (error) {
      console.error("❌ HomeController.getTop5HighestPrice:", error);
      return fail(res);
    }
  }
}
