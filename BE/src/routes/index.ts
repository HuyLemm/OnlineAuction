import { Router } from "express";
import productRouter from "./product.route";
import homeRouter from "./home.route";
import categoryRouter from "./category.route";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import adminRouter from "./admin.route";
import sellerRouter from "./seller.route";
import orderRouter from "./order.route";

const router = Router();

router.use("/products", productRouter);
router.use("/home", homeRouter);
router.use("/categories", categoryRouter);
router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/admin", adminRouter);
router.use("/seller", sellerRouter);
router.use("/orders", orderRouter);

export default router;
