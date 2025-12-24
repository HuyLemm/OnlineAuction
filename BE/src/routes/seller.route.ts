import { Router } from "express";
import { SellerController } from "../controllers/seller.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";

const router = Router();

router.post(
  "/create-auction",
  authenticate,
  authorize("seller"),
  SellerController.createAuction
);

router.get(
  "/auto-extend-config",
  authenticate,
  SellerController.getAutoExtendConfig
);

router.get(
  "/listings-active",
  authenticate,
  authorize("seller"),
  SellerController.getMyActiveListings
);

router.post(
  "/:productId/append-description",
  authenticate,
  authorize("seller"),
  SellerController.appendDescription
);

export default router;
