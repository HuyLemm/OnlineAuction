import { Router } from "express";
import {
  getTop5EndingSoonController,
  getTop5MostBidsController,
  getTop5HighestPriceController,
} from "../controllers/home.controller";

const router = Router();

router.get("/top-5-ending-soon", getTop5EndingSoonController);
router.get("/top-5-most-bids", getTop5MostBidsController);
router.get("/top-5-highest-price", getTop5HighestPriceController);

export default router;
