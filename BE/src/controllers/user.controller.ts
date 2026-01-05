import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export class UserController {
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

  // ===============================
  // POST /users/questions
  // Ask seller about product
  // ===============================
  static async askQuestion(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      const { productId, content } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!productId || !content) {
        return res.status(400).json({
          success: false,
          message: "productId and content are required",
        });
      }

      const question = await UserService.askQuestion(
        userId,
        productId,
        content
      );

      return res.status(201).json({
        success: true,
        data: question,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to ask question",
      });
    }
  }

  // ===============================
  // POST /users/questions/:questionId/reply
  // Bidder reply in Q&A thread
  // ===============================
  static async replyQuestion(req: AuthRequest, res: Response) {
    try {
      const bidderId = req.user?.userId;
      const { questionId } = req.params;
      const { content } = req.body;

      if (!bidderId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!questionId) {
        return res.status(400).json({
          success: false,
          message: "questionId is required",
        });
      }

      if (!content || !content.trim()) {
        return res.status(400).json({
          success: false,
          message: "Content is required",
        });
      }

      const result = await UserService.replyQuestionAsBidder({
        bidderId,
        questionId,
        content,
      });

      return res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to reply question",
      });
    }
  }

  // ===============================
  // POST /users/bid
  // Place AUTO BID (max price)
  // ===============================
  static async placeAutoBid(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      const { productId, maxPrice } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!productId || typeof maxPrice !== "number") {
        return res.status(400).json({
          success: false,
          message: "productId and maxPrice are required",
        });
      }

      const result = await UserService.placeAutoBid({
        userId,
        productId,
        maxPrice,
      });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to place bid",
      });
    }
  }

  static async sendBidRequest(req: AuthRequest, res: Response) {
    try {
      const bidderId = req.user?.userId;
      const { productId, message } = req.body;

      if (!bidderId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: "productId is required",
        });
      }

      const request = await UserService.sendBidRequest({
        productId,
        bidderId,
        message,
      });

      return res.json({
        success: true,
        data: request,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async buyNow(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { productId } = req.body;

      const result = await UserService.buyNow({ userId, productId });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  static async getWonAuctions(req: AuthRequest, res: Response) {
    const userId = req.user!.userId;

    const data = await UserService.getWonAuctions(userId);

    res.json({
      success: true,
      data,
    });
  }

  static async submitPayment(req: AuthRequest, res: Response) {
    try {
      const { orderId } = req.params;
      const buyerId = req.user!.userId;

      const { invoiceCode, shippingAddress, phoneNumber, description } =
        req.body;

      if (!orderId) {
        return res.status(400).json({
          success: false,
          message: "orderId is required",
        });
      }

      if (!invoiceCode || !shippingAddress || !phoneNumber) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      await UserService.submitPayment({
        orderId,
        buyerId,
        invoiceCode,
        shippingAddress,
        phoneNumber,
        description,
      });

      return res.json({
        success: true,
        message: "Payment information submitted successfully",
      });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }
}
