// src/controllers/category.controller.ts
import { Request, Response } from "express";
import { CategoryService } from "../services/category.service";
import { ok, fail } from "../utils/response";

export class CategoryController {
  // ===============================
  // GET /categories/get-main-categories
  // ===============================
  static async getMainCategories(req: Request, res: Response) {
    try {
      const data = await CategoryService.getMainCategories();
      return ok(res, data);
    } catch (error) {
      console.error("❌ CategoryController.getMainCategories:", error);
      return fail(res);
    }
  }

  // ===============================
  // GET /categories/get-categories-for-menu
  // ===============================
  static async getCategoriesForMenu(req: Request, res: Response) {
    try {
      const data = await CategoryService.getCategoriesForMenu();
      return ok(res, data);
    } catch (error) {
      console.error("❌ CategoryController.getCategoriesForMenu:", error);
      return fail(res);
    }
  }

  // ===============================
  // GET /categories/get-categories-for-sidebar
  // ===============================
  static async getCategoriesForSidebar(req: Request, res: Response) {
    try {
      const data = await CategoryService.getCategoriesForSidebar();
      return ok(res, data);
    } catch (error) {
      console.error("❌ CategoryController.getCategoriesForSidebar:", error);
      return fail(res);
    }
  }
}
