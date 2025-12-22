import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { verifyRecaptcha } from "../utils/reCaptcha";
import { verifyRefreshToken, signAccessToken } from "../utils/jwt";
import { AuthRequest } from "../middlewares/auth.middleware";

export class UserController {
  // ===============================
  // POST /users/login
  // ===============================
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      const user = await UserService.login(email, password);

      return res.status(200).json({
        success: true,
        message: "Login successfully!",
        user,
      });
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: error.message || "Login failed",
      });
    }
  }

  // ===============================
  // POST /users/register
  // ===============================
  static async register(req: Request, res: Response) {
    try {
      const { recaptchaToken } = req.body;

      // 1️⃣ Check reCAPTCHA token tồn tại
      if (!recaptchaToken) {
        return res.status(400).json({
          success: false,
          message: "Missing reCAPTCHA token",
        });
      }

      // 2️⃣ Verify với Google
      const recaptchaResult = await verifyRecaptcha(recaptchaToken);
      console.log("recaptcha result:", recaptchaResult);

      if (!recaptchaResult.success) {
        return res.status(403).json({
          success: false,
          message: "reCAPTCHA verification failed",
        });
      }

      // 3️⃣ reCAPTCHA OK → tiếp tục register
      const result = await UserService.register(req.body);

      return res.status(201).json({
        success: true,
        message: result.message,
        email: result.email,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Registration failed",
      });
    }
  }

  // ===============================
  // POST /users/verify-otp
  // ===============================
  static async verifyOtp(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({
          success: false,
          message: "Email and OTP are required",
        });
      }

      const result = await UserService.verifyOtp({
        email,
        otp,
        purpose: "verify_email",
      });

      return res.status(200).json({
        success: true,
        message: "OTP verified & logged in",
        ...result,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "OTP verification failed",
      });
    }
  }

  // ===============================
  // POST /users/resend-otp
  // ===============================
  static async resendOtp(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      const result = await UserService.resendOtp(email);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Resend OTP failed",
      });
    }
  }

  // ===============================
  // POST /users/refresh-token
  // ===============================
  static async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: "Missing refresh token",
        });
      }

      const result = await UserService.refreshAccessToken(refreshToken);

      return res.status(200).json({
        success: true,
        accessToken: result.accessToken,
      });
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: error.message || "Invalid refresh token",
      });
    }
  }

  // ===============================
  // GET /users/watchlist
  // ===============================
  static async getWatchlist(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthenticated",
        });
      }

      const userId = req.user.userId;

      const watchlist = await UserService.getWatchlist(userId);

      return res.status(200).json({
        success: true,
        data: watchlist,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch watchlist",
      });
    }
  }

  // ===============================
  // POST /users/watchlist
  // ===============================
  static async addToWatchlist(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthenticated",
        });
      }

      const { productId } = req.body;
      if (!productId) {
        return res.status(400).json({
          success: false,
          message: "productId is required",
        });
      }

      await UserService.addToWatchlist(req.user.userId, productId);

      return res.status(201).json({
        success: true,
        message: "Added to watchlist",
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to add watchlist",
      });
    }
  }

  // ===============================
  // DELETE /users/watchlist/:productId
  // ===============================
  static async removeFromWatchlist(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthenticated",
        });
      }

      const { productId } = req.params;

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: "productId is required",
        });
      }

      await UserService.removeFromWatchlist(req.user.userId, productId);

      return res.status(200).json({
        success: true,
        message: "Removed from watchlist",
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to remove watchlist",
      });
    }
  }

  static async getWatchlistProductIds(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthenticated",
        });
      }

      const ids = await UserService.getWatchlistProductIds(req.user.userId);

      return res.status(200).json({
        success: true,
        data: ids,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch watchlist ids",
      });
    }
  }

  /**
   * DELETE /users/watchlists
   * Xóa NHIỀU sản phẩm khỏi watchlist
   * body: { productIds: string[] }
   */
  static async removeManyWatchlistItems(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      const { productIds } = req.body;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!Array.isArray(productIds)) {
        return res.status(400).json({ message: "productIds must be an array" });
      }

      const result = await UserService.removeManyFromWatchlist(
        userId,
        productIds
      );

      return res.json({
        success: true,
        deleted: result.deleted,
      });
    } catch (err) {
      console.error("removeManyWatchlistItems error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // GET /users/profile
  static async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const profile = await UserService.getProfile(userId);
      res.json({ data: profile });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  // PUT /users/profile
  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const profile = await UserService.updateProfile(userId, req.body);
      res.json({ message: "Profile updated", data: profile });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  // PUT /users/change-password
  static async changePassword(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "Missing old or new password" });
      }

      await UserService.changePassword(userId, oldPassword, newPassword);

      res.json({ message: "Password updated successfully" });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  // ===============================
  // Ratings - Summary
  // ===============================
  static async getMyRatingSummary(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;

      const summary = await UserService.getRatingSummary(userId);

      return res.json({
        success: true,
        data: summary,
      });
    } catch (err) {
      console.error("Get rating summary error:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to get rating summary",
      });
    }
  }

  // ===============================
  // Ratings - Detail list
  // ===============================
  static async getMyRatingDetails(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;

      const details = await UserService.getRatingDetails(userId);

      return res.json({
        success: true,
        data: details,
      });
    } catch (err) {
      console.error("Get rating details error:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to get rating details",
      });
    }
  }
  // ===============================
  // POST /users/request-upgrade-seller
  // ===============================
  static async requestUpgradeSeller(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await UserService.requestUpgradeToSeller(userId);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Request failed",
      });
    }
  }

  // ===============================
  // GET /users/upgrade-seller-status
  // ===============================
  static async getUpgradeSellerStatus(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const data = await UserService.getUpgradeSellerRequestStatus(userId);

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to fetch status",
      });
    }
  }

  // ===============================
  // GET /users/my-bidding-products
  // ===============================
  static async getMyBiddingProducts(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const products = await UserService.getMyActiveBids(userId);

      return res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error: any) {
      console.error("❌ getMyBiddingProducts error:", error);

      return res.status(500).json({
        success: false,
        message: error.message || "Failed to load bidding products",
      });
    }
  }
}
