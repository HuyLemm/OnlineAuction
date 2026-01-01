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
exports.ProductController = void 0;
var dayjs_1 = require("dayjs");
var product_service_1 = require("../services/product.service");
// =====================================================
// UTIL – map browse product
// =====================================================
function mapBrowseProduct(item) {
    var _a, _b, _c, _d;
    var end = dayjs_1["default"](item.end_time);
    var now = dayjs_1["default"]();
    return {
        id: item.id,
        title: item.title,
        category: item.category,
        image: item.image,
        categoryId: String((_b = (_a = item.categoryId) !== null && _a !== void 0 ? _a : item.category_id) !== null && _b !== void 0 ? _b : ""),
        description: item.description,
        postedDate: item.postedDate,
        end_time: item.end_time,
        auctionType: item.auctionType,
        buyNowPrice: item.buyNowPrice,
        currentBid: Number(item.currentBid),
        bids: Number(item.bids),
        highestBidderId: (_c = item.highestBidderId) !== null && _c !== void 0 ? _c : null,
        highestBidderName: (_d = item.highestBidderName) !== null && _d !== void 0 ? _d : null,
        isHot: Number(item.bids) > 7,
        endingSoon: end.diff(now, "day") < 3
    };
}
var ProductController = /** @class */ (function () {
    function ProductController() {
    }
    // ===============================
    // GET /products/get-browse-product
    // ===============================
    ProductController.getBrowseProducts = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var page, limit, sort, categories, minPrice, maxPrice, _a, data, total, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        page = Number(req.query.page) || 1;
                        limit = Number(req.query.limit) || 20;
                        sort = req.query.sort || "default";
                        categories = req.query.categories
                            ? req.query.categories.split(",").filter(function (x) { return x !== ""; })
                            : [];
                        minPrice = Number(req.query.minPrice) || 0;
                        maxPrice = Number(req.query.maxPrice) || 999999999;
                        return [4 /*yield*/, product_service_1.ProductService.getBrowseProducts({
                                page: page,
                                limit: limit,
                                sort: sort,
                                categories: categories,
                                minPrice: minPrice,
                                maxPrice: maxPrice
                            })];
                    case 1:
                        _a = _b.sent(), data = _a.data, total = _a.total;
                        return [2 /*return*/, res.json({
                                success: true,
                                page: page,
                                limit: limit,
                                sort: sort,
                                totalItems: total,
                                totalPages: Math.ceil(total / limit),
                                data: data.map(mapBrowseProduct)
                            })];
                    case 2:
                        error_1 = _b.sent();
                        console.error("❌ ProductController.browse:", error_1);
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: "Internal Server Error"
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ===============================
    // GET /products/search-products
    // ===============================
    ProductController.searchProducts = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var keyword, page, limit, sort, newMinutes, categoryIds, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        keyword = req.query.keyword || "";
                        page = Math.max(Number(req.query.page) || 1, 1);
                        limit = Math.min(Number(req.query.limit) || 12, 48);
                        sort = req.query.sort || "default";
                        newMinutes = req.query.newMinutes
                            ? Number(req.query.newMinutes)
                            : 60;
                        categoryIds = req.query.categoryIds
                            ? req.query.categoryIds.split(",").map(Number)
                            : undefined;
                        return [4 /*yield*/, product_service_1.ProductService.searchProducts({
                                keyword: keyword,
                                categoryIds: categoryIds,
                                page: page,
                                limit: limit,
                                sort: sort,
                                newMinutes: newMinutes
                            })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, res.json(result)];
                    case 2:
                        error_2 = _a.sent();
                        console.error("❌ ProductController.search:", error_2);
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: "Internal Server Error"
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ===============================
    // GET /products/:productId/get-product-detail
    // ===============================
    ProductController.getProductDetail = function (req, res) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function () {
            var viewerUserId, productId, raw, dto, error_3;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        viewerUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        productId = req.params.productId;
                        if (!productId) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: "productId is required"
                                })];
                        }
                        return [4 /*yield*/, product_service_1.ProductService.getProductDetail(productId, viewerUserId)];
                    case 1:
                        raw = _e.sent();
                        dto = __assign(__assign({ product: {
                                id: raw.product.id,
                                title: raw.product.title,
                                description: raw.product.description,
                                postedDate: raw.product.postedDate,
                                endTime: raw.product.endTime,
                                auctionType: raw.product.auctionType,
                                buyNowPrice: raw.product.buyNowPrice,
                                categoryId: raw.product.categoryId,
                                categoryName: raw.product.categoryName,
                                currentBid: raw.product.currentBid,
                                bidStep: raw.product.bidStep,
                                highestBidderId: raw.product.highestBidderId,
                                bidRequirement: raw.product.bidRequirement
                            }, viewer: (_b = raw.viewer) !== null && _b !== void 0 ? _b : null, myAutoBid: raw.myAutoBid
                                ? {
                                    maxPrice: raw.myAutoBid.maxPrice,
                                    createdAt: raw.myAutoBid.createdAt.toISOString()
                                }
                                : null, isWinning: (_c = raw.isWinning) !== null && _c !== void 0 ? _c : false, images: {
                                primary: ((_d = raw.images.find(function (i) { return i.is_main; })) === null || _d === void 0 ? void 0 : _d.image_url) || "",
                                gallery: raw.images
                                    .filter(function (i) { return !i.is_main; })
                                    .map(function (i) { return i.image_url; })
                            }, seller: {
                                id: raw.seller.id,
                                name: raw.seller.name,
                                rating: raw.seller.rating,
                                totalSales: raw.seller.totalSales,
                                positive: raw.seller.positive
                            } }, (raw.highestBidder && {
                            highestBidder: {
                                id: raw.highestBidder.id,
                                name: raw.highestBidder.name,
                                rating: raw.highestBidder.rating
                            }
                        })), { autoBids: raw.autoBids, autoBidEvents: raw.autoBidEvents, bidHistory: raw.bidHistory, questions: raw.questions, blockedBidderIds: raw.blockedBidderIds, relatedProducts: raw.relatedProducts.map(function (p) {
                                var _a, _b;
                                return ({
                                    id: p.id,
                                    title: p.title,
                                    image: p.image,
                                    currentBid: Number(p.currentBid),
                                    bids: Number(p.bids),
                                    endTime: p.endTime,
                                    auctionType: p.auctionType,
                                    buyNowPrice: (_a = p.buyNowPrice) !== null && _a !== void 0 ? _a : null,
                                    postedDate: p.postedDate,
                                    category: p.category,
                                    categoryId: Number(p.categoryId),
                                    highestBidderName: (_b = p.highestBidderName) !== null && _b !== void 0 ? _b : null
                                });
                            }) });
                        return [2 /*return*/, res.json({
                                success: true,
                                data: dto
                            })];
                    case 2:
                        error_3 = _e.sent();
                        console.error("❌ ProductController.detail:", error_3);
                        return [2 /*return*/, res.status(404).json({
                                success: false,
                                message: error_3.message || "Product not found"
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return ProductController;
}());
exports.ProductController = ProductController;
