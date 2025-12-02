import { Router } from "express";
import productRouter from "./product.route";

const router = Router();

router.use("/products", productRouter);

export default router;
