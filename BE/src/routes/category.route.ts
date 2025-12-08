import { Router } from "express";
import {
  getMainCategoriesController,
  getCategoryForMenuController,
  getCategoryForSidebarController,
} from "../controllers/category.controller";

const router = Router();

router.get("/get-main-categories", getMainCategoriesController);
router.get("/get-categories-for-menu", getCategoryForMenuController);
router.get("/get-categories-for-sidebar", getCategoryForSidebarController);

export default router;
