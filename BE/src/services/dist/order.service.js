"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.OrderService = void 0;
var db_1 = require("../config/db");
var OrderService = /** @class */ (function () {
    function OrderService() {
    }
    /* =========================
     * GET messages of order
     * ========================= */
    OrderService.getMessages = function (orderId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var order, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db("orders")
                            .select("buyer_id", "seller_id")
                            .where("id", orderId)
                            .first()];
                    case 1:
                        order = _a.sent();
                        if (!order)
                            throw new Error("Order not found");
                        if (userId !== order.buyer_id && userId !== order.seller_id) {
                            throw new Error("Forbidden");
                        }
                        return [4 /*yield*/, db_1.db("order_messages as m")
                                .join("users as u", "u.id", "m.sender_id")
                                .where("m.order_id", orderId)
                                .orderBy("m.created_at", "asc")
                                .select("m.id", "m.sender_id", "m.content", "m.created_at", "u.full_name as sender_name")];
                    case 2:
                        rows = _a.sent();
                        // =========================
                        // 3️⃣ Map to FE DTO (FIXED)
                        // =========================
                        return [2 /*return*/, rows.map(function (r) {
                                var _a;
                                return ({
                                    id: r.id,
                                    senderId: r.sender_id,
                                    senderName: (_a = r.sender_name) !== null && _a !== void 0 ? _a : "Unknown",
                                    content: r.content,
                                    timestamp: new Date(r.created_at),
                                    isOwn: r.sender_id === userId
                                });
                            })];
                }
            });
        });
    };
    /* =========================
     * SEND message
     * ========================= */
    OrderService.sendMessage = function (_a) {
        var orderId = _a.orderId, senderId = _a.senderId, content = _a.content;
        return __awaiter(this, void 0, void 0, function () {
            var order, receiverId, msg;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, db_1.db("orders")
                            .select("buyer_id", "seller_id")
                            .where("id", orderId)
                            .first()];
                    case 1:
                        order = _b.sent();
                        if (!order)
                            throw new Error("Order not found");
                        if (senderId !== order.buyer_id && senderId !== order.seller_id) {
                            throw new Error("Forbidden");
                        }
                        receiverId = senderId === order.buyer_id ? order.seller_id : order.buyer_id;
                        return [4 /*yield*/, db_1.db("order_messages")
                                .insert({
                                order_id: orderId,
                                sender_id: senderId,
                                receiver_id: receiverId,
                                content: content
                            })
                                .returning("*")];
                    case 2:
                        msg = (_b.sent())[0];
                        return [2 /*return*/, msg];
                }
            });
        });
    };
    /* =========================
     * MARK AS READ
     * ========================= */
    OrderService.markAsRead = function (orderId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db("order_messages")
                            .where({
                            order_id: orderId,
                            receiver_id: userId,
                            is_read: false
                        })
                            .update({ is_read: true })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // OrderService.ts
    OrderService.getPaymentInfo = function (orderId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var order, row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db("orders")
                            .select("buyer_id", "seller_id", "product_id")
                            .where("id", orderId)
                            .first()];
                    case 1:
                        order = _a.sent();
                        if (!order)
                            throw new Error("Order not found");
                        if (userId !== order.buyer_id && userId !== order.seller_id) {
                            throw new Error("Forbidden");
                        }
                        return [4 /*yield*/, db_1.db("order_payments as op")
                                .join("orders as o", "o.id", "op.order_id")
                                .join("products as p", "p.id", "o.product_id")
                                .join("users as u", "u.id", "o.buyer_id")
                                .select("op.id", "op.note", "op.created_at", "op.buyer_id", "op.payment_ref", "op.delivery_address", "op.phone_number", "p.current_price as amount", "u.full_name as buyer_name")
                                .where("op.order_id", orderId)
                                .first()];
                    case 2:
                        row = _a.sent();
                        if (!row)
                            return [2 /*return*/, null];
                        // 3️⃣ DTO trả về FE
                        return [2 /*return*/, {
                                id: row.id,
                                amount: Number(row.amount),
                                note: row.note,
                                submittedAt: row.created_at,
                                buyerId: row.buyer_id,
                                buyerName: row.buyer_name,
                                paymentRef: row.payment_ref,
                                deliveryAddress: row.delivery_address,
                                phoneNumber: row.phone_number
                            }];
                }
            });
        });
    };
    /* ===============================
     * Get shipping info by order
     * =============================== */
    OrderService.getShippingByOrder = function (orderId, userId) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var order, shipment;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, db_1.db("orders")
                            .select("id", "buyer_id", "seller_id", "status")
                            .where("id", orderId)
                            .first()];
                    case 1:
                        order = _c.sent();
                        if (!order) {
                            throw new Error("Order not found");
                        }
                        if (userId !== order.buyer_id && userId !== order.seller_id) {
                            throw new Error("Forbidden");
                        }
                        return [4 /*yield*/, db_1.db("order_shipments")
                                .select("shipping_code", "shipping_provider", "shipped_at", "note")
                                .where("order_id", orderId)
                                .first()];
                    case 2:
                        shipment = _c.sent();
                        if (!shipment)
                            return [2 /*return*/, null];
                        return [2 /*return*/, {
                                shipping_code: shipment.shipping_code,
                                shipping_provider: (_a = shipment.shipping_provider) !== null && _a !== void 0 ? _a : undefined,
                                shipped_at: shipment.shipped_at,
                                note: (_b = shipment.note) !== null && _b !== void 0 ? _b : undefined
                            }];
                }
            });
        });
    };
    return OrderService;
}());
exports.OrderService = OrderService;
