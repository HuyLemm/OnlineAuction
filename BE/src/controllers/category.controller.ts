import { Request, Response } from "express";
import {
  getMainCategoriesService,
  getCategoryForMenuService,
  getCategoryForSidebarService,
} from "../services/category.service";

export async function getMainCategoriesController(req: Request, res: Response) {
  try {
    const data = await getMainCategoriesService();
    res.json({ success: true, data });
  } catch (error) {
    console.error("❌ getMainCategories Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getCategoryForMenuController(
  req: Request,
  res: Response
) {
  try {
    const data = await getCategoryForMenuService();
    res.json({ success: true, data });
  } catch (err) {
    console.error("❌ Category Tree Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getCategoryForSidebarController(
  req: Request,
  res: Response
) {
  try {
    const data = await getCategoryForSidebarService();
    return res.json({ success: true, data });
  } catch (err) {
    console.error("❌ Category Tree Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}
