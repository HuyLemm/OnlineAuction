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

router.get(
  "/listings-ended",
  authenticate,
  authorize("seller"),
  SellerController.getMyEndedAuctions
);

router.post(
  "/rate-winner/:productId",
  authenticate,
  authorize("seller"),
  SellerController.rateWinner
);

router.post(
  "/questions/:questionId/answer",
  authenticate,
  authorize("seller"),
  SellerController.answerQuestion
);

router.get(
  "/:productId/bid-requests",
  authenticate,
  authorize("seller"),
  SellerController.getBidRequests
);

router.post(
  "/bid-requests/:requestId",
  authenticate,
  authorize("seller"),
  SellerController.handleBidRequest
);

router.get(
  "/products/:productId/active-bidders",
  authenticate,
  authorize("seller"),
  SellerController.getActiveBidders
);

router.post(
  "/products/:productId/kick-bidder/:bidderId",
  authenticate,
  authorize("seller"),
  SellerController.kickBidder
);

router.post(
  "/orders/:orderId/shipment",
  authenticate,
  SellerController.submitShipment
);

export default router;
