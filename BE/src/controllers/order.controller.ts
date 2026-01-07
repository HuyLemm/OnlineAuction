import { AuthRequest } from "../middlewares/auth.middleware";
import { Response } from "express";
import { OrderService } from "../services/order.service";

export class OrderController {
  static async getMessages(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ success: false });

      const { orderId } = req.params;
      if (!orderId) return res.status(400).json({ success: false });
      const data = await OrderService.getMessages(orderId, req.user.userId);

      return res.json({ success: true, data });
    } catch (e: any) {
      return res.status(403).json({
        success: false,
        message: e.message,
      });
    }
  }

  static async sendMessage(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ success: false });

      const { orderId } = req.params;
      const { content } = req.body;
      if (!orderId) return res.status(400).json({ success: false });
      const msg = await OrderService.sendMessage({
        orderId,
        senderId: req.user.userId,
        content,
      });

      return res.json({ success: true, data: msg });
    } catch (e: any) {
      return res.status(403).json({
        success: false,
        message: e.message,
      });
    }
  }
  // OrderController.ts
  static async getPaymentInfo(req: AuthRequest, res: Response) {
    try {
      const { orderId } = req.params;
      const userId = req.user!.userId;

      if (!orderId) return res.status(400).json({ success: false });

      const data = await OrderService.getPaymentInfo(orderId, userId);

      return res.json({
        success: true,
        data,
      });
    } catch (err: any) {
      return res.status(403).json({
        success: false,
        message: err.message,
      });
    }
  }

  // ===============================
  // GET /orders/:orderId/shipping
  // ===============================
  static async getShipping(req: AuthRequest, res: Response) {
    try {
      const { orderId } = req.params;
      const userId = req.user!.userId;

      if (!orderId) return res.status(400).json({ success: false });

      const shippingData = await OrderService.getShippingByOrder(
        orderId,
        userId
      );

      return res.json({
        success: true,
        data: shippingData,
      });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }
}
