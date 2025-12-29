import { db } from "../config/db";

export class AdminService {
  // ===============================
  // Get all upgrade requests
  // ===============================
  static async getUpgradeRequests() {
    const rows = await db("seller_upgrade_requests as r")
      .join("users as u", "u.id", "r.user_id")
      .select(
        "r.id",
        "r.status",
        "r.requested_at",
        "u.id as userId",
        "u.full_name as fullName",
        "u.email"
      )
      .orderBy("r.requested_at", "desc");

    return rows;
  }

  // ===============================
  // Create parent category
  // ===============================
  static async createParentCategory(name: string) {
    if (!name?.trim()) {
      throw new Error("Category name is required");
    }

    // Check duplicate parent category
    const existed = await db("categories")
      .whereRaw("LOWER(name) = LOWER(?)", [name.trim()])
      .whereNull("parent_id")
      .first();

    if (existed) {
      throw new Error("Parent category already exists");
    }

    const [id] = await db("categories")
      .insert({
        name: name.trim(),
        parent_id: null,
      })
      .returning("id");

    return {
      message: "Parent category created successfully",
      id,
    };
  }

  // ===============================
  // Create subcategory
  // ===============================
  static async createSubcategory(parentId: number, name: string) {
    if (!name?.trim()) {
      throw new Error("Subcategory name is required");
    }

    return await db.transaction(async (trx) => {
      // 1️⃣ Check parent exists & is parent category
      const parent = await trx("categories")
        .where({ id: parentId })
        .whereNull("parent_id")
        .first();

      if (!parent) {
        throw new Error("Parent category not found");
      }

      // 2️⃣ Check duplicate subcategory under same parent
      const existed = await trx("categories")
        .whereRaw("LOWER(name) = LOWER(?)", [name.trim()])
        .andWhere({ parent_id: parentId })
        .first();

      if (existed) {
        throw new Error("Subcategory already exists under this parent");
      }

      // 3️⃣ Insert subcategory
      const [id] = await trx("categories")
        .insert({
          name: name.trim(),
          parent_id: parentId,
        })
        .returning("id");

      return {
        message: "Subcategory created successfully",
        id,
      };
    });
  }

  // ===============================
  // Update parent category
  // ===============================
  static async updateParentCategory(categoryId: number, name: string) {
    if (!name?.trim()) {
      throw new Error("Category name is required");
    }

    const category = await db("categories")
      .where({ id: categoryId })
      .whereNull("parent_id")
      .first();

    if (!category) {
      throw new Error("Parent category not found");
    }

    // Check duplicate name
    const existed = await db("categories")
      .whereRaw("LOWER(name) = LOWER(?)", [name.trim()])
      .whereNull("parent_id")
      .andWhereNot({ id: categoryId })
      .first();

    if (existed) {
      throw new Error("Parent category name already exists");
    }

    await db("categories")
      .where({ id: categoryId })
      .update({ name: name.trim() });

    return { message: "Parent category updated" };
  }

  // ===============================
  // Update subcategory
  // ===============================
  static async updateSubcategory(subcategoryId: number, name: string) {
    if (!name?.trim()) {
      throw new Error("Subcategory name is required");
    }

    const sub = await db("categories")
      .where({ id: subcategoryId })
      .whereNotNull("parent_id")
      .first();

    if (!sub) {
      throw new Error("Subcategory not found");
    }

    // Check duplicate under same parent
    const existed = await db("categories")
      .whereRaw("LOWER(name) = LOWER(?)", [name.trim()])
      .andWhere({ parent_id: sub.parent_id })
      .andWhereNot({ id: subcategoryId })
      .first();

    if (existed) {
      throw new Error("Subcategory name already exists");
    }

    await db("categories")
      .where({ id: subcategoryId })
      .update({ name: name.trim() });

    return { message: "Subcategory updated" };
  }

  // ===============================
  // Delete subcategory
  // ===============================
  static async deleteSubcategory(subcategoryId: number) {
    // Check subcategory exists
    const sub = await db("categories")
      .where({ id: subcategoryId })
      .whereNotNull("parent_id")
      .first();

    if (!sub) {
      throw new Error("Subcategory not found");
    }

    // ❗ Check products
    const hasProducts = await db("products")
      .where({ category_id: subcategoryId })
      .first();

    if (hasProducts) {
      throw new Error("Cannot delete subcategory with products");
    }

    await db("categories").where({ id: subcategoryId }).del();

    return { message: "Subcategory deleted" };
  }

