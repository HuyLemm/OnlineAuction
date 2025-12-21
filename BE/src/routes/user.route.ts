import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";

const router = Router();

// ===============================
// User Registration & Verification
// ===============================

router.post("/register", UserController.register);
router.post("/verify-otp", UserController.verifyOtp);
router.post("/resend-otp", UserController.resendOtp);
router.post("/login", UserController.login);
router.post("/refresh-token", UserController.refreshToken);

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

export default router;
