// src/controllers/category.controller.ts
import { Request, Response } from "express";
import {
  getMainCategoriesService,
  getCategoryForMenuService,
  getCategoryForSidebarService,
} from "../services/category.service";
import { ok, fail } from "../utils/response";

export async function getMainCategoriesController(req: Request, res: Response) {
  try {
    const data = await getMainCategoriesService();
    return ok(res, data);
  } catch (error) {
    console.error("❌ getMainCategories:", error);
    return fail(res);
  }
}

export async function getCategoryForMenuController(
  req: Request,
  res: Response
) {
  try {
    const data = await getCategoryForMenuService();
    return ok(res, data);
  } catch (error) {
    console.error("❌ getCategoryForMenu:", error);
    return fail(res);
  }
}

export async function getCategoryForSidebarController(
  req: Request,
  res: Response
) {
  try {
    const data = await getCategoryForSidebarService();
    return ok(res, data);
  } catch (error) {
    console.error("❌ getCategoryForSidebar:", error);
    return fail(res);
  }
}
