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
exports.AdminService = void 0;
var db_1 = require("../config/db");
var sendOtpMail_1 = require("../utils/sendOtpMail");
var bcrypt_1 = require("bcrypt");
var AdminService = /** @class */ (function () {
    function AdminService() {
    }
    // ===============================
    // Get all upgrade requests
    // ===============================
    AdminService.getUpgradeRequests = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db("seller_upgrade_requests as r")
                            .join("users as u", "u.id", "r.user_id")
                            .select("r.id", "r.status", "r.requested_at", "u.id as userId", "u.full_name as fullName", "u.email")
                            .orderBy("r.requested_at", "desc")];
                    case 1:
                        rows = _a.sent();
                        return [2 /*return*/, rows];
                }
            });
        });
    };
    // ===============================
    // Create parent category
    // ===============================
    AdminService.createParentCategory = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var existed, id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(name === null || name === void 0 ? void 0 : name.trim())) {
                            throw new Error("Category name is required");
                        }
                        return [4 /*yield*/, db_1.db("categories")
                                .whereRaw("LOWER(name) = LOWER(?)", [name.trim()])
                                .whereNull("parent_id")
                                .first()];
                    case 1:
                        existed = _a.sent();
                        if (existed) {
                            throw new Error("Parent category already exists");
                        }
                        return [4 /*yield*/, db_1.db("categories")
                                .insert({
                                name: name.trim(),
                                parent_id: null
                            })
                                .returning("id")];
                    case 2:
                        id = (_a.sent())[0];
                        return [2 /*return*/, {
                                message: "Parent category created successfully",
                                id: id
                            }];
                }
            });
        });
    };
    // ===============================
    // Create subcategory
    // ===============================
    AdminService.createSubcategory = function (parentId, name) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(name === null || name === void 0 ? void 0 : name.trim())) {
                            throw new Error("Subcategory name is required");
                        }
                        return [4 /*yield*/, db_1.db.transaction(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                                var parent, existed, id;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, trx("categories")
                                                .where({ id: parentId })
                                                .whereNull("parent_id")
                                                .first()];
                                        case 1:
                                            parent = _a.sent();
                                            if (!parent) {
                                                throw new Error("Parent category not found");
                                            }
                                            return [4 /*yield*/, trx("categories")
                                                    .whereRaw("LOWER(name) = LOWER(?)", [name.trim()])
                                                    .andWhere({ parent_id: parentId })
                                                    .first()];
                                        case 2:
                                            existed = _a.sent();
                                            if (existed) {
                                                throw new Error("Subcategory already exists under this parent");
                                            }
                                            return [4 /*yield*/, trx("categories")
                                                    .insert({
                                                    name: name.trim(),
                                                    parent_id: parentId
                                                })
                                                    .returning("id")];
                                        case 3:
                                            id = (_a.sent())[0];
                                            return [2 /*return*/, {
                                                    message: "Subcategory created successfully",
                                                    id: id
                                                }];
                                    }
                                });
                            }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // ===============================
    // Update parent category
    // ===============================
    AdminService.updateParentCategory = function (categoryId, name) {
        return __awaiter(this, void 0, void 0, function () {
            var category, existed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(name === null || name === void 0 ? void 0 : name.trim())) {
                            throw new Error("Category name is required");
                        }
                        return [4 /*yield*/, db_1.db("categories")
                                .where({ id: categoryId })
                                .whereNull("parent_id")
                                .first()];
                    case 1:
                        category = _a.sent();
                        if (!category) {
                            throw new Error("Parent category not found");
                        }
                        return [4 /*yield*/, db_1.db("categories")
                                .whereRaw("LOWER(name) = LOWER(?)", [name.trim()])
                                .whereNull("parent_id")
                                .andWhereNot({ id: categoryId })
                                .first()];
                    case 2:
                        existed = _a.sent();
                        if (existed) {
                            throw new Error("Parent category name already exists");
                        }
                        return [4 /*yield*/, db_1.db("categories")
                                .where({ id: categoryId })
                                .update({ name: name.trim() })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, { message: "Parent category updated" }];
                }
            });
        });
    };
    // ===============================
    // Update subcategory
    // ===============================
    AdminService.updateSubcategory = function (subcategoryId, name) {
        return __awaiter(this, void 0, void 0, function () {
            var sub, existed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(name === null || name === void 0 ? void 0 : name.trim())) {
                            throw new Error("Subcategory name is required");
                        }
                        return [4 /*yield*/, db_1.db("categories")
                                .where({ id: subcategoryId })
                                .whereNotNull("parent_id")
                                .first()];
                    case 1:
                        sub = _a.sent();
                        if (!sub) {
                            throw new Error("Subcategory not found");
                        }
                        return [4 /*yield*/, db_1.db("categories")
                                .whereRaw("LOWER(name) = LOWER(?)", [name.trim()])
                                .andWhere({ parent_id: sub.parent_id })
                                .andWhereNot({ id: subcategoryId })
                                .first()];
                    case 2:
                        existed = _a.sent();
                        if (existed) {
                            throw new Error("Subcategory name already exists");
                        }
                        return [4 /*yield*/, db_1.db("categories")
                                .where({ id: subcategoryId })
                                .update({ name: name.trim() })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, { message: "Subcategory updated" }];
                }
            });
        });
    };
    // ===============================
    // Delete subcategory
    // ===============================
    AdminService.deleteSubcategory = function (subcategoryId) {
        return __awaiter(this, void 0, void 0, function () {
            var sub, hasProducts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db("categories")
                            .where({ id: subcategoryId })
                            .whereNotNull("parent_id")
                            .first()];
                    case 1:
                        sub = _a.sent();
                        if (!sub) {
                            throw new Error("Subcategory not found");
                        }
                        return [4 /*yield*/, db_1.db("products")
                                .where({ category_id: subcategoryId })
                                .first()];
                    case 2:
                        hasProducts = _a.sent();
                        if (hasProducts) {
                            throw new Error("Cannot delete subcategory with products");
                        }
                        return [4 /*yield*/, db_1.db("categories").where({ id: subcategoryId }).del()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, { message: "Subcategory deleted" }];
                }
            });
        });
    };
    // ===============================
    // Delete parent category
    // ===============================
    AdminService.deleteParentCategory = function (categoryId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.transaction(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                            var parent, subcategories, subIds, subHasProducts, parentHasProducts;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, trx("categories")
                                            .where({ id: categoryId })
                                            .whereNull("parent_id")
                                            .first()];
                                    case 1:
                                        parent = _a.sent();
                                        if (!parent) {
                                            throw new Error("Parent category not found");
                                        }
                                        return [4 /*yield*/, trx("categories").where({
                                                parent_id: categoryId
                                            })];
                                    case 2:
                                        subcategories = _a.sent();
                                        subIds = subcategories.map(function (s) { return s.id; });
                                        if (!(subIds.length > 0)) return [3 /*break*/, 4];
                                        return [4 /*yield*/, trx("products")
                                                .whereIn("category_id", subIds)
                                                .first()];
                                    case 3:
                                        subHasProducts = _a.sent();
                                        if (subHasProducts) {
                                            throw new Error("Cannot delete parent category with subcategories that have products");
                                        }
                                        _a.label = 4;
                                    case 4: return [4 /*yield*/, trx("products")
                                            .where({ category_id: categoryId })
                                            .first()];
                                    case 5:
                                        parentHasProducts = _a.sent();
                                        if (parentHasProducts) {
                                            throw new Error("Cannot delete parent category with products");
                                        }
                                        // 3️⃣ Delete subcategories first
                                        return [4 /*yield*/, trx("categories").where({ parent_id: categoryId }).del()];
                                    case 6:
                                        // 3️⃣ Delete subcategories first
                                        _a.sent();
                                        // 4️⃣ Delete parent
                                        return [4 /*yield*/, trx("categories").where({ id: categoryId }).del()];
                                    case 7:
                                        // 4️⃣ Delete parent
                                        _a.sent();
                                        return [2 /*return*/, { message: "Parent category deleted" }];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // ===============================
    // Get products for admin dashboard
    // ===============================
    AdminService.getAdminProducts = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var parentCategoryId, _a, sortBy, minPrice, maxPrice, query;
            return __generator(this, function (_b) {
                parentCategoryId = params.parentCategoryId, _a = params.sortBy, sortBy = _a === void 0 ? "newest" : _a, minPrice = params.minPrice, maxPrice = params.maxPrice;
                query = db_1.db("products as p")
                    // ===== MAIN IMAGE =====
                    .leftJoin("product_images as img", function () {
                    this.on("img.product_id", "p.id").andOn("img.is_main", db_1.db.raw("true"));
                })
                    // ===== SUB CATEGORY =====
                    .leftJoin("categories as sub", "sub.id", "p.category_id")
                    // ===== PARENT CATEGORY =====
                    .leftJoin("categories as parent", "parent.id", "sub.parent_id")
                    // ===== SELLER =====
                    .leftJoin("users as u", "u.id", "p.seller_id")
                    // ===== BIDS =====
                    .leftJoin("bids as b", "b.product_id", "p.id")
                    .select("p.id", "p.title", "p.start_price", "p.current_price", "p.buy_now_price", "p.status", "p.created_at", "p.end_time", "p.description", "p.auction_type", "img.image_url as image", "sub.id as subcategory_id", "sub.name as subcategory_name", "parent.id as parent_category_id", "parent.name as parent_category_name", "u.full_name as seller_name", "u.email as seller_email")
                    .countDistinct("b.id as total_bids")
                    .groupBy("p.id", "img.image_url", "sub.id", "parent.id", "u.id");
                // ================= FILTER =================
                if (parentCategoryId) {
                    query.where("parent.id", parentCategoryId);
                }
                if (minPrice !== undefined) {
                    query.where("p.current_price", ">=", minPrice);
                }
                if (maxPrice !== undefined) {
                    query.where("p.current_price", "<=", maxPrice);
                }
                // ================= SORT =================
                switch (sortBy) {
                    case "ending_soon":
                        query.orderBy("p.end_time", "asc");
                        break;
                    case "most_bids":
                        query.orderBy("total_bids", "desc");
                        break;
                    case "price_high":
                        query.orderBy("p.current_price", "desc");
                        break;
                    case "price_low":
                        query.orderBy("p.current_price", "asc");
                        break;
                    case "newest":
                    default:
                        query.orderBy("p.created_at", "desc");
                }
                return [2 /*return*/, query];
            });
        });
    };
    // ===============================
    // Update product (admin)
    // ===============================
    AdminService.updateProduct = function (productId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var title, description, buyNowPrice, status, product;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        title = data.title, description = data.description, buyNowPrice = data.buyNowPrice, status = data.status;
                        if (!(title === null || title === void 0 ? void 0 : title.trim())) {
                            throw new Error("Product title is required");
                        }
                        return [4 /*yield*/, db_1.db("products").where({ id: productId }).first()];
                    case 1:
                        product = _a.sent();
                        if (!product) {
                            throw new Error("Product not found");
                        }
                        return [4 /*yield*/, db_1.db("products")
                                .where({ id: productId })
                                .update({
                                title: title.trim(),
                                description: description !== null && description !== void 0 ? description : null,
                                buy_now_price: buyNowPrice !== null && buyNowPrice !== void 0 ? buyNowPrice : null,
                                status: status
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { message: "Product updated successfully" }];
                }
            });
        });
    };
    // ===============================
    // Toggle delete product (admin)
    // ===============================
    AdminService.toggleDeleteProduct = function (productId, expired) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.transaction(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                            var product;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, trx("products")
                                            .select("id", "status")
                                            .where({ id: productId })
                                            .first()];
                                    case 1:
                                        product = _a.sent();
                                        if (!product) {
                                            throw new Error("Product not found");
                                        }
                                        // ❌ Không làm gì nếu trạng thái không đổi
                                        if (expired && product.status === "expired") {
                                            return [2 /*return*/, { message: "Product already expired" }];
                                        }
                                        if (!expired && product.status !== "expired") {
                                            return [2 /*return*/, { message: "Product is already active" }];
                                        }
                                        // ✅ Soft delete / restore bằng status
                                        return [4 /*yield*/, trx("products")
                                                .where({ id: productId })
                                                .update({
                                                status: expired ? "expired" : "active"
                                            })];
                                    case 2:
                                        // ✅ Soft delete / restore bằng status
                                        _a.sent();
                                        return [2 /*return*/, {
                                                message: expired
                                                    ? "Product expired successfully"
                                                    : "Product restored successfully"
                                            }];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // ===============================
    // Get users for admin management
    // ===============================
    AdminService.getAdminUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db("users as u")
                            // ===== BIDDER: products joined =====
                            .leftJoin(db_1.db("bids")
                            .select("bidder_id")
                            .countDistinct("product_id as products_joined")
                            .groupBy("bidder_id")
                            .as("bid_stats"), "bid_stats.bidder_id", "u.id")
                            // ===== BIDDER: products won =====
                            .leftJoin(db_1.db("products")
                            .select("highest_bidder_id")
                            .count("id as products_won")
                            .whereNotNull("highest_bidder_id")
                            .groupBy("highest_bidder_id")
                            .as("win_stats"), "win_stats.highest_bidder_id", "u.id")
                            // ===== SELLER: products sold =====
                            .leftJoin(db_1.db("products")
                            .select("seller_id")
                            .count("id as products_sold")
                            .groupBy("seller_id")
                            .as("seller_stats"), "seller_stats.seller_id", "u.id")
                            // ===== SELLER REQUEST STATS =====
                            .leftJoin(db_1.db("seller_upgrade_requests")
                            .select("user_id")
                            .count("id as seller_request_count")
                            .groupBy("user_id")
                            .as("req_stats"), "req_stats.user_id", "u.id")
                            // ===== LATEST SELLER REQUEST (ID + STATUS) =====
                            .leftJoin(db_1.db("seller_upgrade_requests as r2")
                            .select("r2.id", "r2.user_id", "r2.status")
                            .whereRaw("\n            r2.requested_at = (\n              SELECT MAX(r3.requested_at)\n              FROM seller_upgrade_requests r3\n              WHERE r3.user_id = r2.user_id\n            )\n          ")
                            .as("latest_req"), "latest_req.user_id", "u.id")
                            .select("u.id", "u.full_name", "u.email", "u.role", "u.is_blocked", "u.is_deleted", "u.created_at", db_1.db.raw("COALESCE(bid_stats.products_joined, 0) as products_joined"), db_1.db.raw("COALESCE(win_stats.products_won, 0) as products_won"), db_1.db.raw("COALESCE(seller_stats.products_sold, 0) as products_sold"), db_1.db.raw("COALESCE(req_stats.seller_request_count, 0) as seller_request_count"), "latest_req.id as latest_seller_request_id", "latest_req.status as latest_seller_request_status")
                            .orderBy("u.created_at", "desc")];
                    case 1:
                        rows = _a.sent();
                        return [2 /*return*/, rows];
                }
            });
        });
    };
    // ===============================
    // Approve seller upgrade request
    // ===============================
    AdminService.approveUpgradeRequest = function (requestId, adminId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.transaction(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                            var req;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, trx("seller_upgrade_requests")
                                            .where({ id: requestId, status: "pending" })
                                            .first()];
                                    case 1:
                                        req = _a.sent();
                                        if (!req) {
                                            throw new Error("Request not found or already processed");
                                        }
                                        // 2️⃣ Update request
                                        return [4 /*yield*/, trx("seller_upgrade_requests")
                                                .where({ id: requestId })
                                                .update({
                                                status: "approved",
                                                reviewed_at: trx.raw("NOW()"),
                                                reviewed_by: adminId
                                            })];
                                    case 2:
                                        // 2️⃣ Update request
                                        _a.sent();
                                        // 3️⃣ Update user → seller có hạn 7 ngày
                                        return [4 /*yield*/, trx("users")
                                                .where({ id: req.user_id })
                                                .update({
                                                role: "seller",
                                                seller_approved_at: trx.raw("NOW()"),
                                                seller_expires_at: trx.raw("NOW() + INTERVAL '7 DAYS'")
                                            })];
                                    case 3:
                                        // 3️⃣ Update user → seller có hạn 7 ngày
                                        _a.sent();
                                        return [2 /*return*/, {
                                                message: "Seller upgrade approved"
                                            }];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // ===============================
    // Reject seller upgrade request
    // ===============================
    AdminService.rejectUpgradeRequest = function (requestId, adminId) {
        return __awaiter(this, void 0, void 0, function () {
            var updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db("seller_upgrade_requests")
                            .where({ id: requestId, status: "pending" })
                            .update({
                            status: "rejected",
                            reviewed_at: db_1.db.raw("NOW()"),
                            reviewed_by: adminId
                        })];
                    case 1:
                        updated = _a.sent();
                        if (!updated) {
                            throw new Error("Request not found or already processed");
                        }
                        return [2 /*return*/, { message: "Seller upgrade rejected" }];
                }
            });
        });
    };
    // ===============================
    // Get single user details (admin)
    // ===============================
    AdminService.getUserById = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db("users as u")
                            // ===== BIDDER: products joined =====
                            .leftJoin(db_1.db("bids")
                            .select("bidder_id")
                            .countDistinct("product_id as products_joined")
                            .groupBy("bidder_id")
                            .as("bid_stats"), "bid_stats.bidder_id", "u.id")
                            // ===== BIDDER: products won =====
                            .leftJoin(db_1.db("products")
                            .select("highest_bidder_id")
                            .count("id as products_won")
                            .whereNotNull("highest_bidder_id")
                            .groupBy("highest_bidder_id")
                            .as("win_stats"), "win_stats.highest_bidder_id", "u.id")
                            // ===== SELLER: products sold =====
                            .leftJoin(db_1.db("products")
                            .select("seller_id")
                            .count("id as products_sold")
                            .groupBy("seller_id")
                            .as("seller_stats"), "seller_stats.seller_id", "u.id")
                            .where("u.id", userId)
                            .select("u.id", "u.full_name", "u.email", "u.role", "u.is_blocked", "u.created_at", "u.address", "u.dob", "u.is_verified", "u.seller_approved_at", "u.seller_expires_at", db_1.db.raw("COALESCE(bid_stats.products_joined, 0) as products_joined"), db_1.db.raw("COALESCE(win_stats.products_won, 0) as products_won"), db_1.db.raw("COALESCE(seller_stats.products_sold, 0) as products_sold"))
                            .first()];
                    case 1:
                        row = _a.sent();
                        if (!row) {
                            throw new Error("User not found");
                        }
                        return [2 /*return*/, row];
                }
            });
        });
    };
    // ===============================
    // Update user (admin)
    // ===============================
    AdminService.updateUser = function (userId, data) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, db_1.db("users").where({ id: userId }).first()];
                    case 1:
                        user = _c.sent();
                        if (!user) {
                            throw new Error("User not found");
                        }
                        // ❗ Không cho admin tự hạ quyền admin khác (optional nhưng nên có)
                        if (user.role === "admin" && data.role !== "admin") {
                            throw new Error("Cannot downgrade admin role");
                        }
                        return [4 /*yield*/, db_1.db("users")
                                .where({ id: userId })
                                .update({
                                full_name: data.fullName.trim(),
                                email: data.email.toLowerCase().trim(),
                                role: data.role,
                                is_blocked: data.isBlocked,
                                is_verified: data.isVerified,
                                dob: (_a = data.dob) !== null && _a !== void 0 ? _a : null,
                                address: (_b = data.address) !== null && _b !== void 0 ? _b : null
                            })];
                    case 2:
                        _c.sent();
                        return [2 /*return*/, { message: "User updated successfully" }];
                }
            });
        });
    };
    // ===============================
    // Ban / Unban user
    // ===============================
    AdminService.toggleBanUser = function (userId, ban) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db("users").where({ id: userId }).first()];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new Error("User not found");
                        }
                        if (user.role === "admin") {
                            throw new Error("Cannot ban admin");
                        }
                        return [4 /*yield*/, db_1.db("users")
                                .where({ id: userId })
                                .update({
                                is_blocked: ban,
                                allow_bid: ban ? false : true
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, {
                                message: ban ? "User banned successfully" : "User unbanned successfully"
                            }];
                }
            });
        });
    };
    // ===============================
    // Delete/ Restore user account (admin)
    // ===============================
    AdminService.toggleDeleteUser = function (userId, deleted) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.transaction(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                            var user;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, trx("users")
                                            .select("id", "role", "is_deleted")
                                            .where({ id: userId })
                                            .first()];
                                    case 1:
                                        user = _a.sent();
                                        if (!user) {
                                            throw new Error("User not found");
                                        }
                                        if (user.role === "admin") {
                                            throw new Error("Cannot delete admin account");
                                        }
                                        // ❌ Không làm gì nếu trạng thái không đổi
                                        if (user.is_deleted === deleted) {
                                            return [2 /*return*/, {
                                                    message: deleted ? "User already deleted" : "User already active"
                                                }];
                                        }
                                        if (!deleted) return [3 /*break*/, 4];
                                        return [4 /*yield*/, trx("seller_upgrade_requests").where({ user_id: userId }).del()];
                                    case 2:
                                        _a.sent();
                                        // revoke session
                                        return [4 /*yield*/, trx("user_sessions").where({ user_id: userId }).del()];
                                    case 3:
                                        // revoke session
                                        _a.sent();
                                        _a.label = 4;
                                    case 4: 
                                    // ✅ Toggle is_deleted
                                    return [4 /*yield*/, trx("users").where({ id: userId }).update({
                                            is_deleted: deleted
                                        })];
                                    case 5:
                                        // ✅ Toggle is_deleted
                                        _a.sent();
                                        return [2 /*return*/, {
                                                message: deleted
                                                    ? "User soft-deleted successfully"
                                                    : "User restored successfully"
                                            }];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /* ===============================
     * GET system settings
     * =============================== */
    AdminService.getSystemSettings = function () {
        var _a, _b;
        return __awaiter(this, void 0, Promise, function () {
            var rows, map, _i, rows_1, r;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, db_1.db("system_settings").select("key", "value")];
                    case 1:
                        rows = _c.sent();
                        map = new Map();
                        for (_i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                            r = rows_1[_i];
                            map.set(r.key, Number(r.value));
                        }
                        return [2 /*return*/, {
                                auto_extend_duration_minutes: (_a = map.get("auto_extend_duration_minutes")) !== null && _a !== void 0 ? _a : 10,
                                auto_extend_threshold_minutes: (_b = map.get("auto_extend_threshold_minutes")) !== null && _b !== void 0 ? _b : 5
                            }];
                }
            });
        });
    };
    /* ===============================
     * UPDATE system settings
     * =============================== */
    AdminService.updateSystemSettings = function (payload) {
        return __awaiter(this, void 0, Promise, function () {
            var now;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        now = db_1.db.fn.now();
                        return [4 /*yield*/, db_1.db.transaction(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                                var _i, _a, _b, key, value;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            _i = 0, _a = Object.entries(payload);
                                            _c.label = 1;
                                        case 1:
                                            if (!(_i < _a.length)) return [3 /*break*/, 4];
                                            _b = _a[_i], key = _b[0], value = _b[1];
                                            return [4 /*yield*/, trx("system_settings")
                                                    .insert({
                                                    key: key,
                                                    value: value,
                                                    updated_at: now
                                                })
                                                    .onConflict("key")
                                                    .merge({
                                                    value: value,
                                                    updated_at: now
                                                })];
                                        case 2:
                                            _c.sent();
                                            _c.label = 3;
                                        case 3:
                                            _i++;
                                            return [3 /*break*/, 1];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /* ===============================
     * CHANGE USER PASSWORD
     * =============================== */
    AdminService.changeUserPassword = function (userId, newPassword, adminName) {
        return __awaiter(this, void 0, void 0, function () {
            var user, passwordHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!newPassword || newPassword.length < 8) {
                            throw new Error("Password must be at least 8 characters");
                        }
                        return [4 /*yield*/, db_1.db("users")
                                .select("id", "email", "full_name", "is_deleted")
                                .where({ id: userId })
                                .first()];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            throw new Error("User not found");
                        if (user.is_deleted)
                            throw new Error("Cannot change password for deleted user");
                        return [4 /*yield*/, bcrypt_1["default"].hash(newPassword, 10)];
                    case 2:
                        passwordHash = _a.sent();
                        return [4 /*yield*/, db_1.db("users")
                                .update({ password_hash: passwordHash })
                                .where({ id: userId })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, sendOtpMail_1.sendPasswordChangedByAdminMail({
                                to: user.email,
                                userName: user.full_name || "User"
                            })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    return AdminService;
}());
exports.AdminService = AdminService;