  // ===============================
  // Delete parent category
  // ===============================
  static async deleteParentCategory(categoryId: number) {
    return await db.transaction(async (trx) => {
      const parent = await trx("categories")
        .where({ id: categoryId })
        .whereNull("parent_id")
        .first();

      if (!parent) {
        throw new Error("Parent category not found");
      }

      // 1️⃣ Check subcategories
      const subcategories = await trx("categories").where({
        parent_id: categoryId,
      });

      const subIds = subcategories.map((s) => s.id);

      if (subIds.length > 0) {
        const subHasProducts = await trx("products")
          .whereIn("category_id", subIds)
          .first();

        if (subHasProducts) {
          throw new Error(
            "Cannot delete parent category with subcategories that have products"
          );
        }
      }

      // 2️⃣ Check parent products
      const parentHasProducts = await trx("products")
        .where({ category_id: categoryId })
        .first();

      if (parentHasProducts) {
        throw new Error("Cannot delete parent category with products");
      }

      // 3️⃣ Delete subcategories first
      await trx("categories").where({ parent_id: categoryId }).del();

      // 4️⃣ Delete parent
      await trx("categories").where({ id: categoryId }).del();

      return { message: "Parent category deleted" };
    });
  }

  // ===============================
  // Get products for admin dashboard
  // ===============================
  static async getAdminProducts(params: {
    parentCategoryId?: number;
    sortBy?: string;
    minPrice?: number;
    maxPrice?: number;
  }) {
    const { parentCategoryId, sortBy = "newest", minPrice, maxPrice } = params;

    const query = db("products as p")
      // ===== MAIN IMAGE =====
      .leftJoin("product_images as img", function () {
        this.on("img.product_id", "p.id").andOn("img.is_main", db.raw("true"));
      })

      // ===== SUB CATEGORY =====
      .leftJoin("categories as sub", "sub.id", "p.category_id")

      // ===== PARENT CATEGORY =====
      .leftJoin("categories as parent", "parent.id", "sub.parent_id")

      // ===== SELLER =====
      .leftJoin("users as u", "u.id", "p.seller_id")

      // ===== BIDS =====
      .leftJoin("bids as b", "b.product_id", "p.id")

      .select(
        "p.id",
        "p.title",
        "p.start_price",
        "p.current_price",
        "p.buy_now_price",
        "p.status",
        "p.created_at",
        "p.end_time",
        "p.description",
        "p.auction_type",

        "img.image_url as image",

        "sub.id as subcategory_id",
        "sub.name as subcategory_name",

        "parent.id as parent_category_id",
        "parent.name as parent_category_name",

        "u.full_name as seller_name",
        "u.email as seller_email"
      )
      .countDistinct("b.id as total_bids")
      .groupBy("p.id", "img.image_url", "sub.id", "parent.id", "u.id");

    // ================= FILTER =================
    if (parentCategoryId) {
      query.where("parent.id", parentCategoryId);
    }

    if (minPrice !== undefined) {
      query.where("p.current_price", ">=", minPrice);
    }

    if (maxPrice !== undefined) {
      query.where("p.current_price", "<=", maxPrice);
    }

    // ================= SORT =================
    switch (sortBy) {
      case "ending_soon":
        query.orderBy("p.end_time", "asc");
        break;

      case "most_bids":
        query.orderBy("total_bids", "desc");
        break;

      case "price_high":
        query.orderBy("p.current_price", "desc");
        break;

      case "price_low":
        query.orderBy("p.current_price", "asc");
        break;

      case "newest":
      default:
        query.orderBy("p.created_at", "desc");
    }

    return query;
  }

  // ===============================
  // Update product (admin)
  // ===============================
  static async updateProduct(
    productId: string,
    data: {
      title: string;
      description?: string;
      buyNowPrice?: number | null;
      status: "active" | "inactive" | "ended";
    }
  ) {
    const { title, description, buyNowPrice, status } = data;

    if (!title?.trim()) {
      throw new Error("Product title is required");
    }

    const product = await db("products").where({ id: productId }).first();

    if (!product) {
      throw new Error("Product not found");
    }

    // ❗ Nếu auction đã ended thì không cho sửa status nữa (optional nhưng rất nên)
    if (product.status === "ended" && status !== "ended") {
      throw new Error("Cannot change status of an ended product");
    }

    await db("products")
      .where({ id: productId })
      .update({
        title: title.trim(),
        description: description ?? null,
        buy_now_price: buyNowPrice ?? null,
        status,
      });

    return { message: "Product updated successfully" };
  }

