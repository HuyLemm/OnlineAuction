// src/services/category.service.ts
import { db } from "../config/db";
import {
  MainCategoryDTO,
  CategoryMenuDTO,
  CategorySidebarDTO,
} from "../dto/category.dto";

export class CategoryService {
  // ===============================
  // GET Main Categories (Home / Grid)
  // ===============================
  static async getMainCategories(): Promise<MainCategoryDTO[]> {
    return db("categories as c")
      .leftJoin("categories as sub", "sub.parent_id", "c.id")
      .leftJoin("products as p", function () {
        this.on("p.category_id", "=", "c.id").orOn(
          "p.category_id",
          "=",
          "sub.id"
        );
      })
      .whereNull("c.parent_id")
      .groupBy("c.id")
      .select("c.id", "c.name", db.raw("COUNT(p.id)::int as count"))
      .orderBy("c.name", "asc");
  }

  // ===============================
  // GET Categories for Header / Menu
  // ===============================
  static async getCategoriesForMenu(): Promise<CategoryMenuDTO[]> {
    const categories = await db("categories").select("id", "name", "parent_id");

    const mainCategories = categories.filter((c) => c.parent_id === null);

    return mainCategories.map((main) => ({
      id: main.id,
      main: main.name,
      subcategories: categories
        .filter((sub) => sub.parent_id === main.id)
        .map((sub) => ({
          id: sub.id,
          label: sub.name,
        })),
    }));
  }

  // ===============================
  // GET Categories for Sidebar / Filter
  // ===============================
  static async getCategoriesForSidebar(): Promise<CategorySidebarDTO[]> {
    const categories = await db("categories").select("id", "name", "parent_id");

    const productCounts = await db("products")
      .select("category_id")
      .count("* as count")
      .groupBy("category_id");

    const countMap: Record<string, number> = {};
    productCounts.forEach((row: any) => {
      if (row.category_id) {
        countMap[String(row.category_id)] = Number(row.count);
      }
    });

    const mainCategories = categories.filter((c) => c.parent_id === null);

    return mainCategories.map((main) => {
      const subs = categories.filter((c) => c.parent_id === main.id);

      const subcategories = subs.map((sub) => ({
        id: sub.id,
        label: sub.name,
        count: countMap[String(sub.id)] ?? 0,
      }));

      const totalCount =
        (countMap[String(main.id)] ?? 0) +
        subcategories.reduce((sum, s) => sum + s.count, 0);

      return {
        id: main.id,
        label: main.name,
        count: totalCount,
        subcategories,
      };
    });
  }
}
