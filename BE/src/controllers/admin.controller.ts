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
  // ==================================================
  // POST /admin/categories/parent
  // ==================================================
  static async createParentCategory(req: AuthRequest, res: Response) {
    try {
      const adminId = req.user?.userId;
      const { name } = req.body;

      if (!adminId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Category name is required",
        });
      }

      const result = await AdminService.createParentCategory(name);

      return res.status(201).json({
        success: true,
        message: result.message,
        data: { id: result.id },
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Create parent category failed",
      });
    }
  }

  // ==================================================
  // POST /admin/categories/sub
  // ==================================================
  static async createSubcategory(req: AuthRequest, res: Response) {
    try {
      const adminId = req.user?.userId;
      const { parentId, name } = req.body;

      if (!adminId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!parentId || !name) {
        return res.status(400).json({
          success: false,
          message: "parentId and name are required",
        });
      }

      const result = await AdminService.createSubcategory(
        Number(parentId),
        name
      );

      return res.status(201).json({
        success: true,
        message: result.message,
        data: { id: result.id },
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Create subcategory failed",
      });
    }
  }

  // PUT /admin/categories/parent/:id
  static async updateParentCategory(req: AuthRequest, res: Response) {
    try {
      const adminId = req.user?.userId;
      const { id } = req.params;
      const { name } = req.body;

      if (!adminId)
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });

      const result = await AdminService.updateParentCategory(Number(id), name);

      return res.status(200).json({ success: true, message: result.message });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // PUT /admin/categories/sub/:id
  static async updateSubcategory(req: AuthRequest, res: Response) {
    try {
      const adminId = req.user?.userId;
      const { id } = req.params;
      const { name } = req.body;

      if (!adminId)
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });

      const result = await AdminService.updateSubcategory(Number(id), name);

      return res.status(200).json({ success: true, message: result.message });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // DELETE /admin/categories/parent/:id
  static async deleteParentCategory(req: AuthRequest, res: Response) {
    try {
      const adminId = req.user?.userId;
      const { id } = req.params;

      if (!adminId)
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });

      const result = await AdminService.deleteParentCategory(Number(id));

      return res.status(200).json({ success: true, message: result.message });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // DELETE /admin/categories/sub/:id
  static async deleteSubcategory(req: AuthRequest, res: Response) {
    try {
      const adminId = req.user?.userId;
      const { id } = req.params;

      if (!adminId)
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });

      const result = await AdminService.deleteSubcategory(Number(id));

      return res.status(200).json({ success: true, message: result.message });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}
