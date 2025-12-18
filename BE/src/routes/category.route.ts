import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";

const router = Router();

router.get("/get-main-categories", CategoryController.getMainCategories);
router.get("/get-categories-for-menu", CategoryController.getCategoriesForMenu);
router.get(
  "/get-categories-for-sidebar",
  CategoryController.getCategoriesForSidebar
);

export default router;
