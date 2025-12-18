import { Router } from "express";
import { ProductController } from "../controllers/product.controller";

const router = Router();

router.get("/get-browse-product", ProductController.getBrowseProducts);
router.get("/search-products", ProductController.searchProducts);
router.get("/:productId/get-product-detail", ProductController.getProductDetail);

export default router;
