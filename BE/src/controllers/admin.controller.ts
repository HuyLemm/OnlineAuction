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

  // ==================================================
  // GET /admin/products
  // ==================================================
  static async getAdminProducts(req: AuthRequest, res: Response) {
    try {
      const adminId = req.user?.userId;
      if (!adminId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const { parentCategoryId, sortBy, minPrice, maxPrice } = req.query;

      const params: any = {};

      if (parentCategoryId) {
        params.parentCategoryId = Number(parentCategoryId);
      }

      if (sortBy) {
        params.sortBy = String(sortBy);
      }

      if (minPrice) {
        params.minPrice = Number(minPrice);
      }

      if (maxPrice) {
        params.maxPrice = Number(maxPrice);
      }

      const data = await AdminService.getAdminProducts(params);

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to load products",
      });
    }
  }

  // ==================================================
  // PUT /admin/products/:id
  // ==================================================
  static async updateProduct(req: AuthRequest, res: Response) {
    try {
      const adminId = req.user?.userId;
      const { id } = req.params;
      const { title, description, buyNowPrice, status } = req.body;

      if (!adminId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Product id is required",
        });
      }

      if (!title || !status) {
        return res.status(400).json({
          success: false,
          message: "Title and status are required",
        });
      }

      const result = await AdminService.updateProduct(id, {
        title,
        description,
        buyNowPrice,
        status,
      });

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Update product failed",
      });
    }
  }

  // ==================================================
  // DELETE /admin/products/:id
  // ==================================================
  static async toggleDeleteProduct(req: AuthRequest, res: Response) {
    try {
      const adminId = req.user?.userId;
      const { id } = req.params;
      const { expired } = req.body; // boolean

      if (!adminId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Product id is required",
        });
      }

      if (typeof expired !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "`expired` boolean is required",
        });
      }

      const result = await AdminService.toggleDeleteProduct(id, expired);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (e: any) {
      return res.status(400).json({
        success: false,
        message: e.message || "Toggle delete product failed",
      });
    }
  }

  // ==================================================
  // GET /admin/users
  // ==================================================
  static async getAdminUsers(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.userId) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const data = await AdminService.getAdminUsers();

      return res.json({ success: true, data });
    } catch (e: any) {
      return res.status(500).json({ success: false, message: e.message });
    }
  }

  // ==================================================
  // POST /admin/seller-upgrade-requests/:id/approve
  // ==================================================
  static async approveSellerUpgrade(req: AuthRequest, res: Response) {
    try {
      const adminId = req.user?.userId;
      const { id } = req.params;

      if (!adminId) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: "Request id is required" });
      }

      const result = await AdminService.approveUpgradeRequest(id, adminId);

      return res.json({ success: true, message: result.message });
    } catch (e: any) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }
  // ==================================================
  // POST /admin/seller-upgrade-requests/:id/reject
  // ==================================================
  static async rejectSellerUpgrade(req: AuthRequest, res: Response) {
    try {
      const adminId = req.user?.userId;
      const { id } = req.params;

      if (!adminId) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: "Request id is required" });
      }

      const result = await AdminService.rejectUpgradeRequest(id, adminId);

      return res.json({ success: true, message: result.message });
    } catch (e: any) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }

  // ==================================================
  // GET /admin/users/:id
  // ==================================================
  static async getUserDetails(req: AuthRequest, res: Response) {
    try {
      const adminId = req.user?.userId;
      const { id } = req.params;

      if (!adminId) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: "User id is required" });
      }

      const data = await AdminService.getUserById(id);

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (e: any) {
      return res.status(404).json({ success: false, message: e.message });
    }
  }

  // ==================================================
  // PUT /admin/users/:id
  // ==================================================
  static async updateUser(req: AuthRequest, res: Response) {
    try {
      const adminId = req.user?.userId;
      const { id } = req.params;
      const { fullName, email, role, isBlocked, isVerified, dob, address } =
        req.body;

      if (!adminId) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      if (!id || !fullName || !email || !role) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      const result = await AdminService.updateUser(id, {
        fullName,
        email,
        role,
        isBlocked: Boolean(isBlocked),
        isVerified: Boolean(isVerified),
        dob,
        address,
      });

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (e: any) {
      return res.status(400).json({
        success: false,
        message: e.message,
      });
    }
  }

  static async toggleBanUser(req: AuthRequest, res: Response) {
    try {
      const adminId = req.user?.userId;
      const { id } = req.params;
      const { ban } = req.body; // boolean

      if (!adminId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "User id is required",
        });
      }

      if (typeof ban !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "`ban` boolean is required",
        });
      }

      const result = await AdminService.toggleBanUser(id, ban);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (e: any) {
      return res.status(400).json({
        success: false,
        message: e.message || "Toggle ban failed",
      });
    }
  }

  // ==================================================
  // DELETE /admin/users/:id
  // ==================================================
  static async toggleDeleteUser(req: AuthRequest, res: Response) {
    try {
      const adminId = req.user?.userId;
      const { id } = req.params;
      const { deleted } = req.body; // boolean

      if (!adminId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "User id is required",
        });
      }

      if (typeof deleted !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "`deleted` boolean is required",
        });
      }

      const result = await AdminService.toggleDeleteUser(id, deleted);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (e: any) {
      return res.status(400).json({
        success: false,
        message: e.message || "Toggle delete user failed",
      });
    }
  }
}
