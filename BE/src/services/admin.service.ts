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
  // Approve upgrade request
  // ===============================
  static async approveUpgradeRequest(requestId: string, adminId: string) {
    return await db.transaction(async (trx) => {
      const req = await trx("seller_upgrade_requests")
        .where({ id: requestId, status: "pending" })
        .first();

      if (!req) throw new Error("Request not found or already processed");

      // 1️⃣ Update request
      await trx("seller_upgrade_requests").where({ id: requestId }).update({
        status: "approved",
        reviewed_at: new Date(),
        reviewed_by: adminId,
      });

      // 2️⃣ Upgrade user role
      await trx("users").where({ id: req.user_id }).update({ role: "seller" });

      return { message: "Request approved" };
    });
  }

  // ===============================
  // Reject upgrade request
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

    return { message: "Request rejected" };
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
}
