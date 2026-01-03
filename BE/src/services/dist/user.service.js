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
exports.UserService = void 0;
var bcrypt_1 = require("bcrypt");
var db_1 = require("../config/db");
var sendOtpMail_1 = require("../utils/sendOtpMail");
var time_1 = require("../utils/time");
var SALT_ROUNDS = 10;
var UserService = /** @class */ (function () {
    function UserService() {
    }
    UserService.baseQuery = function () {
        return db_1.db("products as p")
            .leftJoin("product_images as pi", function () {
            this.on("pi.product_id", "=", "p.id").andOn("pi.is_main", "=", db_1.db.raw("true"));
        })
            .leftJoin("categories as c", "c.id", "p.category_id")
            .leftJoin("users as u", "u.id", "p.highest_bidder_id")
            .leftJoin("bids as b", "b.product_id", "p.id")
            .select("p.id", "p.title", "p.auction_type as auctionType", "p.highest_bidder_id as highestBidderId", "u.full_name as highestBidderName", "p.buy_now_price as buyNowPrice", "p.created_at as postedDate", "p.description", "p.end_time", "p.category_id as categoryId", "c.name as category", db_1.db.raw("COALESCE(p.current_price, p.start_price)::int AS \"currentBid\""), db_1.db.raw("COALESCE(pi.image_url, '') AS \"image\""), db_1.db.raw("COUNT(b.id) AS bids"))
            .where("p.status", "active")
            .groupBy("p.id", "pi.image_url", "c.name", "u.full_name");
    };
    // ===============================
    // Watchlist - Get all
    // ===============================
    UserService.getWatchlist = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var rows, THREE_DAYS_MS, now;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.baseQuery()
                            .join("watchlists as w", "w.product_id", "p.id")
                            .where("w.user_id", userId)
                            .select(db_1.db.raw("MAX(w.created_at) as watchlisted_at"))
                            .groupBy("p.id", "pi.image_url", "c.name", "u.full_name")
                            .orderBy("watchlisted_at", "desc")];
                    case 1:
                        rows = _a.sent();
                        THREE_DAYS_MS = 60 * 60 * 24 * 3 * 1000;
                        return [4 /*yield*/, time_1.getDbNowMs()];
                    case 2:
                        now = _a.sent();
                        return [2 /*return*/, rows.map(function (p) {
                                var endTime = new Date(p.end_time).getTime();
                                var timeLeft = endTime - now;
                                return {
                                    id: p.id,
                                    title: p.title,
                                    category: p.category,
                                    categoryId: p.categoryId,
                                    image: p.image,
                                    description: p.description,
                                    postedDate: p.postedDate,
                                    end_time: p.end_time,
                                    auctionType: p.auctionType,
                                    buyNowPrice: p.buyNowPrice,
                                    currentBid: p.currentBid,
                                    bids: Number(p.bids),
                                    highestBidderId: p.highestBidderId,
                                    highestBidderName: p.highestBidderName,
                                    // ✅ LOGIC MỚI
                                    isHot: Number(p.currentBid) > 4000,
                                    endingSoon: timeLeft > 0 && timeLeft < THREE_DAYS_MS
                                };
                            })];
                }
            });
        });
    };
    // ===============================
    // Watchlist - Add
    // ===============================
    UserService.addToWatchlist = function (userId, productId) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db("watchlists")
                            .where({ user_id: userId, product_id: productId })
                            .del()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, db_1.db("watchlists").insert({
                                user_id: userId,
                                product_id: productId,
                                created_at: db_1.db.raw("NOW()")
                            })];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _a.sent();
                        // PostgreSQL unique_violation
                        if (err_1.code === "23505") {
                            return [2 /*return*/];
                        }
                        throw err_1;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // ===============================
    // Watchlist - Remove
    // ===============================
    UserService.removeFromWatchlist = function (userId, productId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db("watchlists")
                            .where({
                            user_id: userId,
                            product_id: productId
                        })
                            .del()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // ===============================
    // Watchlist - Get product ids only
    // ===============================
    UserService.getWatchlistProductIds = function (userId) {
        return __awaiter(this, void 0, Promise, function () {
            var rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db("watchlists")
                            .select("product_id")
                            .where({ user_id: userId })];
                    case 1:
                        rows = _a.sent();
                        return [2 /*return*/, rows.map(function (r) { return r.product_id; })];
                }
            });
        });
    };
    UserService.removeManyFromWatchlist = function (userId, productIds) {
        return __awaiter(this, void 0, void 0, function () {
            var deletedCount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!Array.isArray(productIds) || productIds.length === 0) {
                            return [2 /*return*/, { deleted: 0 }];
                        }
                        return [4 /*yield*/, db_1.db("watchlists")
                                .where("user_id", userId)
                                .whereIn("product_id", productIds)
                                .del()];
                    case 1:
                        deletedCount = _a.sent();
                        return [2 /*return*/, {
                                deleted: deletedCount
                            }];
                }
            });
        });
    };
    // ===============================
    // Profile - Get
    // ===============================
    UserService.getProfile = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db("users")
                            .select("id", "email", "full_name", "dob", "address", "role", "created_at")
                            .where({ id: userId })
                            .first()];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new Error("User not found");
                        }
                        return [2 /*return*/, user];
                }
            });
        });
    };
    // ===============================
    // Profile - Update
    // ===============================
    UserService.updateProfile = function (userId, payload) {
        return __awaiter(this, void 0, void 0, function () {
            var updateData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        updateData = {};
                        if (payload.email)
                            updateData.email = payload.email;
                        if (payload.fullName)
                            updateData.full_name = payload.fullName;
                        if (payload.dob)
                            updateData.dob = payload.dob;
                        if (payload.address)
                            updateData.address = payload.address;
                        if (Object.keys(updateData).length === 0) {
                            throw new Error("No data to update");
                        }
                        return [4 /*yield*/, db_1.db("users").where({ id: userId }).update(updateData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.getProfile(userId)];
                }
            });
        });
    };
    // ===============================
    // Profile - Change Password
    // ===============================
    UserService.changePassword = function (userId, oldPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function () {
            var user, isMatch, newHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db("users")
                            .select("password_hash")
                            .where({ id: userId })
                            .first()];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new Error("User not found");
                        }
                        return [4 /*yield*/, bcrypt_1["default"].compare(oldPassword, user.password_hash)];
                    case 2:
                        isMatch = _a.sent();
                        if (!isMatch) {
                            throw new Error("Current password is incorrect");
                        }
                        return [4 /*yield*/, bcrypt_1["default"].hash(newPassword, SALT_ROUNDS)];
                    case 3:
                        newHash = _a.sent();
                        return [4 /*yield*/, db_1.db("users").where({ id: userId }).update({ password_hash: newHash })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, { success: true }];
                }
            });
        });
    };
    // ===============================
    // Ratings - Summary
    // ===============================
    UserService.getRatingSummary = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var rows, plus, minus, _i, rows_1, r, totalVotes, totalScore;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db("ratings").select("score").where("to_user", userId)];
                    case 1:
                        rows = _a.sent();
                        plus = 0;
                        minus = 0;
                        for (_i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                            r = rows_1[_i];
                            if (r.score === 1)
                                plus++;
                            if (r.score === -1)
                                minus++;
                        }
                        totalVotes = plus + minus;
                        totalScore = plus - minus;
                        return [2 /*return*/, {
                                totalScore: totalScore,
                                plus: plus,
                                minus: minus,
                                ratio: plus + "/" + totalVotes,
                                totalVotes: totalVotes
                            }];
                }
            });
        });
    };
    // ===============================
    // Ratings - Detail list
    // ===============================
    UserService.getRatingDetails = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db("ratings as r")
                            // người đánh giá
                            .join("users as u", "u.id", "r.from_user")
                            // sản phẩm được đánh giá
                            .join("products as p", "p.id", "r.product_id")
                            // ảnh main của product
                            .leftJoin("product_images as pi", function () {
                            this.on("pi.product_id", "=", "p.id").andOn("pi.is_main", "=", db_1.db.raw("true"));
                        })
                            // category
                            .leftJoin("categories as c", "c.id", "p.category_id")
                            .select(
                        // rating
                        "r.id", "r.score", "r.comment", "r.created_at", 
                        // from user
                        "u.id as fromUserId", "u.full_name as fromUserName", 
                        // product
                        "p.id as productId", "p.title as productTitle", "c.name as category", db_1.db.raw("COALESCE(pi.image_url, '') AS \"productImage\""))
                            .where("r.to_user", userId)
                            .orderBy("r.created_at", "desc")];
                    case 1:
                        rows = _a.sent();
                        return [2 /*return*/, rows.map(function (r) { return ({
                                id: r.id,
                                score: r.score,
                                comment: r.comment,
                                createdAt: r.created_at,
                                fromUser: {
                                    id: r.fromUserId,
                                    fullName: r.fromUserName
                                },
                                product: {
                                    id: r.productId,
                                    title: r.productTitle,
                                    image: r.productImage,
                                    category: r.category
                                }
                            }); })];
                }
            });
        });
    };
    // ===============================
    // Seller upgrade request (Bidder)
    // ===============================
    UserService.requestUpgradeToSeller = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, lastRequest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db("users").select("role").where({ id: userId }).first()];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            throw new Error("User not found");
                        // ❌ Đã là seller
                        if (user.role === "seller") {
                            throw new Error("You are already a seller");
                        }
                        return [4 /*yield*/, db_1.db("seller_upgrade_requests")
                                .where({ user_id: userId })
                                .orderBy("requested_at", "desc")
                                .first()];
                    case 2:
                        lastRequest = _a.sent();
                        // ❌ Pending
                        if (lastRequest && lastRequest.status === "pending") {
                            throw new Error("You already have a pending upgrade request");
                        }
                        // ❌ Approved (đề phòng role chưa sync)
                        if (lastRequest && lastRequest.status === "approved") {
                            throw new Error("Your upgrade request has already been approved");
                        }
                        // ✅ Chỉ cho request nếu:
                        // - chưa có request
                        // - hoặc request trước bị rejected
                        return [4 /*yield*/, db_1.db("seller_upgrade_requests").insert({
                                user_id: userId,
                                status: "pending",
                                requested_at: db_1.db.raw("NOW()")
                            })];
                    case 3:
                        // ✅ Chỉ cho request nếu:
                        // - chưa có request
                        // - hoặc request trước bị rejected
                        _a.sent();
                        return [2 /*return*/, {
                                message: "Upgrade request submitted successfully"
                            }];
                }
            });
        });
    };
    // ===============================
    // Seller upgrade - Get my request status
    // ===============================
    UserService.getUpgradeSellerRequestStatus = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, request;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db("users").select("role").where({ id: userId }).first()];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            throw new Error("User not found");
                        if (user.role === "seller") {
                            return [2 /*return*/, {
                                    role: "seller",
                                    request: null
                                }];
                        }
                        return [4 /*yield*/, db_1.db("seller_upgrade_requests")
                                .where({ user_id: userId })
                                .orderBy("requested_at", "desc")
                                .first()];
                    case 2:
                        request = _a.sent();
                        return [2 /*return*/, {
                                role: user.role,
                                request: request
                                    ? {
                                        id: request.id,
                                        status: request.status,
                                        requestedAt: request.requested_at
                                    }
                                    : null
                            }];
                }
            });
        });
    };
    // ===============================
    // Auctions bidder is participating in
    // ===============================
    UserService.getMyActiveBids = function (userId) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var bidRows, bidsByProduct, _i, bidRows_1, bid, productIds, productRows;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, db_1.db("bids")
                            .where("bidder_id", userId)
                            .orderBy("bid_amount", "desc")];
                    case 1:
                        bidRows = _b.sent();
                        if (bidRows.length === 0) {
                            return [2 /*return*/, []];
                        }
                        bidsByProduct = {};
                        for (_i = 0, bidRows_1 = bidRows; _i < bidRows_1.length; _i++) {
                            bid = bidRows_1[_i];
                            ((_a = bidsByProduct[bid.product_id]) !== null && _a !== void 0 ? _a : ) = [];
                            push({
                                id: bid.id,
                                amount: Number(bid.bid_amount),
                                time: bid.bid_time
                            });
                        }
                        productIds = Object.keys(bidsByProduct);
                        return [4 /*yield*/, db_1.db("products as p")
                                .leftJoin("categories as c", "c.id", "p.category_id")
                                .leftJoin("users as s", "s.id", "p.seller_id")
                                .leftJoin("product_images as pi", function () {
                                this.on("pi.product_id", "=", "p.id").andOn("pi.is_main", "=", db_1.db.raw("true"));
                            })
                                .leftJoin("users as hb", "hb.id", "p.highest_bidder_id")
                                .whereIn("p.id", productIds)
                                .andWhere("p.status", "active")
                                .select("p.id", "p.title", "p.status", "p.current_price", "p.start_price", "p.end_time", "p.highest_bidder_id", "p.auction_type", "c.name as category", "s.full_name as sellerName", "hb.full_name as highestBidderName", db_1.db.raw("COALESCE(pi.image_url, '') AS image"))];
                    case 2:
                        productRows = _b.sent();
                        /* =============================
                         * 4️⃣ Trả dữ liệu cho FE
                         * ============================= */
                        return [2 /*return*/, productRows.map(function (p) {
                                var _a, _b;
                                return ({
                                    product: {
                                        id: p.id,
                                        title: p.title,
                                        category: p.category,
                                        sellerName: p.sellerName,
                                        image: p.image,
                                        auctionType: p.auction_type,
                                        status: p.status,
                                        isClosed: p.status !== "active",
                                        currentPrice: (_a = Number(p.current_price)) !== null && _a !== void 0 ? _a : Number(p.start_price),
                                        endTime: p.end_time,
                                        highestBidder: p.highest_bidder_id
                                            ? {
                                                id: p.highest_bidder_id,
                                                name: p.highestBidderName
                                            }
                                            : null
                                    },
                                    myBids: (_b = bidsByProduct[p.id]) !== null && _b !== void 0 ? _b : []
                                });
                            })];
                }
            });
        });
    };
    // ===============================
    // Questions - Ask seller about product
    // ===============================
    UserService.askQuestion = function (userId, productId, content) {
        return __awaiter(this, void 0, void 0, function () {
            var user, product, question;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!content || !content.trim()) {
                            throw new Error("Question content is required");
                        }
                        return [4 /*yield*/, db_1.db("users")
                                .select("id", "role", "is_blocked", "full_name")
                                .where({ id: userId })
                                .first()];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            throw new Error("User not found");
                        if (user.is_blocked)
                            throw new Error("Your account is blocked");
                        if (user.role !== "bidder") {
                            throw new Error("Only bidders can ask questions");
                        }
                        return [4 /*yield*/, db_1.db("products as p")
                                .join("users as s", "s.id", "p.seller_id")
                                .select("p.id as productId", "p.title as productTitle", "p.status as productStatus", "s.id as sellerId", "s.full_name as sellerName", "s.email as sellerEmail")
                                .where("p.id", productId)
                                .first()];
                    case 2:
                        product = _a.sent();
                        if (!product)
                            throw new Error("Product not found");
                        // ✅ ĐÚNG FIELD
                        if (product.productStatus !== "active") {
                            throw new Error("Cannot ask question for inactive product");
                        }
                        // ❌ không được hỏi sản phẩm của chính mình
                        if (product.sellerId === userId) {
                            throw new Error("You cannot ask question on your own product");
                        }
                        return [4 /*yield*/, db_1.db("questions")
                                .insert({
                                product_id: productId,
                                user_id: userId,
                                content: content.trim(),
                                created_at: db_1.db.raw("NOW()")
                            })
                                .returning(["id", "content", "created_at"])];
                    case 3:
                        question = (_a.sent())[0];
                        /* =============================
                         * 4️⃣ Email notify seller
                         * ============================= */
                        return [4 /*yield*/, sendOtpMail_1.sendQuestionNotificationMail({
                                to: product.sellerEmail,
                                receiverName: product.sellerName,
                                senderName: user.full_name,
                                productTitle: product.productTitle,
                                productId: product.productId,
                                message: content
                            })];
                    case 4:
                        /* =============================
                         * 4️⃣ Email notify seller
                         * ============================= */
                        _a.sent();
                        return [2 /*return*/, {
                                id: question.id,
                                content: question.content,
                                createdAt: question.created_at
                            }];
                }
            });
        });
    };
    /* ===============================
     * Q&A - Bidder reply question
     * =============================== */
    UserService.replyQuestionAsBidder = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var bidderId, questionId, content;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bidderId = params.bidderId, questionId = params.questionId, content = params.content;
                        if (!content || !content.trim()) {
                            throw new Error("Reply content is required");
                        }
                        return [4 /*yield*/, db_1.db.transaction(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                                var bidder, question, reply, notifiedEmails;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, trx("users")
                                                .select("id", "role", "is_blocked", "full_name", "email")
                                                .where({ id: bidderId })
                                                .first()];
                                        case 1:
                                            bidder = _a.sent();
                                            if (!bidder)
                                                throw new Error("User not found");
                                            if (bidder.role !== "bidder") {
                                                throw new Error("Only bidders can reply here");
                                            }
                                            if (bidder.is_blocked) {
                                                throw new Error("Your account is blocked");
                                            }
                                            return [4 /*yield*/, trx("questions as q")
                                                    .join("products as p", "p.id", "q.product_id")
                                                    .join("users as s", "s.id", "p.seller_id") // seller
                                                    .join("users as a", "a.id", "q.user_id") // asker (bidder hỏi ban đầu)
                                                    .select("q.id as questionId", "q.product_id as productId", "p.title as productTitle", "p.status as productStatus", "s.id as sellerId", "s.full_name as sellerName", "s.email as sellerEmail", "a.id as askerId", "a.full_name as askerName", "a.email as askerEmail")
                                                    .where("q.id", questionId)
                                                    .first()];
                                        case 2:
                                            question = _a.sent();
                                            if (!question) {
                                                throw new Error("Question not found");
                                            }
                                            if (question.productStatus !== "active") {
                                                throw new Error("Cannot reply to question of inactive product");
                                            }
                                            return [4 /*yield*/, trx("answers")
                                                    .insert({
                                                    question_id: questionId,
                                                    user_id: bidderId,
                                                    role: "bidder",
                                                    content: content.trim(),
                                                    created_at: trx.raw("NOW()")
                                                })
                                                    .returning(["id", "content", "created_at"])];
                                        case 3:
                                            reply = (_a.sent())[0];
                                            notifiedEmails = new Set();
                                            if (!(question.sellerEmail && question.sellerId !== bidderId)) return [3 /*break*/, 5];
                                            notifiedEmails.add(question.sellerEmail);
                                            return [4 /*yield*/, sendOtpMail_1.sendQuestionNotificationMail({
                                                    to: question.sellerEmail,
                                                    receiverName: question.sellerName,
                                                    senderName: bidder.full_name,
                                                    productTitle: question.productTitle,
                                                    productId: question.productId,
                                                    message: content
                                                })];
                                        case 4:
                                            _a.sent();
                                            _a.label = 5;
                                        case 5:
                                            if (!(question.askerEmail &&
                                                question.askerId !== bidderId &&
                                                !notifiedEmails.has(question.askerEmail))) return [3 /*break*/, 7];
                                            return [4 /*yield*/, sendOtpMail_1.sendQuestionNotificationMail({
                                                    to: question.askerEmail,
                                                    receiverName: question.askerName,
                                                    senderName: bidder.full_name,
                                                    productTitle: question.productTitle,
                                                    productId: question.productId,
                                                    message: content
                                                })];
                                        case 6:
                                            _a.sent();
                                            _a.label = 7;
                                        case 7: 
                                        /* =============================
                                         * 5️⃣ Return
                                         * ============================= */
                                        return [2 /*return*/, {
                                                id: reply.id,
                                                content: reply.content,
                                                createdAt: reply.created_at
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
    // Get system settings by keys
    // ===============================
    UserService.getSystemSettings = function (keys, trx) {
        return __awaiter(this, void 0, Promise, function () {
            var query, rows, map, _i, rows_2, row, num;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = trx !== null && trx !== void 0 ? trx : db_1.db;
                        return [4 /*yield*/, query("system_settings")
                                .whereIn("key", keys)
                                .select("key", "value")];
                    case 1:
                        rows = _a.sent();
                        map = {};
                        for (_i = 0, rows_2 = rows; _i < rows_2.length; _i++) {
                            row = rows_2[_i];
                            num = Number(row.value);
                            if (!Number.isNaN(num)) {
                                map[row.key] = num;
                            }
                        }
                        return [2 /*return*/, map];
                }
            });
        });
    };
    // ===============================
    // Auto Bid - Place max bid (CORE)
    // ===============================
    UserService.placeAutoBid = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, productId, maxPrice;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = params.userId, productId = params.productId, maxPrice = params.maxPrice;
                        if (!Number.isFinite(maxPrice) || maxPrice <= 0) {
                            throw new Error("Invalid max price");
                        }
                        return [4 /*yield*/, db_1.db.transaction(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                                var bidder, product, blocked, existingAutoBid, autoBids, bidStep, startPrice, previousPrice, newCurrentPrice, highestBidderId, a, b, winner, loser, aMax, bMax, winnerMax, loserMax, priceChanged, winnerChanged, loser, settings, cfg, thresholdMin, durationMin, thresholdMs, durationMs, freshProduct, dbNow, endTime, remainingMs;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, trx("users")
                                                .select("id", "role", "allow_bid", "is_blocked")
                                                .where({ id: userId })
                                                .first()];
                                        case 1:
                                            bidder = _a.sent();
                                            if (!bidder)
                                                throw new Error("User not found");
                                            if (bidder.role !== "bidder")
                                                throw new Error("Only bidders can bid");
                                            if (!bidder.allow_bid)
                                                throw new Error("You are not allowed to bid");
                                            if (bidder.is_blocked)
                                                throw new Error("Your account is blocked");
                                            return [4 /*yield*/, trx("products")
                                                    .select("id", "seller_id", "status", "start_price", "bid_step", "current_price", "highest_bidder_id", "buy_now_price", "end_time", "auto_extend")
                                                    .where({ id: productId })
                                                    .first()];
                                        case 2:
                                            product = _a.sent();
                                            if (!product)
                                                throw new Error("Product not found");
                                            if (product.status !== "active")
                                                throw new Error("Auction is not active");
                                            if (product.seller_id === userId)
                                                throw new Error("You cannot bid on your own product");
                                            return [4 /*yield*/, trx("blocked_bidders")
                                                    .where({ product_id: productId, bidder_id: userId })
                                                    .first()];
                                        case 3:
                                            blocked = _a.sent();
                                            if (blocked) {
                                                throw new Error(blocked.reason || "You are blocked from bidding");
                                            }
                                            return [4 /*yield*/, trx("auto_bids")
                                                    .where({ product_id: productId, bidder_id: userId })
                                                    .first()];
                                        case 4:
                                            existingAutoBid = _a.sent();
                                            if (existingAutoBid && maxPrice <= Number(existingAutoBid.max_price)) {
                                                throw new Error("New max bid must be higher than your current max (" + existingAutoBid.max_price + ")");
                                            }
                                            /* =============================
                                             * 5️⃣ Upsert auto_bids
                                             * ============================= */
                                            return [4 /*yield*/, trx("auto_bids")
                                                    .insert({
                                                    product_id: productId,
                                                    bidder_id: userId,
                                                    max_price: maxPrice,
                                                    created_at: trx.raw("NOW()")
                                                })
                                                    .onConflict(["product_id", "bidder_id"])
                                                    .merge({
                                                    max_price: maxPrice,
                                                    created_at: trx.raw("NOW()")
                                                })];
                                        case 5:
                                            /* =============================
                                             * 5️⃣ Upsert auto_bids
                                             * ============================= */
                                            _a.sent();
                                            return [4 /*yield*/, trx("auto_bid_events").insert({
                                                    product_id: productId,
                                                    bidder_id: userId,
                                                    type: existingAutoBid ? "max_bid_updated" : "max_bid_set",
                                                    max_bid: maxPrice,
                                                    description: existingAutoBid
                                                        ? "Updated maximum auto bid"
                                                        : "Set maximum auto bid"
                                                })];
                                        case 6:
                                            _a.sent();
                                            return [4 /*yield*/, trx("auto_bids")
                                                    .where({ product_id: productId })
                                                    .select("bidder_id", "max_price", "created_at")
                                                    .orderBy([
                                                    { column: "max_price", order: "desc" },
                                                    { column: "created_at", order: "asc" },
                                                ])
                                                    .limit(2)];
                                        case 7:
                                            autoBids = _a.sent();
                                            bidStep = Number(product.bid_step);
                                            startPrice = Number(product.start_price);
                                            previousPrice = product.current_price !== null
                                                ? Number(product.current_price)
                                                : startPrice;
                                            newCurrentPrice = previousPrice;
                                            highestBidderId = product.highest_bidder_id;
                                            if (!(autoBids.length === 1)) return [3 /*break*/, 8];
                                            newCurrentPrice = startPrice + bidStep;
                                            highestBidderId = autoBids[0].bidder_id;
                                            return [3 /*break*/, 12];
                                        case 8:
                                            if (!(autoBids.length === 2)) return [3 /*break*/, 12];
                                            a = autoBids[0], b = autoBids[1];
                                            winner = a;
                                            loser = b;
                                            aMax = Number(a.max_price);
                                            bMax = Number(b.max_price);
                                            if (!(bMax > aMax)) return [3 /*break*/, 9];
                                            winner = b;
                                            loser = a;
                                            return [3 /*break*/, 11];
                                        case 9:
                                            if (!(aMax === bMax)) return [3 /*break*/, 11];
                                            if (new Date(b.created_at) < new Date(a.created_at)) {
                                                winner = b;
                                                loser = a;
                                            }
                                            return [4 /*yield*/, trx("auto_bid_events").insert({
                                                    product_id: productId,
                                                    bidder_id: winner.bidder_id,
                                                    type: "tie_break_win",
                                                    max_bid: aMax,
                                                    description: "Won tie-break by placing max bid earlier"
                                                })];
                                        case 10:
                                            _a.sent();
                                            _a.label = 11;
                                        case 11:
                                            highestBidderId = winner.bidder_id;
                                            winnerMax = Number(winner.max_price);
                                            loserMax = Number(loser.max_price);
                                            /**
                                             * RULE GIÁ (QUAN TRỌNG):
                                             * - Nếu userId (người vừa đặt/update auto bid) THẮNG
                                             *   → chỉ cần vượt người cũ 1 step
                                             *   → min(winnerMax, loserMax + bidStep)
                                             *
                                             * - Nếu userId THUA
                                             *   → giá = max của người mới (loser)
                                             */
                                            if (winner.bidder_id === userId) {
                                                newCurrentPrice = Math.min(winnerMax, loserMax + bidStep);
                                            }
                                            else {
                                                newCurrentPrice = loserMax;
                                            }
                                            // ❌ không cho giảm giá
                                            if (newCurrentPrice < previousPrice) {
                                                newCurrentPrice = previousPrice;
                                            }
                                            _a.label = 12;
                                        case 12:
                                            if (!(product.buy_now_price && maxPrice >= Number(product.buy_now_price))) return [3 /*break*/, 16];
                                            return [4 /*yield*/, trx("products").where({ id: productId }).update({
                                                    current_price: product.buy_now_price,
                                                    highest_bidder_id: userId,
                                                    status: "closed"
                                                })];
                                        case 13:
                                            _a.sent();
                                            return [4 /*yield*/, trx("bids").insert({
                                                    product_id: productId,
                                                    bidder_id: userId,
                                                    bid_amount: product.buy_now_price,
                                                    bid_time: trx.raw("NOW()")
                                                })];
                                        case 14:
                                            _a.sent();
                                            return [4 /*yield*/, trx("auto_bid_events").insert({
                                                    product_id: productId,
                                                    bidder_id: userId,
                                                    type: "winning",
                                                    amount: product.buy_now_price,
                                                    description: "Won instantly via Buy Now"
                                                })];
                                        case 15:
                                            _a.sent();
                                            return [2 /*return*/, {
                                                    productId: productId,
                                                    currentPrice: product.buy_now_price,
                                                    highestBidderId: userId,
                                                    isBuyNow: true
                                                }];
                                        case 16:
                                            priceChanged = newCurrentPrice > previousPrice;
                                            winnerChanged = highestBidderId !== product.highest_bidder_id;
                                            if (!(priceChanged || winnerChanged)) return [3 /*break*/, 18];
                                            return [4 /*yield*/, trx("products").where({ id: productId }).update({
                                                    current_price: newCurrentPrice,
                                                    highest_bidder_id: highestBidderId
                                                })];
                                        case 17:
                                            _a.sent();
                                            _a.label = 18;
                                        case 18:
                                            if (!priceChanged) return [3 /*break*/, 22];
                                            return [4 /*yield*/, trx("bids").insert({
                                                    product_id: productId,
                                                    bidder_id: highestBidderId,
                                                    bid_amount: newCurrentPrice,
                                                    bid_time: new Date()
                                                })];
                                        case 19:
                                            _a.sent();
                                            return [4 /*yield*/, trx("auto_bid_events").insert({
                                                    product_id: productId,
                                                    bidder_id: highestBidderId,
                                                    type: "auto_bid",
                                                    amount: newCurrentPrice,
                                                    description: "System automatically placed a bid"
                                                })];
                                        case 20:
                                            _a.sent();
                                            loser = autoBids.find(function (b) { return b.bidder_id !== highestBidderId; });
                                            if (!loser) return [3 /*break*/, 22];
                                            return [4 /*yield*/, trx("auto_bid_events").insert({
                                                    product_id: productId,
                                                    bidder_id: loser.bidder_id,
                                                    type: "outbid_instantly",
                                                    amount: newCurrentPrice,
                                                    related_bidder_id: highestBidderId,
                                                    description: "Your bid was instantly surpassed by an existing auto bid"
                                                })];
                                        case 21:
                                            _a.sent();
                                            _a.label = 22;
                                        case 22:
                                            if (!(product.auto_extend && priceChanged)) return [3 /*break*/, 27];
                                            return [4 /*yield*/, trx("system_settings")
                                                    .whereIn("key", [
                                                    "auto_extend_threshold_minutes",
                                                    "auto_extend_duration_minutes",
                                                ])
                                                    .select("key", "value")];
                                        case 23:
                                            settings = _a.sent();
                                            cfg = Object.fromEntries(settings.map(function (s) { return [s.key, Number(String(s.value).trim())]; }));
                                            thresholdMin = cfg.auto_extend_threshold_minutes;
                                            durationMin = cfg.auto_extend_duration_minutes;
                                            if (!Number.isFinite(thresholdMin) || !Number.isFinite(durationMin)) {
                                                throw new Error("Invalid auto extend config");
                                            }
                                            thresholdMs = thresholdMin * 60000;
                                            durationMs = durationMin * 60000;
                                            return [4 /*yield*/, trx("products")
                                                    .select("end_time")
                                                    .where({ id: productId })
                                                    .first()];
                                        case 24:
                                            freshProduct = _a.sent();
                                            return [4 /*yield*/, time_1.getDbNowMs(trx)];
                                        case 25:
                                            dbNow = _a.sent();
                                            endTime = new Date(freshProduct.end_time).getTime();
                                            remainingMs = endTime - dbNow;
                                            if (!(remainingMs > 0 && remainingMs <= thresholdMs)) return [3 /*break*/, 27];
                                            return [4 /*yield*/, trx("products")
                                                    .where({ id: productId })
                                                    .update({
                                                    end_time: trx.raw("end_time + INTERVAL '" + durationMin + " MINUTES'")
                                                })];
                                        case 26:
                                            _a.sent();
                                            _a.label = 27;
                                        case 27: return [2 /*return*/, {
                                                productId: productId,
                                                currentPrice: newCurrentPrice,
                                                highestBidderId: highestBidderId,
                                                isBuyNow: false,
                                                isUpdate: !!existingAutoBid
                                            }];
                                    }
                                });
                            }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserService.sendBidRequest = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var productId, bidderId, message;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        productId = params.productId, bidderId = params.bidderId, message = params.message;
                        return [4 /*yield*/, db_1.db.transaction(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                                var product, existing, request;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, trx("products")
                                                .select("id", "seller_id", "bid_requirement", "status")
                                                .where({ id: productId })
                                                .first()];
                                        case 1:
                                            product = _a.sent();
                                            if (!product)
                                                throw new Error("Product not found");
                                            if (product.status !== "active")
                                                throw new Error("Auction is not active");
                                            if (product.bid_requirement !== "qualified") {
                                                throw new Error("This auction does not require approval");
                                            }
                                            if (product.seller_id === bidderId) {
                                                throw new Error("You cannot request bidding on your own product");
                                            }
                                            return [4 /*yield*/, trx("bid_requests")
                                                    .where({
                                                    product_id: productId,
                                                    bidder_id: bidderId
                                                })
                                                    .first()];
                                        case 2:
                                            existing = _a.sent();
                                            if (existing) {
                                                throw new Error("You already sent a request (" + existing.status + ")");
                                            }
                                            return [4 /*yield*/, trx("bid_requests")
                                                    .insert({
                                                    product_id: productId,
                                                    bidder_id: bidderId,
                                                    seller_id: product.seller_id,
                                                    message: message !== null && message !== void 0 ? message : null
                                                })
                                                    .returning("*")];
                                        case 3:
                                            request = (_a.sent())[0];
                                            return [2 /*return*/, request];
                                    }
                                });
                            }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // ===============================
    // Buy Now - Instant purchase
    // ===============================
    UserService.buyNow = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, productId;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = params.userId, productId = params.productId;
                        return [4 /*yield*/, db_1.db.transaction(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                                var product, now, dbNow, endTime, bidder;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, trx("products")
                                                .where({ id: productId })
                                                .forUpdate()
                                                .first()];
                                        case 1:
                                            product = _a.sent();
                                            if (!product)
                                                throw new Error("Product not found");
                                            if (product.status !== "active")
                                                throw new Error("Auction is not active");
                                            if (!product.buy_now_price)
                                                throw new Error("Buy Now is not available");
                                            if (product.seller_id === userId)
                                                throw new Error("You cannot buy your own product");
                                            return [4 /*yield*/, trx.raw("SELECT NOW()")];
                                        case 2:
                                            now = (_a.sent()).rows[0].now;
                                            dbNow = new Date(now).getTime();
                                            endTime = new Date(product.end_time).getTime();
                                            if (endTime <= dbNow) {
                                                throw new Error("Auction has already ended");
                                            }
                                            return [4 /*yield*/, trx("users")
                                                    .select("id", "role", "allow_bid", "is_blocked")
                                                    .where({ id: userId })
                                                    .first()];
                                        case 3:
                                            bidder = _a.sent();
                                            if (!bidder)
                                                throw new Error("User not found");
                                            if (bidder.role !== "bidder")
                                                throw new Error("Only bidders can buy now");
                                            if (!bidder.allow_bid)
                                                throw new Error("You are not allowed to bid");
                                            if (bidder.is_blocked)
                                                throw new Error("Your account is blocked");
                                            /* =============================
                                             * 5️⃣ Close auction immediately
                                             * ============================= */
                                            return [4 /*yield*/, trx("products").where({ id: productId }).update({
                                                    status: "closed",
                                                    current_price: product.buy_now_price,
                                                    highest_bidder_id: userId,
                                                    end_time: now
                                                })];
                                        case 4:
                                            /* =============================
                                             * 5️⃣ Close auction immediately
                                             * ============================= */
                                            _a.sent();
                                            /* =============================
                                             * 6️⃣ Insert bid record (type = buy_now)
                                             * ============================= */
                                            return [4 /*yield*/, trx("bids").insert({
                                                    product_id: productId,
                                                    bidder_id: userId,
                                                    bid_amount: product.buy_now_price,
                                                    bid_time: now
                                                })];
                                        case 5:
                                            /* =============================
                                             * 6️⃣ Insert bid record (type = buy_now)
                                             * ============================= */
                                            _a.sent();
                                            /* =============================
                                             * 7️⃣ Create order (idempotent)
                                             * ============================= */
                                            return [4 /*yield*/, trx("orders")
                                                    .insert({
                                                    product_id: productId,
                                                    buyer_id: userId,
                                                    seller_id: product.seller_id,
                                                    final_price: product.buy_now_price,
                                                    status: "pending_payment",
                                                    payment_deadline: trx.raw("NOW() + INTERVAL '24 HOURS'")
                                                })
                                                    .onConflict("product_id")
                                                    .ignore()];
                                        case 6:
                                            /* =============================
                                             * 7️⃣ Create order (idempotent)
                                             * ============================= */
                                            _a.sent();
                                            /* =============================
                                             * 8️⃣ Event log
                                             * ============================= */
                                            return [4 /*yield*/, trx("auto_bid_events").insert({
                                                    product_id: productId,
                                                    bidder_id: userId,
                                                    type: "winning",
                                                    amount: product.buy_now_price,
                                                    description: "Auction won via Buy Now"
                                                })];
                                        case 7:
                                            /* =============================
                                             * 8️⃣ Event log
                                             * ============================= */
                                            _a.sent();
                                            return [2 /*return*/, {
                                                    productId: productId,
                                                    finalPrice: product.buy_now_price,
                                                    buyerId: userId,
                                                    status: "closed",
                                                    isBuyNow: true
                                                }];
                                    }
                                });
                            }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserService.getWonAuctions = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db("products as p")
                            .join("orders as o", "o.product_id", "p.id")
                            .join("users as s", "s.id", "p.seller_id")
                            .leftJoin("categories as c", "c.id", "p.category_id")
                            .leftJoin("product_images as img", function () {
                            this.on("img.product_id", "=", "p.id").andOn("img.is_main", "=", db_1.db.raw("true"));
                        })
                            // ✅ CORE RULE: thắng auction
                            .where("p.status", "closed")
                            .andWhere("p.highest_bidder_id", userId)
                            .select("o.id as orderId", "p.id as itemId", "p.title", "img.image_url as image", "o.final_price", "p.end_time", "c.name as category", 
                        // ✅ order info
                        "o.status as order_status", "o.payment_deadline", "s.full_name as seller_name")
                            .orderBy("p.end_time", "desc")];
                    case 1:
                        rows = _a.sent();
                        return [2 /*return*/, rows.map(function (r) {
                                var _a;
                                return ({
                                    id: r.orderId,
                                    itemId: r.itemId,
                                    title: r.title,
                                    image: (_a = r.image) !== null && _a !== void 0 ? _a : "",
                                    winningBid: Number(r.final_price),
                                    // ⏱️ auction end time = won date
                                    wonDate: r.end_time,
                                    category: r.category,
                                    orderStatus: r.order_status,
                                    sellerName: r.seller_name,
                                    // ⬅️ QUAN TRỌNG
                                    paymentDeadline: r.payment_deadline
                                });
                            })];
                }
            });
        });
    };
    return UserService;
}());
exports.UserService = UserService;
