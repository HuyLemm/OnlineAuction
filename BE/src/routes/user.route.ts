import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";

const router = Router();

// ===============================
// Watchlist (Bidder)
// ===============================
router.get(
  "/watchlists",
  authenticate,
  authorize("bidder"),
  UserController.getWatchlist
);

router.get(
  "/watchlists/ids",
  authenticate,
  authorize("bidder"),
  UserController.getWatchlistProductIds
);

router.post(
  "/watchlists",
  authenticate,
  authorize("bidder"),
  UserController.addToWatchlist
);

router.delete(
  "/watchlists/:productId",
  authenticate,
  authorize("bidder"),
  UserController.removeFromWatchlist
);

router.delete(
  "/watchlists",
  authenticate,
  authorize("bidder"),
  UserController.removeManyWatchlistItems
);

// ===============================
// User Profile
// ===============================
router.get("/profile", authenticate, UserController.getProfile);
router.put("/profile", authenticate, UserController.updateProfile);
router.put("/change-password", authenticate, UserController.changePassword);

// Get rating summary
router.get(
  "/ratings-summary",
  authenticate,
  authorize("bidder"),
  UserController.getMyRatingSummary
);

// Get rating detail list
router.get(
  "/ratings-detail",
  authenticate,
  authorize("bidder"),
  UserController.getMyRatingDetails
);

router.get(
  "/upgrade-seller-status",
  authenticate,
  authorize("bidder"),
  UserController.getUpgradeSellerStatus
);

router.post(
  "/request-upgrade-seller",
  authenticate,
  authorize("bidder"),
  UserController.requestUpgradeSeller
);

router.get(
  "/my-bidding-products",
  authenticate,
  authorize("bidder"),
  UserController.getMyBiddingProducts
);

// routes/user.routes.ts
router.post("/questions", authenticate, UserController.askQuestion);

/* ===============================
 * Q&A - Bidder reply
 * =============================== */
router.post(
  "/questions/:questionId/reply",
  authenticate,
  authorize("bidder"),
  UserController.replyQuestion
);

router.post(
  "/place-autobid",
  authenticate,
  authorize("bidder"),
  UserController.placeAutoBid
);

router.post(
  "/request-bids",
  authenticate,
  authorize("bidder"),
  UserController.sendBidRequest
);

router.post(
  "/buy-now",
  authenticate,
  authorize("bidder"),
  UserController.buyNow
);

router.get(
  "/won-auctions",
  authenticate,
  authorize("bidder"),
  UserController.getWonAuctions
);

export default router;
