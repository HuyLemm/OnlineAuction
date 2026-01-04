"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.SellerController = void 0;
var seller_service_1 = require("../services/seller.service");
var SellerController = /** @class */ (function () {
    function SellerController() {
    }
    // ===============================
    // Create Auction
    // ===============================
    SellerController.createAuction = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var sellerId, dto, result, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        sellerId = req.user.userId;
                        dto = __assign(__assign({}, req.body), { sellerId: sellerId });
                        return [4 /*yield*/, seller_service_1.SellerService.createAuction(dto)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, res.status(201).json({
                                success: true,
                                data: result
                            })];
                    case 2:
                        err_1 = _b.sent();
                        return [2 /*return*/, res.status(400).json({
                                success: false,
                                message: (_a = err_1 === null || err_1 === void 0 ? void 0 : err_1.message) !== null && _a !== void 0 ? _a : "Create auction failed"
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ===============================
    // GET auto-extend config
    // ===============================
    SellerController.getAutoExtendConfig = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var data, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, seller_service_1.SellerService.getAutoExtendConfig()];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, res.json({
                                success: true,
                                data: data
                            })];
                    case 2:
                        err_2 = _a.sent();
                        // 🔒 Không cho FE thấy lỗi nội bộ
                        return [2 /*return*/, res.json({
                                success: true,
                                data: {
                                    thresholdMinutes: 0,
                                    durationMinutes: 0
                                }
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ===============================
    // Upload image (TEMP)
    // ===============================
    SellerController.uploadImage = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var uploadSessionId, result, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        uploadSessionId = req.body.uploadSessionId;
                        if (!req.file) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: "No file received"
                                })];
                        }
                        return [4 /*yield*/, seller_service_1.SellerService.uploadTempProductImage({
                                file: req.file,
                                uploadSessionId: uploadSessionId
                            })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, res.json({
                                success: true,
                                data: result
                            })];
                    case 2:
                        err_3 = _a.sent();
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: err_3.message
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ===============================
    // Get my active listings
    // ===============================
    SellerController.getMyActiveListings = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var sellerId, listings, err_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        sellerId = req.user.userId;
                        return [4 /*yield*/, seller_service_1.SellerService.getMyActiveListings(sellerId)];
                    case 1:
                        listings = _b.sent();
                        return [2 /*return*/, res.json({
                                success: true,
                                data: listings
                            })];
                    case 2:
                        err_4 = _b.sent();
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: (_a = err_4 === null || err_4 === void 0 ? void 0 : err_4.message) !== null && _a !== void 0 ? _a : "Failed to get active listings"
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SellerController.appendDescription = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var sellerId, productId, content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sellerId = req.user.userId;
                        productId = req.params.productId;
                        content = req.body.content;
                        if (!productId) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: "Product id is required"
                                })];
                        }
                        if (!content || !content.trim()) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: "Content is required"
                                })];
                        }
                        return [4 /*yield*/, seller_service_1.SellerService.appendProductDescription({
                                sellerId: sellerId,
                                productId: productId,
                                content: content
                            })];
                    case 1:
                        _a.sent();
                        res.json({ success: true });
                        return [2 /*return*/];
                }
            });
        });
    };
    // ===============================
    // Get my ended auctions (with winner + rating)
    // ===============================
    SellerController.getMyEndedAuctions = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var sellerId, auctions, err_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        sellerId = req.user.userId;
                        return [4 /*yield*/, seller_service_1.SellerService.getEndedAuctions(sellerId)];
                    case 1:
                        auctions = _b.sent();
                        return [2 /*return*/, res.json({
                                success: true,
                                data: auctions
                            })];
                    case 2:
                        err_5 = _b.sent();
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: (_a = err_5 === null || err_5 === void 0 ? void 0 : err_5.message) !== null && _a !== void 0 ? _a : "Failed to get ended auctions"
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ===============================
    // Rate winner of ended auction
    // ===============================
    SellerController.rateWinner = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var sellerId, productId, _b, score, comment, result, err_6;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        sellerId = req.user.userId;
                        productId = req.params.productId;
                        _b = req.body, score = _b.score, comment = _b.comment;
                        if (!productId) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: "Product id is required"
                                })];
                        }
                        if (score !== 1 && score !== -1) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: "Score must be +1 or -1"
                                })];
                        }
                        if (!comment || !comment.trim()) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: "Comment is required"
                                })];
                        }
                        return [4 /*yield*/, seller_service_1.SellerService.rateWinner({
                                sellerId: sellerId,
                                productId: productId,
                                score: score,
                                comment: comment
                            })];
                    case 1:
                        result = _c.sent();
                        return [2 /*return*/, res.json({
                                success: true,
                                data: result
                            })];
                    case 2:
                        err_6 = _c.sent();
                        return [2 /*return*/, res.status(400).json({
                                success: false,
                                message: (_a = err_6 === null || err_6 === void 0 ? void 0 : err_6.message) !== null && _a !== void 0 ? _a : "Failed to rate winner"
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ===============================
    // Answer question (Seller)
    // POST /seller/questions/:questionId/answer
    // ===============================
    SellerController.answerQuestion = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var sellerId, questionId, content, result, err_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        sellerId = req.user.userId;
                        questionId = req.params.questionId;
                        content = req.body.content;
                        if (!questionId) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: "Question id is required"
                                })];
                        }
                        if (!content || !content.trim()) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: "Answer content is required"
                                })];
                        }
                        return [4 /*yield*/, seller_service_1.SellerService.answerQuestion({
                                sellerId: sellerId,
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
                        err_7 = _b.sent();
                        return [2 /*return*/, res.status(400).json({
                                success: false,
                                message: (_a = err_7 === null || err_7 === void 0 ? void 0 : err_7.message) !== null && _a !== void 0 ? _a : "Failed to answer question"
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SellerController.getBidRequests = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var sellerId, productId, data, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        sellerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        productId = req.params.productId;
                        if (!sellerId) {
                            return [2 /*return*/, res.status(401).json({
                                    success: false,
                                    message: "Unauthorized"
                                })];
                        }
                        if (!productId) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: "productId is required"
                                })];
                        }
                        return [4 /*yield*/, seller_service_1.SellerService.getBidRequests({
                                sellerId: sellerId,
                                productId: productId
                            })];
                    case 1:
                        data = _b.sent();
                        return [2 /*return*/, res.json({
                                success: true,
                                data: data
                            })];
                    case 2:
                        error_1 = _b.sent();
                        console.error("❌ SellerController.getBidRequests:", error_1);
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: error_1.message || "Failed to load bid requests"
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /* ======================================
     * 2️⃣ POST – Approve / Reject bid request
     * ====================================== */
    SellerController.handleBidRequest = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var sellerId, requestId, action, result, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        sellerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        requestId = req.params.requestId;
                        action = req.body.action;
                        if (!sellerId) {
                            return [2 /*return*/, res.status(401).json({
                                    success: false,
                                    message: "Unauthorized"
                                })];
                        }
                        if (!requestId) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: "requestId is required"
                                })];
                        }
                        if (!action || !["approve", "reject"].includes(action)) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: "Action must be 'approve' or 'reject'"
                                })];
                        }
                        return [4 /*yield*/, seller_service_1.SellerService.handleBidRequest({
                                sellerId: sellerId,
                                requestId: requestId,
                                action: action
                            })];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, res.json({
                                success: true,
                                data: result
                            })];
                    case 2:
                        error_2 = _b.sent();
                        console.error("❌ SellerController.handleBidRequest:", error_2);
                        return [2 /*return*/, res.status(400).json({
                                success: false,
                                message: error_2.message || "Failed to process bid request"
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // =====================================
    // GET /seller/products/:productId/bidders
    // =====================================
    SellerController.getActiveBidders = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var productId, sellerId, bidders, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        productId = req.params.productId;
                        sellerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        if (!sellerId) {
                            return [2 /*return*/, res.status(401).json({
                                    success: false,
                                    message: "Unauthorized"
                                })];
                        }
                        if (!productId) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: "productId is required"
                                })];
                        }
                        return [4 /*yield*/, seller_service_1.SellerService.getActiveBidders(productId, sellerId)];
                    case 1:
                        bidders = _b.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: bidders
                            })];
                    case 2:
                        error_3 = _b.sent();
                        return [2 /*return*/, res.status(400).json({
                                success: false,
                                message: error_3.message || "Failed to load bidders"
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ==================================================
    // POST /seller/products/:productId/kick-bidder/:bidderId
    // ==================================================
    SellerController.kickBidder = function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, productId, bidderId, sellerId, reason, result, error_4;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        _b = req.params, productId = _b.productId, bidderId = _b.bidderId;
                        sellerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        reason = req.body.reason;
                        if (!sellerId) {
                            return [2 /*return*/, res.status(401).json({
                                    success: false,
                                    message: "Unauthorized"
                                })];
                        }
                        if (!productId) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: "productId is required"
                                })];
                        }
                        if (!bidderId) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: "bidderId is required"
                                })];
                        }
                        return [4 /*yield*/, seller_service_1.SellerService.kickBidderFromAuction({
                                sellerId: sellerId,
                                productId: productId,
                                bidderId: bidderId,
                                reason: reason
                            })];
                    case 1:
                        result = _c.sent();
                        // 2️⃣ Nếu bidder bị kick đang là highest → recalc auction
                        return [4 /*yield*/, seller_service_1.SellerService.recalculateAfterKick({
                                productId: productId,
                                kickedBidderId: bidderId
                            })];
                    case 2:
                        // 2️⃣ Nếu bidder bị kick đang là highest → recalc auction
                        _c.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                message: "Bidder removed from auction",
                                data: {
                                    productId: productId,
                                    bidderId: bidderId,
                                    wasHighest: result.wasHighest
                                }
                            })];
                    case 3:
                        error_4 = _c.sent();
                        return [2 /*return*/, res.status(400).json({
                                success: false,
                                message: error_4.message || "Failed to remove bidder"
                            })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return SellerController;
}());
exports.SellerController = SellerController;
