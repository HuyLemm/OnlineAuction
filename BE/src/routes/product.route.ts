import { Router } from "express";
import { getBrowseProductsController, searchProductsController } from "../controllers/product.controller";

const router = Router();

router.get("/get-browse-product", getBrowseProductsController);
router.get("/search-products", searchProductsController);

export default router;
