import { Router } from "express";
import {
  getBrowseProductsController,
  searchProductsController,
  getProductDetailController,
} from "../controllers/product.controller";

const router = Router();

router.get("/get-browse-product", getBrowseProductsController);
router.get("/search-products", searchProductsController);
router.get("/:productId/get-product-detail", getProductDetailController);

export default router;
