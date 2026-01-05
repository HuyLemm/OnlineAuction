import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/:orderId/messages", authenticate, OrderController.getMessages);

router.post("/:orderId/messages", authenticate, OrderController.sendMessage);

router.get(
  "/:orderId/payment",
  authenticate,
  OrderController.getPaymentInfo
);

router.get(
  "/:orderId/shipping",
  authenticate,
  OrderController.getShipping
);

export default router;
