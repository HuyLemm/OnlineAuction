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

  
}
