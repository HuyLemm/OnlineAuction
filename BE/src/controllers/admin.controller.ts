import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { AdminService } from "../services/admin.service";

export class AdminController {
  // ===============================
  // GET /admin/seller-upgrade-requests
  // ===============================
  static async getUpgradeRequests(req: AuthRequest, res: Response) {
    try {
      const data = await AdminService.getUpgradeRequests();

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to load requests",
      });
    }
  }

  // ===============================
  // POST /admin/seller-upgrade-requests/:id/approve
  // ===============================
  static async approveUpgradeRequest(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const adminId = req.user?.userId;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Request id is required",
        });
      }

      if (!adminId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await AdminService.approveUpgradeRequest(id, adminId);

      return res.status(200).json({
        success: true,
        message: "Upgrade request approved",
        data: result,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Approve upgrade request failed",
      });
    }
  }

  // ===============================
  // POST /admin/seller-upgrade-requests/:id/reject
  // ===============================
  static async rejectUpgrade(req: AuthRequest, res: Response) {
    try {
      const adminId = req.user?.userId;
      const { id } = req.params;

      if (!adminId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Request id is required",
        });
      }

      const result = await AdminService.rejectUpgradeRequest(id, adminId);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Reject failed",
      });
    }
  }
}
