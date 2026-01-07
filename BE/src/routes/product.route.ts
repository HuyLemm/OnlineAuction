import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import {
  authenticateOptional,
  authenticate,
} from "../middlewares/auth.middleware";

const router = Router();

router.get("/get-browse-product", ProductController.getBrowseProducts);
router.get("/search-products", ProductController.searchProducts);
router.get(
  "/:productId/get-product-detail",
  authenticateOptional,
  ProductController.getProductDetail
);
router.get("/orders/:orderId", authenticate, ProductController.getOrderDetail);
router.get(
  "/orders/:orderId/rating",
  authenticate,
  ProductController.getMyRating
);

router.get("/ratings/:role/:userId", ProductController.getProfile);

export default router;
