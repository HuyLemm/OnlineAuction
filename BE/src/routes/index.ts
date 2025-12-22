import { Router } from "express";
import productRouter from "./product.route";
import homeRouter from "./home.route";
import categoryRouter from "./category.route";
import userRouter from "./user.route";
import adminRouter from "./admin.route";

const router = Router();

router.use("/products", productRouter);
router.use("/home", homeRouter);
router.use("/categories", categoryRouter);
router.use("/users", userRouter);
router.use("/admin", adminRouter);

export default router;