  // ===============================
  // Delete product (admin)
  // ===============================
  static async deleteProduct(productId: string) {
    return await db.transaction(async (trx) => {
      const product = await trx("products").where({ id: productId }).first();

      if (!product) {
        throw new Error("Product not found");
      }

      // ❗ Không cho delete nếu có bids
      const hasBids = await trx("bids")
        .where({ product_id: productId })
        .first();

      if (hasBids) {
        throw new Error("Cannot delete product with existing bids");
      }

      // 1️⃣ Delete images
      await trx("product_images").where({ product_id: productId }).del();

      // 2️⃣ Delete product
      await trx("products").where({ id: productId }).del();

      return { message: "Product deleted successfully" };
    });
  }

  // ===============================
  // Get users for admin management
  // ===============================
  static async getAdminUsers() {
    const rows = await db("users as u")
      // ===== BIDDER: products joined =====
      .leftJoin(
        db("bids")
          .select("bidder_id")
          .countDistinct("product_id as products_joined")
          .groupBy("bidder_id")
          .as("bid_stats"),
        "bid_stats.bidder_id",
        "u.id"
      )

      // ===== BIDDER: products won =====
      .leftJoin(
        db("products")
          .select("highest_bidder_id")
          .count("id as products_won")
          .whereNotNull("highest_bidder_id")
          .groupBy("highest_bidder_id")
          .as("win_stats"),
        "win_stats.highest_bidder_id",
        "u.id"
      )

      // ===== SELLER: products sold =====
      .leftJoin(
        db("products")
          .select("seller_id")
          .count("id as products_sold")
          .groupBy("seller_id")
          .as("seller_stats"),
        "seller_stats.seller_id",
        "u.id"
      )

      // ===== SELLER REQUEST STATS =====
      .leftJoin(
        db("seller_upgrade_requests")
          .select("user_id")
          .count("id as seller_request_count")
          .groupBy("user_id")
          .as("req_stats"),
        "req_stats.user_id",
        "u.id"
      )

      // ===== LATEST SELLER REQUEST (ID + STATUS) =====
      .leftJoin(
        db("seller_upgrade_requests as r2")
          .select("r2.id", "r2.user_id", "r2.status")
          .whereRaw(
            `
            r2.requested_at = (
              SELECT MAX(r3.requested_at)
              FROM seller_upgrade_requests r3
              WHERE r3.user_id = r2.user_id
            )
          `
          )
          .as("latest_req"),
        "latest_req.user_id",
        "u.id"
      )

      .select(
        "u.id",
        "u.full_name",
        "u.email",
        "u.role",
        "u.is_blocked",
        "u.created_at",

        db.raw("COALESCE(bid_stats.products_joined, 0) as products_joined"),
        db.raw("COALESCE(win_stats.products_won, 0) as products_won"),
        db.raw("COALESCE(seller_stats.products_sold, 0) as products_sold"),

        db.raw(
          "COALESCE(req_stats.seller_request_count, 0) as seller_request_count"
        ),

        "latest_req.id as latest_seller_request_id",
        "latest_req.status as latest_seller_request_status"
      )
      .orderBy("u.created_at", "desc");

    return rows;
  }

  // ===============================
  // Approve seller upgrade request
  // ===============================
  static async approveUpgradeRequest(requestId: string, adminId: string) {
    return await db.transaction(async (trx) => {
      // 1️⃣ Lấy request pending
      const req = await trx("seller_upgrade_requests")
        .where({ id: requestId, status: "pending" })
        .first();

      if (!req) {
        throw new Error("Request not found or already processed");
      }

      const now = new Date();
      const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      // 2️⃣ Update request
      await trx("seller_upgrade_requests").where({ id: requestId }).update({
        status: "approved",
        reviewed_at: now,
        reviewed_by: adminId,
      });

      // 3️⃣ Update user → seller có hạn 7 ngày
      await trx("users").where({ id: req.user_id }).update({
        role: "seller",
        seller_approved_at: now,
        seller_expires_at: expiresAt,
      });

      return {
        message: "Seller upgrade approved",
        seller_expires_at: expiresAt,
      };
    });
  }

