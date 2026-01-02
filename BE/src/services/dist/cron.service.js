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
exports.CronService = void 0;
var db_1 = require("../config/db");
var CronService = /** @class */ (function () {
    function CronService() {
    }
    CronService.downgradeExpiredSellers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var now, affectedRows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        now = new Date();
                        return [4 /*yield*/, db_1.db("users")
                                .where("role", "seller")
                                .andWhere("seller_expires_at", "<", now)
                                .update({
                                role: "bidder",
                                seller_expires_at: null
                            })];
                    case 1:
                        affectedRows = _a.sent();
                        console.log("Downgraded " + affectedRows + " expired sellers");
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Close expired auctions and create orders if needed
     */
    CronService.closeExpiredAuctions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.transaction(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                            var expiredProducts, _i, expiredProducts_1, product;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, trx("products")
                                            .select("id", "seller_id", "highest_bidder_id", "current_price")
                                            .where("status", "active")
                                            .andWhere("end_time", "<=", trx.fn.now())];
                                    case 1:
                                        expiredProducts = _a.sent();
                                        _i = 0, expiredProducts_1 = expiredProducts;
                                        _a.label = 2;
                                    case 2:
                                        if (!(_i < expiredProducts_1.length)) return [3 /*break*/, 8];
                                        product = expiredProducts_1[_i];
                                        if (!!product.highest_bidder_id) return [3 /*break*/, 4];
                                        return [4 /*yield*/, trx("products")
                                                .where({ id: product.id })
                                                .update({ status: "expired" })];
                                    case 3:
                                        _a.sent();
                                        return [3 /*break*/, 7];
                                    case 4: 
                                    // =============================
                                    // CASE 2: Có người thắng
                                    // =============================
                                    return [4 /*yield*/, trx("products")
                                            .where({ id: product.id })
                                            .update({ status: "closed" })];
                                    case 5:
                                        // =============================
                                        // CASE 2: Có người thắng
                                        // =============================
                                        _a.sent();
                                        // Tạo order (mỗi product chỉ 1 order)
                                        return [4 /*yield*/, trx("orders")
                                                .insert({
                                                product_id: product.id,
                                                buyer_id: product.highest_bidder_id,
                                                seller_id: product.seller_id,
                                                final_price: product.current_price,
                                                status: "pending_payment",
                                                payment_deadline: trx.raw("NOW() + INTERVAL '24 HOURS'")
                                            })
                                                .onConflict("product_id")
                                                .ignore()];
                                    case 6:
                                        // Tạo order (mỗi product chỉ 1 order)
                                        _a.sent(); // an toàn nếu cron chạy trùng
                                        _a.label = 7;
                                    case 7:
                                        _i++;
                                        return [3 /*break*/, 2];
                                    case 8: return [2 /*return*/, expiredProducts.length];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return CronService;
}());
exports.CronService = CronService;
