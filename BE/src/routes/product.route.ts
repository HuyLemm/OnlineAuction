import { Router } from "express";
import { getBrowseProductsController } from "../controllers/product.controller";

const router = Router();

router.get("/get-browse-product", getBrowseProductsController);

export default router;
