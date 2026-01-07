import { db } from "../config/db";

export class OrderService {
  /* =========================
   * GET messages of order
   * ========================= */
  static async getMessages(orderId: string, userId: string) {
    // =========================
    // 1️⃣ Permission check
    // =========================
    const order = await db("orders")
      .select("buyer_id", "seller_id")
      .where("id", orderId)
      .first();

    if (!order) throw new Error("Order not found");

    if (userId !== order.buyer_id && userId !== order.seller_id) {
      throw new Error("Forbidden");
    }

    // =========================
    // 2️⃣ Load messages
    // =========================
    const rows = await db("order_messages as m")
      .join("users as u", "u.id", "m.sender_id")
      .where("m.order_id", orderId)
      .orderBy("m.created_at", "asc")
      .select(
        "m.id",
        "m.sender_id",
        "m.content",
        "m.created_at",
        "u.full_name as sender_name"
      );

    // =========================
    // 3️⃣ Map to FE DTO (FIXED)
    // =========================
    return rows.map((r) => ({
      id: r.id,
      senderId: r.sender_id,
      senderName: r.sender_name ?? "Unknown",
      content: r.content,
      timestamp: new Date(r.created_at), // ✅ FIX QUAN TRỌNG
      isOwn: r.sender_id === userId,
    }));
  }

  /* =========================
   * SEND message
   * ========================= */
  static async sendMessage({
    orderId,
    senderId,
    content,
  }: {
    orderId: string;
    senderId: string;
    content: string;
  }) {
    const order = await db("orders")
      .select("buyer_id", "seller_id")
      .where("id", orderId)
      .first();

    if (!order) throw new Error("Order not found");

    if (senderId !== order.buyer_id && senderId !== order.seller_id) {
      throw new Error("Forbidden");
    }

    const receiverId =
      senderId === order.buyer_id ? order.seller_id : order.buyer_id;

    const [msg] = await db("order_messages")
      .insert({
        order_id: orderId,
        sender_id: senderId,
        receiver_id: receiverId,
        content,
      })
      .returning("*");

    return msg;
  }

  /* =========================
   * MARK AS READ
   * ========================= */
  static async markAsRead(orderId: string, userId: string) {
    await db("order_messages")
      .where({
        order_id: orderId,
        receiver_id: userId,
        is_read: false,
      })
      .update({ is_read: true });
  }

  // OrderService.ts
  static async getPaymentInfo(orderId: string, userId: string) {
    // 1️⃣ Check permission + lấy product_id & buyer_id
    const order = await db("orders")
      .select("buyer_id", "seller_id", "product_id")
      .where("id", orderId)
      .first();

    if (!order) throw new Error("Order not found");

    if (userId !== order.buyer_id && userId !== order.seller_id) {
      throw new Error("Forbidden");
    }

    // 2️⃣ Load payment + join product + buyer
    const row = await db("order_payments as op")
      .join("orders as o", "o.id", "op.order_id")
      .join("products as p", "p.id", "o.product_id")
      .join("users as u", "u.id", "o.buyer_id")
      .select(
        "op.id",
        "op.note",
        "op.created_at",
        "op.buyer_id",
        "op.payment_ref",
        "op.delivery_address",
        "op.phone_number",

        "p.current_price as amount",
        "u.full_name as buyer_name"
      )
      .where("op.order_id", orderId)
      .first();

    if (!row) return null;

    // 3️⃣ DTO trả về FE
    return {
      id: row.id,
      amount: Number(row.amount), // current_price
      note: row.note,
      submittedAt: row.created_at,
      buyerId: row.buyer_id,
      buyerName: row.buyer_name,
      paymentRef: row.payment_ref,
      deliveryAddress: row.delivery_address,
      phoneNumber: row.phone_number,
    };
  }

  /* ===============================
   * Get shipping info by order
   * =============================== */
  static async getShippingByOrder(orderId: string, userId: string) {
    // 1️⃣ Check order + permission
    const order = await db("orders")
      .select("id", "buyer_id", "seller_id", "status")
      .where("id", orderId)
      .first();

    if (!order) {
      throw new Error("Order not found");
    }

    if (userId !== order.buyer_id && userId !== order.seller_id) {
      throw new Error("Forbidden");
    }

    // 2️⃣ Load shipment
    const shipment = await db("order_shipments")
      .select("shipping_code", "shipping_provider", "shipped_at", "note")
      .where("order_id", orderId)
      .first();

    if (!shipment) return null;

    return {
      shipping_code: shipment.shipping_code,
      shipping_provider: shipment.shipping_provider ?? undefined,
      shipped_at: shipment.shipped_at,
      note: shipment.note ?? undefined,
    };
  }
}
