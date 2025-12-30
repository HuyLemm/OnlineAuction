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
exports.UserController = void 0;
var user_service_1 = require("../services/user.service");
var UserController = /** @class */ (function () {
    function UserController() {
    }
    // ===============================
    // GET /users/watchlist
    // ===============================
    UserController.getWatchlist = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, watchlist, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!req.user) {
                            return [2 /*return*/, res.status(401).json({
                                    success: false,
                                    message: "Unauthenticated"
                                })];
                        }
                        userId = req.user.userId;
                        return [4 /*yield*/, user_service_1.UserService.getWatchlist(userId)];
                    case 1:
                        watchlist = _a.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: watchlist
                            })];
                    case 2:
                        error_1 = _a.sent();
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: error_1.message || "Failed to fetch watchlist"
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ===============================
    // POST /users/watchlist
    // ===============================
    UserController.addToWatchlist = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var productId, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!req.user) {
                            return [2 /*return*/, res.status(401).json({
                                    success: false,
                                    message: "Unauthenticated"
                                })];
                        }
                        productId = req.body.productId;
                        if (!productId) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: "productId is required"
                                })];
                        }
                        return [4 /*yield*/, user_service_1.UserService.addToWatchlist(req.user.userId, productId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, res.status(201).json({
                                success: true,
                                message: "Added to watchlist"
                            })];
                    case 2:
                        error_2 = _a.sent();
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: error_2.message || "Failed to add watchlist"
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ===============================
    // DELETE /users/watchlist/:productId
    // ===============================
    UserController.removeFromWatchlist = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var productId, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!req.user) {
                            return [2 /*return*/, res.status(401).json({
                                    success: false,
                                    message: "Unauthenticated"
                                })];
                        }
                        productId = req.params.productId;
                        if (!productId) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: "productId is required"
                                })];
                        }
                        return [4 /*yield*/, user_service_1.UserService.removeFromWatchlist(req.user.userId, productId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                message: "Removed from watchlist"
                            })];
                    case 2:
                        error_3 = _a.sent();
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: error_3.message || "Failed to remove watchlist"
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.getWatchlistProductIds = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var ids, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!req.user) {
                            return [2 /*return*/, res.status(401).json({
                                    success: false,
                                    message: "Unauthenticated"
                                })];
                        }
                        return [4 /*yield*/, user_service_1.UserService.getWatchlistProductIds(req.user.userId)];
                    case 1:
                        ids = _a.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: ids
                            })];
                    case 2:
                        error_4 = _a.sent();
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: error_4.message || "Failed to fetch watchlist ids"
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * DELETE /users/watchlists
     * Xóa NHIỀU sản phẩm khỏi watchlist
     * body: { productIds: string[] }
     */
    UserController.removeManyWatchlistItems = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var userId, productIds, result, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        productIds = req.body.productIds;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                        }
                        if (!Array.isArray(productIds)) {
                            return [2 /*return*/, res.status(400).json({ message: "productIds must be an array" })];
                        }
                        return [4 /*yield*/, user_service_1.UserService.removeManyFromWatchlist(userId, productIds)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, res.json({
                                success: true,
                                deleted: result.deleted
                            })];
                    case 2:
                        err_1 = _b.sent();
                        console.error("removeManyWatchlistItems error:", err_1);
                        return [2 /*return*/, res.status(500).json({ message: "Internal server error" })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // GET /users/profile
    UserController.getProfile = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, profile, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userId = req.user.userId;
                        return [4 /*yield*/, user_service_1.UserService.getProfile(userId)];
                    case 1:
                        profile = _a.sent();
                        res.json({ data: profile });
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        res.status(400).json({ message: err_2.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // PUT /users/profile
    UserController.updateProfile = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, profile, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userId = req.user.userId;
                        return [4 /*yield*/, user_service_1.UserService.updateProfile(userId, req.body)];
                    case 1:
                        profile = _a.sent();
                        res.json({ message: "Profile updated", data: profile });
                        return [3 /*break*/, 3];
                    case 2:
                        err_3 = _a.sent();
                        res.status(400).json({ message: err_3.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // PUT /users/change-password
    UserController.changePassword = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, _a, oldPassword, newPassword, err_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        userId = req.user.userId;
                        _a = req.body, oldPassword = _a.oldPassword, newPassword = _a.newPassword;
                        if (!oldPassword || !newPassword) {
                            return [2 /*return*/, res.status(400).json({ message: "Missing old or new password" })];
                        }
                        return [4 /*yield*/, user_service_1.UserService.changePassword(userId, oldPassword, newPassword)];
                    case 1:
                        _b.sent();
                        res.json({ message: "Password updated successfully" });
                        return [3 /*break*/, 3];
                    case 2:
                        err_4 = _b.sent();
                        res.status(400).json({ message: err_4.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ===============================
    // Ratings - Summary
    // ===============================
    UserController.getMyRatingSummary = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, summary, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userId = req.user.userId;
                        return [4 /*yield*/, user_service_1.UserService.getRatingSummary(userId)];
                    case 1:
                        summary = _a.sent();
                        return [2 /*return*/, res.json({
                                success: true,
                                data: summary
                            })];
                    case 2:
                        err_5 = _a.sent();
                        console.error("Get rating summary error:", err_5);
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: "Failed to get rating summary"
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ===============================
    // Ratings - Detail list
    // ===============================
    UserController.getMyRatingDetails = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, details, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userId = req.user.userId;
                        return [4 /*yield*/, user_service_1.UserService.getRatingDetails(userId)];
                    case 1:
                        details = _a.sent();
                        return [2 /*return*/, res.json({
                                success: true,
                                data: details
                            })];
                    case 2:
                        err_6 = _a.sent();
                        console.error("Get rating details error:", err_6);
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: "Failed to get rating details"
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ===============================
    // POST /users/request-upgrade-seller
    // ===============================
    UserController.requestUpgradeSeller = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var userId, result, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).json({
                                    success: false,
                                    message: "Unauthorized"
                                })];
                        }
                        return [4 /*yield*/, user_service_1.UserService.requestUpgradeToSeller(userId)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                message: result.message
                            })];
                    case 2:
                        error_5 = _b.sent();
                        return [2 /*return*/, res.status(400).json({
                                success: false,
                                message: error_5.message || "Request failed"
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ===============================
    // GET /users/upgrade-seller-status
    // ===============================
    UserController.getUpgradeSellerStatus = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var userId, data, error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).json({
                                    success: false,
                                    message: "Unauthorized"
                                })];
                        }
                        return [4 /*yield*/, user_service_1.UserService.getUpgradeSellerRequestStatus(userId)];
                    case 1:
                        data = _b.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: data
                            })];
                    case 2:
                        error_6 = _b.sent();
                        return [2 /*return*/, res.status(400).json({
                                success: false,
                                message: error_6.message || "Failed to fetch status"
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ===============================
    // GET /users/my-bidding-products
    // ===============================
    UserController.getMyBiddingProducts = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var userId, products, error_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).json({
                                    success: false,
                                    message: "Unauthorized"
                                })];
                        }
                        return [4 /*yield*/, user_service_1.UserService.getMyActiveBids(userId)];
                    case 1:
                        products = _b.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: products
                            })];
                    case 2:
                        error_7 = _b.sent();
                        console.error("❌ getMyBiddingProducts error:", error_7);
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: error_7.message || "Failed to load bidding products"
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ===============================
    // POST /users/questions
    // Ask seller about product
    // ===============================
    UserController.askQuestion = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var userId, _b, productId, content, question, error_8;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        _b = req.body, productId = _b.productId, content = _b.content;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).json({
                                    success: false,
                                    message: "Unauthorized"
                                })];
                        }
                        if (!productId || !content) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: "productId and content are required"
                                })];
                        }
                        return [4 /*yield*/, user_service_1.UserService.askQuestion(userId, productId, content)];
                    case 1:
                        question = _c.sent();
                        return [2 /*return*/, res.status(201).json({
                                success: true,
                                data: question
                            })];
                    case 2:
                        error_8 = _c.sent();
                        return [2 /*return*/, res.status(400).json({
                                success: false,
                                message: error_8.message || "Failed to ask question"
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ===============================
    // POST /users/questions/:questionId/reply
    // Bidder reply in Q&A thread
    // ===============================
    UserController.replyQuestion = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var bidderId, questionId, content, result, error_9;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        bidderId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        questionId = req.params.questionId;
                        content = req.body.content;
                        if (!bidderId) {
                            return [2 /*return*/, res.status(401).json({
                                    success: false,
                                    message: "Unauthorized"
                                })];
                        }
                        if (!questionId) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: "questionId is required"
                                })];
                        }
                        if (!content || !content.trim()) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: "Content is required"
                                })];
                        }
                        return [4 /*yield*/, user_service_1.UserService.replyQuestionAsBidder({
                                bidderId: bidderId,
                                questionId: questionId,
                                content: content
                            })];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, res.status(201).json({
                                success: true,
                                data: result
                            })];
                    case 2:
                        error_9 = _b.sent();
                        return [2 /*return*/, res.status(400).json({
                                success: false,
                                message: error_9.message || "Failed to reply question"
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ===============================
    // POST /users/bid
    // Place AUTO BID (max price)
    // ===============================
    UserController.placeAutoBid = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var userId, _b, productId, maxPrice, result, error_10;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        _b = req.body, productId = _b.productId, maxPrice = _b.maxPrice;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).json({
                                    success: false,
                                    message: "Unauthorized"
                                })];
                        }
                        if (!productId || typeof maxPrice !== "number") {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: "productId and maxPrice are required"
                                })];
                        }
                        return [4 /*yield*/, user_service_1.UserService.placeAutoBid({
                                userId: userId,
                                productId: productId,
                                maxPrice: maxPrice
                            })];
                    case 1:
                        result = _c.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: result
                            })];
                    case 2:
                        error_10 = _c.sent();
                        return [2 /*return*/, res.status(400).json({
                                success: false,
                                message: error_10.message || "Failed to place bid"
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return UserController;
}());
exports.UserController = UserController;
