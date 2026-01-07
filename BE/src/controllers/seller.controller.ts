import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { SellerService } from "../services/seller.service";
import { CreateAuctionDTO } from "../dto/product.dto";

export class SellerController {
  // ===============================
  // Create Auction
  // ===============================
  static async createAuction(req: AuthRequest, res: Response) {
    try {
      const sellerId = req.user!.userId;

      const dto: CreateAuctionDTO = {
        ...req.body,
        sellerId,
      };

      const result = await SellerService.createAuction(dto);

      return res.status(201).json({
        success: true,
        data: result,
      });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        message: err?.message ?? "Create auction failed",
      });
    }
  }

  // ===============================
  // GET auto-extend config
  // ===============================
  static async getAutoExtendConfig(req: AuthRequest, res: Response) {
    try {
      const data = await SellerService.getAutoExtendConfig();

      return res.json({
        success: true,
        data,
      });
    } catch (err: any) {
      // 🔒 Không cho FE thấy lỗi nội bộ
      return res.json({
        success: true,
        data: {
          thresholdMinutes: 0,
          durationMinutes: 0,
        },
      });
    }
  }

  // ===============================
  // Upload image (TEMP)
  // ===============================
  static async uploadImage(req: AuthRequest, res: Response) {
    try {
      const { uploadSessionId } = req.body;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file received",
        });
      }

      const result = await SellerService.uploadTempProductImage({
        file: req.file,
        uploadSessionId,
      });

      return res.json({
        success: true,
        data: result,
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  // ===============================
  // Get my active listings
  // ===============================
  static async getMyActiveListings(req: AuthRequest, res: Response) {
    try {
      const sellerId = req.user!.userId;

      const listings = await SellerService.getMyActiveListings(sellerId);

      return res.json({
        success: true,
        data: listings,
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err?.message ?? "Failed to get active listings",
      });
    }
  }

  static async appendDescription(req: AuthRequest, res: Response) {
    const sellerId = req.user!.userId;
    const { productId } = req.params;
    const { content } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product id is required",
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    await SellerService.appendProductDescription({
      sellerId,
      productId,
      content,
    });

    res.json({ success: true });
  }

  // ===============================
  // Get my ended auctions (with winner + rating)
  // ===============================
  static async getMyEndedAuctions(req: AuthRequest, res: Response) {
    try {
      const sellerId = req.user!.userId;

      const auctions = await SellerService.getEndedAuctions(sellerId);

      return res.json({
        success: true,
        data: auctions,
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err?.message ?? "Failed to get ended auctions",
      });
    }
  }

  // ===============================
  // Answer question (Seller)
  // POST /seller/questions/:questionId/answer
  // ===============================
  static async answerQuestion(req: AuthRequest, res: Response) {
    try {
      const sellerId = req.user!.userId;
      const { questionId } = req.params;
      const { content } = req.body;

      if (!questionId) {
        return res.status(400).json({
          success: false,
          message: "Question id is required",
        });
      }

      if (!content || !content.trim()) {
        return res.status(400).json({
          success: false,
          message: "Answer content is required",
        });
      }

      const result = await SellerService.answerQuestion({
        sellerId,
        questionId,
        content,
      });

      return res.status(201).json({
        success: true,
        data: result,
      });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        message: err?.message ?? "Failed to answer question",
      });
    }
  }

  static async getBidRequests(req: AuthRequest, res: Response) {
    try {
      const sellerId = req.user?.userId;
      const { productId } = req.params;

      if (!sellerId) {
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

      const data = await SellerService.getBidRequests({
        sellerId,
        productId,
      });

      return res.json({
        success: true,
        data,
      });
    } catch (error: any) {
      console.error("❌ SellerController.getBidRequests:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to load bid requests",
      });
    }
  }

  /* ======================================
   * 2️⃣ POST – Approve / Reject bid request
   * ====================================== */
  static async handleBidRequest(req: AuthRequest, res: Response) {
    try {
      const sellerId = req.user?.userId;
      const { requestId } = req.params;
      const { action } = req.body as { action: "approve" | "reject" };

      if (!sellerId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!requestId) {
        return res.status(400).json({
          success: false,
          message: "requestId is required",
        });
      }

      if (!action || !["approve", "reject"].includes(action)) {
        return res.status(400).json({
          success: false,
          message: "Action must be 'approve' or 'reject'",
        });
      }

      const result = await SellerService.handleBidRequest({
        sellerId,
        requestId,
        action,
      });

      return res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error("❌ SellerController.handleBidRequest:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to process bid request",
      });
    }
  }
  // =====================================
  // GET /seller/products/:productId/bidders
  // =====================================
  static async getActiveBidders(req: AuthRequest, res: Response) {
    try {
      const { productId } = req.params;
      const sellerId = req.user?.userId;

      if (!sellerId) {
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

      const bidders = await SellerService.getActiveBidders(productId, sellerId);

      return res.status(200).json({
        success: true,
        data: bidders,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to load bidders",
      });
    }
  }

  // ==================================================
  // POST /seller/products/:productId/kick-bidder/:bidderId
  // ==================================================
  static async kickBidder(req: AuthRequest, res: Response) {
    try {
      const { productId, bidderId } = req.params;
      const sellerId = req.user?.userId;
      const { reason } = req.body;

      if (!sellerId) {
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

      if (!bidderId) {
        return res.status(400).json({
          success: false,
          message: "bidderId is required",
        });
      }

      // 1️⃣ Kick bidder (block + remove auto-bid)
      const result = await SellerService.kickBidderFromAuction({
        sellerId,
        productId,
        bidderId,
        reason,
      });

      // 2️⃣ Nếu bidder bị kick đang là highest → recalc auction
      await SellerService.recalculateAfterKick({
        productId,
        kickedBidderId: bidderId,
      });

      return res.status(200).json({
        success: true,
        message: "Bidder removed from auction",
        data: {
          productId,
          bidderId,
          wasHighest: result.wasHighest,
        },
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to remove bidder",
      });
    }
  }
  // ===============================
  // POST /seller/orders/:orderId/shipment
  // ===============================
  static async submitShipment(req: AuthRequest, res: Response) {
    try {
      const { orderId } = req.params;
      const sellerId = req.user!.userId;

      const { shipping_code, shipping_provider, note } = req.body;

      if (!shipping_code) {
        return res.status(400).json({
          success: false,
          message: "shipping_code is required",
        });
      }

      if (!orderId) {
        return res.status(400).json({
          success: false,
          message: "orderId is required",
        });
      }

      const shipment = await SellerService.createShipment({
        orderId,
        sellerId,
        shipping_code,
        shipping_provider,
        note,
      });

      return res.status(201).json({
        success: true,
        data: shipment,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
  static async rateBuyer(req: AuthRequest, res: Response) {
    try {
      const sellerId = req.user!.userId;
      const { orderId } = req.params;
      const { score, comment } = req.body;

      if (!orderId) {
        return res.status(400).json({
          success: false,
          message: "Order id is required",
        });
      }

      if (score !== 1 && score !== -1) {
        return res.status(400).json({
          success: false,
          message: "Score must be +1 or -1",
        });
      }

      if (!comment || !comment.trim()) {
        return res.status(400).json({
          success: false,
          message: "Comment is required",
        });
      }

      const result = await SellerService.rateBuyer({
        sellerId,
        orderId,
        score,
        comment,
      });

      return res.json({
        success: true,
        data: result,
      });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        message: err?.message ?? "Failed to rate buyer",
      });
    }
  }

  static async cancelOrder(req: AuthRequest, res: Response) {
    try {
      const sellerId = req.user!.userId;
      const { orderId } = req.params;
      const { reason } = req.body;

      if (!orderId) {
        return res.status(400).json({
          success: false,
          message: "Order id is required",
        });
      }

      await SellerService.cancelOrderBySeller(orderId, sellerId, reason);

      return res.json({ success: true });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        message: err.message ?? "Cancel order failed",
      });
    }
  }
}