  // ===============================
  // Reject seller upgrade request
  // ===============================
  static async rejectUpgradeRequest(requestId: string, adminId: string) {
    const updated = await db("seller_upgrade_requests")
      .where({ id: requestId, status: "pending" })
      .update({
        status: "rejected",
        reviewed_at: new Date(),
        reviewed_by: adminId,
      });

    if (!updated) {
      throw new Error("Request not found or already processed");
    }

    return { message: "Seller upgrade rejected" };
  }

  // ===============================
  // Get single user details (admin)
  // ===============================
  static async getUserById(userId: string) {
    const row = await db("users as u")
      // ===== BIDDER: products joined =====
      .leftJoin(
        db("bids")
          .select("bidder_id")
          .countDistinct("product_id as products_joined")
          .groupBy("bidder_id")
          .as("bid_stats"),
        "bid_stats.bidder_id",
        "u.id"
      )

      // ===== BIDDER: products won =====
      .leftJoin(
        db("products")
          .select("highest_bidder_id")
          .count("id as products_won")
          .whereNotNull("highest_bidder_id")
          .groupBy("highest_bidder_id")
          .as("win_stats"),
        "win_stats.highest_bidder_id",
        "u.id"
      )

      // ===== SELLER: products sold =====
      .leftJoin(
        db("products")
          .select("seller_id")
          .count("id as products_sold")
          .groupBy("seller_id")
          .as("seller_stats"),
        "seller_stats.seller_id",
        "u.id"
      )

      .where("u.id", userId)

      .select(
        "u.id",
        "u.full_name",
        "u.email",
        "u.role",
        "u.is_blocked",
        "u.created_at",
        "u.address",
        "u.dob",
        "u.is_verified",
        "u.seller_approved_at",
        "u.seller_expires_at",

        db.raw("COALESCE(bid_stats.products_joined, 0) as products_joined"),
        db.raw("COALESCE(win_stats.products_won, 0) as products_won"),
        db.raw("COALESCE(seller_stats.products_sold, 0) as products_sold")
      )
      .first();

    if (!row) {
      throw new Error("User not found");
    }

    return row;
  }

  // ===============================
  // Update user (admin)
  // ===============================
  static async updateUser(
    userId: string,
    data: {
      fullName: string;
      email: string;
      role: "buyer" | "seller" | "admin";
      isBlocked: boolean;
      isVerified: boolean;
      dob?: string | null;
      address?: string | null;
    }
  ) {
    const user = await db("users").where({ id: userId }).first();

    if (!user) {
      throw new Error("User not found");
    }

    // ❗ Không cho admin tự hạ quyền admin khác (optional nhưng nên có)
    if (user.role === "admin" && data.role !== "admin") {
      throw new Error("Cannot downgrade admin role");
    }

    await db("users")
      .where({ id: userId })
      .update({
        full_name: data.fullName.trim(),
        email: data.email.toLowerCase().trim(),
        role: data.role,
        is_blocked: data.isBlocked,
        is_verified: data.isVerified,
        dob: data.dob ?? null,
        address: data.address ?? null,
      });

    return { message: "User updated successfully" };
  }

  // ===============================
  // Ban / Unban user
  // ===============================
  static async toggleBanUser(userId: string, ban: boolean) {
    const user = await db("users").where({ id: userId }).first();

    if (!user) {
      throw new Error("User not found");
    }

    if (user.role === "admin") {
      throw new Error("Cannot ban admin");
    }

    await db("users")
      .where({ id: userId })
      .update({
        is_blocked: ban,
        allow_bid: ban ? false : true,
      });

    return {
      message: ban ? "User banned successfully" : "User unbanned successfully",
    };
  }

  // ===============================
  // Delete user account (admin)
  // ===============================
  static async deleteUser(userId: string) {
    return await db.transaction(async (trx) => {
      const user = await trx("users").where({ id: userId }).first();

      if (!user) {
        throw new Error("User not found");
      }

      if (user.role === "admin") {
        throw new Error("Cannot delete admin account");
      }

      // ❗ Check bids
      const hasBids = await trx("bids").where({ bidder_id: userId }).first();

      if (hasBids) {
        throw new Error("Cannot delete user with bid history");
      }

      // ❗ Check products (seller)
      const hasProducts = await trx("products")
        .where({ seller_id: userId })
        .first();

      if (hasProducts) {
        throw new Error("Cannot delete seller with products");
      }

      // ❗ Delete seller requests
      await trx("seller_upgrade_requests").where({ user_id: userId }).del();

      // ❗ Delete user
      await trx("users").where({ id: userId }).del();

      return { message: "User deleted permanently" };
    });
  }
}
