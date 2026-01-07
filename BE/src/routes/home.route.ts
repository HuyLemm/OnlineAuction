import { Router } from "express";
import { HomeController } from "../controllers/home.controller";

const router = Router();

router.get("/top-5-ending-soon", HomeController.getTop5EndingSoon);
router.get("/top-5-most-bids", HomeController.getTop5MostBids);
router.get("/top-5-highest-price", HomeController.getTop5HighestPrice);

export default router;
