"use strict";
exports.__esModule = true;
var express_1 = require("express");
var user_controller_1 = require("../controllers/user.controller");
var auth_middleware_1 = require("../middlewares/auth.middleware");
var authorize_middleware_1 = require("../middlewares/authorize.middleware");
var router = express_1.Router();
// ===============================
// Watchlist (Bidder)
// ===============================
router.get("/watchlists", auth_middleware_1.authenticate, authorize_middleware_1.authorize("bidder"), user_controller_1.UserController.getWatchlist);
router.get("/watchlists/ids", auth_middleware_1.authenticate, authorize_middleware_1.authorize("bidder"), user_controller_1.UserController.getWatchlistProductIds);
router.post("/watchlists", auth_middleware_1.authenticate, authorize_middleware_1.authorize("bidder"), user_controller_1.UserController.addToWatchlist);
router["delete"]("/watchlists/:productId", auth_middleware_1.authenticate, authorize_middleware_1.authorize("bidder"), user_controller_1.UserController.removeFromWatchlist);
router["delete"]("/watchlists", auth_middleware_1.authenticate, authorize_middleware_1.authorize("bidder"), user_controller_1.UserController.removeManyWatchlistItems);
// ===============================
// User Profile
// ===============================
router.get("/profile", auth_middleware_1.authenticate, user_controller_1.UserController.getProfile);
router.put("/profile", auth_middleware_1.authenticate, user_controller_1.UserController.updateProfile);
router.put("/change-password", auth_middleware_1.authenticate, user_controller_1.UserController.changePassword);
// Get rating summary
router.get("/ratings-summary", auth_middleware_1.authenticate, authorize_middleware_1.authorize("bidder"), user_controller_1.UserController.getMyRatingSummary);
// Get rating detail list
router.get("/ratings-detail", auth_middleware_1.authenticate, authorize_middleware_1.authorize("bidder"), user_controller_1.UserController.getMyRatingDetails);
router.get("/upgrade-seller-status", auth_middleware_1.authenticate, authorize_middleware_1.authorize("bidder"), user_controller_1.UserController.getUpgradeSellerStatus);
router.post("/request-upgrade-seller", auth_middleware_1.authenticate, authorize_middleware_1.authorize("bidder"), user_controller_1.UserController.requestUpgradeSeller);
router.get("/my-bidding-products", auth_middleware_1.authenticate, authorize_middleware_1.authorize("bidder"), user_controller_1.UserController.getMyBiddingProducts);
// routes/user.routes.ts
router.post("/questions", auth_middleware_1.authenticate, user_controller_1.UserController.askQuestion);
/* ===============================
 * Q&A - Bidder reply
 * =============================== */
router.post("/questions/:questionId/reply", auth_middleware_1.authenticate, authorize_middleware_1.authorize("bidder"), user_controller_1.UserController.replyQuestion);
router.post("/place-autobid", auth_middleware_1.authenticate, authorize_middleware_1.authorize("bidder"), user_controller_1.UserController.placeAutoBid);
router.post("/request-bids", auth_middleware_1.authenticate, authorize_middleware_1.authorize("bidder"), user_controller_1.UserController.sendBidRequest);
router.post("/buy-now", auth_middleware_1.authenticate, authorize_middleware_1.authorize("bidder"), user_controller_1.UserController.buyNow);
exports["default"] = router;
