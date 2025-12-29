import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { authenticateOptional } from "../middlewares/auth.middleware";

const router = Router();

router.get("/get-browse-product", ProductController.getBrowseProducts);
router.get("/search-products", ProductController.searchProducts);
router.get(
  "/:productId/get-product-detail",
  authenticateOptional,
  ProductController.getProductDetail
);

export default router;
