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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.ProductService = void 0;
var db_1 = require("../config/db");
var ProductService = /** @class */ (function () {
    function ProductService() {
    }
    // ==================================================
    // 🔧 Helpers
    // ==================================================
    ProductService.getDescendantCategories = function (categoryIds) {
        return __awaiter(this, void 0, Promise, function () {
            var children, childIds, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, db_1.db("categories")
                            .select("id")
                            .whereIn("parent_id", categoryIds)];
                    case 1:
                        children = _c.sent();
                        if (children.length === 0)
                            return [2 /*return*/, categoryIds];
                        childIds = children.map(function (c) { return c.id; });
                        _a = Set.bind;
                        _b = [categoryIds];
                        return [4 /*yield*/, ProductService.getDescendantCategories(childIds)];
                    case 2: return [2 /*return*/, __spreadArrays.apply(void 0, [new (_a.apply(Set, [void 0, __spreadArrays.apply(void 0, _b.concat([(_c.sent())]))]))()])];
                }
            });
        });
    };
    ProductService.baseQuery = function () {
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
    ProductService.buildTsQueryAND = function (keyword) {
        return keyword
            .trim()
            .split(/\s+/)
            .map(function (w) { return w + ":*"; })
            .join(" & ");
    };
    ProductService.buildTsQueryOR = function (keyword) {
        return keyword
            .trim()
            .split(/\s+/)
            .map(function (w) { return w + ":*"; })
            .join(" | ");
    };
    ProductService.getBrowseProducts = function (_a) {
        var page = _a.page, limit = _a.limit, sort = _a.sort, categories = _a.categories, minPrice = _a.minPrice, maxPrice = _a.maxPrice;
        return __awaiter(this, void 0, void 0, function () {
            var offset, query, catIds, filtered, total, data;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        offset = (page - 1) * limit;
                        query = ProductService.baseQuery();
                        if (categories && categories.length > 0) {
                            catIds = categories.map(Number);
                            query = query.whereIn("p.category_id", catIds);
                        }
                        query = query.havingRaw("COALESCE(p.current_price, p.start_price)::int BETWEEN ? AND ?", [minPrice, maxPrice]);
                        return [4 /*yield*/, query.clone()];
                    case 1:
                        filtered = _b.sent();
                        total = filtered.length;
                        switch (sort) {
                            case "ending-soon":
                                query.orderBy("p.end_time", "asc");
                                break;
                            case "newly-listed":
                                query.orderBy("p.created_at", "desc");
                                break;
                            case "price-low":
                                query.orderBy("currentBid", "asc");
                                break;
                            case "price-high":
                                query.orderBy("currentBid", "desc");
                                break;
                            case "most-bids":
                                query.orderBy("currentBid", "desc");
                                break;
                        }
                        return [4 /*yield*/, query.limit(limit).offset(offset)];
                    case 2:
                        data = _b.sent();
                        return [2 /*return*/, { data: data, total: total }];
                }
            });
        });
    };
    // ==================================================
    // 📦 Browse products (no keyword)
    // ==================================================
    ProductService.searchProducts = function (_a) {
        var keyword = _a.keyword, categoryIds = _a.categoryIds, page = _a.page, limit = _a.limit, sort = _a.sort, _b = _a.newMinutes, newMinutes = _b === void 0 ? 60 : _b;
        return __awaiter(this, void 0, void 0, function () {
            var offset, hasKeyword, searchVector, queryAND, queryOR, query, allCats, total, allCats, data;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        offset = (page - 1) * limit;
                        hasKeyword = keyword.trim() !== "";
                        searchVector = "p.search_vector";
                        queryAND = ProductService.buildTsQueryAND(keyword);
                        queryOR = ProductService.buildTsQueryOR(keyword);
                        query = ProductService.baseQuery();
                        if (!(categoryIds && categoryIds.length > 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, ProductService.getDescendantCategories(categoryIds)];
                    case 1:
                        allCats = _c.sent();
                        query.whereIn("p.category_id", allCats);
                        _c.label = 2;
                    case 2:
                        if (hasKeyword) {
                            query
                                .select(db_1.db.raw("ts_rank(" + searchVector + ", to_tsquery('english', ?)) AS rank", [
                                queryAND,
                            ]))
                                .whereRaw(searchVector + " @@ to_tsquery('english', ?)", [queryAND]);
                        }
                        return [4 /*yield*/, query.clone()];
                    case 3:
                        total = (_c.sent()).length;
                        if (!(hasKeyword && total === 0)) return [3 /*break*/, 7];
                        query = ProductService.baseQuery();
                        if (!(categoryIds && categoryIds.length > 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, ProductService.getDescendantCategories(categoryIds)];
                    case 4:
                        allCats = _c.sent();
                        query.whereIn("p.category_id", allCats);
                        _c.label = 5;
                    case 5:
                        query
                            .select(db_1.db.raw("ts_rank(" + searchVector + ", to_tsquery('english', ?)) AS rank", [
                            queryOR,
                        ]))
                            .whereRaw(searchVector + " @@ to_tsquery('english', ?)", [queryOR]);
                        return [4 /*yield*/, query.clone()];
                    case 6:
                        total = (_c.sent()).length;
                        _c.label = 7;
                    case 7:
                        if (hasKeyword) {
                            switch (sort) {
                                case "price_asc":
                                    query.orderBy("currentBid", "asc");
                                    break;
                                case "price_desc":
                                    query.orderBy("currentBid", "desc");
                                    break;
                                case "newest":
                                    query.orderBy("p.created_at", "desc");
                                    break;
                                case "oldest":
                                    query.orderBy("p.created_at", "asc");
                                    break;
                                case "ending_soon":
                                    query.orderBy("p.end_time", "asc");
                                    break;
                            }
                            query.orderBy("rank", "desc");
                        }
                        else {
                            switch (sort) {
                                case "price_asc":
                                    query.orderBy("currentBid", "asc");
                                    break;
                                case "price_desc":
                                    query.orderBy("currentBid", "desc");
                                    break;
                                case "newest":
                                    query.orderBy("p.created_at", "desc");
                                    break;
                                case "oldest":
                                    query.orderBy("p.created_at", "asc");
                                    break;
                                case "ending_soon":
                                    query.orderBy("p.end_time", "asc");
                                    break;
                            }
                        }
                        return [4 /*yield*/, query.limit(limit).offset(offset)];
                    case 8:
                        data = _c.sent();
                        return [2 /*return*/, {
                                success: true,
                                keyword: keyword,
                                sort: sort,
                                page: page,
                                limit: limit,
                                totalItems: total,
                                totalPages: Math.ceil(total / limit),
                                data: data
                            }];
                }
            });
        });
    };
    ProductService.getProductDetail = function (productId, viewerUserId) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function () {
            var product, viewer, viewerRaw, images, seller, sellerRatingRaw, sellerRating, highestBid, highestBidder, highestBidderRating, bidderRatingRaw, autoBids, bidHistoryRaw, bidderRatingMap, _i, bidHistoryRaw_1, bid, ratingRaw, bidHistory, questionsRaw, answersRaw, _g, answersByQuestion, _h, answersRaw_1, ans, questions, relatedProducts;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0: return [4 /*yield*/, db_1.db("products as p")
                            .leftJoin("categories as c", "c.id", "p.category_id")
                            .select("p.id", "p.title", "p.description", "p.created_at as postedDate", "p.end_time as endTime", "p.auction_type as auctionType", "p.buy_now_price as buyNowPrice", "p.category_id as categoryId", "c.name as categoryName", "p.bid_step as bidStep", db_1.db.raw("COALESCE(p.current_price, p.start_price)::int AS \"currentBid\""))
                            .where("p.id", productId)
                            .first()];
                    case 1:
                        product = _j.sent();
                        if (!product)
                            throw new Error("Product not found");
                        viewer = null;
                        if (!viewerUserId) return [3 /*break*/, 3];
                        return [4 /*yield*/, db_1.db("users")
                                .select("id", "role")
                                .where("id", viewerUserId)
                                .first()];
                    case 2:
                        viewerRaw = _j.sent();
                        if (viewerRaw) {
                            viewer = {
                                id: viewerRaw.id,
                                role: viewerRaw.role
                            };
                        }
                        _j.label = 3;
                    case 3: return [4 /*yield*/, db_1.db("product_images")
                            .select("image_url", "is_main")
                            .where("product_id", productId)];
                    case 4:
                        images = _j.sent();
                        return [4 /*yield*/, db_1.db("users")
                                .select("id", "full_name")
                                .where("id", db_1.db("products").select("seller_id").where("id", productId))
                                .first()];
                    case 5:
                        seller = _j.sent();
                        if (!seller)
                            throw new Error("Seller not found");
                        return [4 /*yield*/, db_1.db
                                .select(db_1.db.raw("COALESCE(SUM(score), 0) AS score"), db_1.db.raw("COUNT(*) AS total"))
                                .from("ratings")
                                .where("to_user", seller.id)
                                .first()];
                    case 6:
                        sellerRatingRaw = (_j.sent());
                        sellerRating = {
                            score: Number((_a = sellerRatingRaw === null || sellerRatingRaw === void 0 ? void 0 : sellerRatingRaw.score) !== null && _a !== void 0 ? _a : 0),
                            total: Number((_b = sellerRatingRaw === null || sellerRatingRaw === void 0 ? void 0 : sellerRatingRaw.total) !== null && _b !== void 0 ? _b : 0)
                        };
                        return [4 /*yield*/, db_1.db("bids")
                                .where("product_id", productId)
                                .orderBy("bid_amount", "desc")
                                .first()];
                    case 7:
                        highestBid = _j.sent();
                        highestBidder = null;
                        highestBidderRating = { score: 0, total: 0 };
                        if (!highestBid) return [3 /*break*/, 10];
                        return [4 /*yield*/, db_1.db("users")
                                .select("id", "full_name")
                                .where("id", highestBid.bidder_id)
                                .first()];
                    case 8:
                        highestBidder = _j.sent();
                        if (!highestBidder) return [3 /*break*/, 10];
                        return [4 /*yield*/, db_1.db
                                .select(db_1.db.raw("COALESCE(SUM(score), 0) AS score"), db_1.db.raw("COUNT(*) AS total"))
                                .from("ratings")
                                .where("to_user", highestBid.bidder_id)
                                .first()];
                    case 9:
                        bidderRatingRaw = (_j.sent());
                        highestBidderRating = {
                            score: Number((_c = bidderRatingRaw === null || bidderRatingRaw === void 0 ? void 0 : bidderRatingRaw.score) !== null && _c !== void 0 ? _c : 0),
                            total: Number((_d = bidderRatingRaw === null || bidderRatingRaw === void 0 ? void 0 : bidderRatingRaw.total) !== null && _d !== void 0 ? _d : 0)
                        };
                        _j.label = 10;
                    case 10: return [4 /*yield*/, db_1.db("auto_bids")
                            .where("product_id", productId)
                            .select("id", "bidder_id", "max_price", "created_at")];
                    case 11:
                        autoBids = _j.sent();
                        return [4 /*yield*/, db_1.db("bids as b")
                                .join("users as u", "u.id", "b.bidder_id")
                                .where("b.product_id", productId)
                                .orderBy("b.bid_time", "desc")
                                .select("b.id as bidId", "b.bid_amount as amount", "b.bid_time as createdAt", "u.id as bidderId", "u.full_name as bidderName")];
                    case 12:
                        bidHistoryRaw = _j.sent();
                        bidderRatingMap = new Map();
                        _i = 0, bidHistoryRaw_1 = bidHistoryRaw;
                        _j.label = 13;
                    case 13:
                        if (!(_i < bidHistoryRaw_1.length)) return [3 /*break*/, 16];
                        bid = bidHistoryRaw_1[_i];
                        if (bidderRatingMap.has(bid.bidderId))
                            return [3 /*break*/, 15];
                        return [4 /*yield*/, db_1.db
                                .select(db_1.db.raw("COALESCE(SUM(score), 0) AS score"), db_1.db.raw("COUNT(*) AS total"))
                                .from("ratings")
                                .where("to_user", bid.bidderId)
                                .first()];
                    case 14:
                        ratingRaw = (_j.sent());
                        bidderRatingMap.set(bid.bidderId, {
                            score: Number((_e = ratingRaw === null || ratingRaw === void 0 ? void 0 : ratingRaw.score) !== null && _e !== void 0 ? _e : 0),
                            total: Number((_f = ratingRaw === null || ratingRaw === void 0 ? void 0 : ratingRaw.total) !== null && _f !== void 0 ? _f : 0)
                        });
                        _j.label = 15;
                    case 15:
                        _i++;
                        return [3 /*break*/, 13];
                    case 16:
                        bidHistory = bidHistoryRaw.map(function (b) {
                            var _a;
                            return ({
                                id: b.bidId,
                                amount: Number(b.amount),
                                createdAt: b.createdAt,
                                bidder: {
                                    id: b.bidderId,
                                    name: b.bidderName,
                                    rating: (_a = bidderRatingMap.get(b.bidderId)) !== null && _a !== void 0 ? _a : {
                                        score: 0,
                                        total: 0
                                    }
                                }
                            });
                        });
                        return [4 /*yield*/, db_1.db("questions as q")
                                .join("users as u", "u.id", "q.user_id")
                                .where("q.product_id", productId)
                                .select("q.id as questionId", "q.content as questionContent", "q.created_at as questionCreatedAt", "u.id as askerId", "u.full_name as askerName")
                                .orderBy("q.created_at", "asc")];
                    case 17:
                        questionsRaw = _j.sent();
                        if (!questionsRaw.length) return [3 /*break*/, 19];
                        return [4 /*yield*/, db_1.db("answers as a")
                                .join("users as u", "u.id", "a.user_id")
                                .whereIn("a.question_id", questionsRaw.map(function (q) { return q.questionId; }))
                                .select("a.id as answerId", "a.question_id as questionId", "a.content", "a.created_at", "a.role", "u.id as userId", "u.full_name as userName")
                                .orderBy("a.created_at", "asc")];
                    case 18:
                        _g = _j.sent();
                        return [3 /*break*/, 20];
                    case 19:
                        _g = [];
                        _j.label = 20;
                    case 20:
                        answersRaw = _g;
                        answersByQuestion = new Map();
                        for (_h = 0, answersRaw_1 = answersRaw; _h < answersRaw_1.length; _h++) {
                            ans = answersRaw_1[_h];
                            if (!answersByQuestion.has(ans.questionId)) {
                                answersByQuestion.set(ans.questionId, []);
                            }
                            answersByQuestion.get(ans.questionId).push({
                                id: ans.answerId,
                                content: ans.content,
                                createdAt: ans.created_at,
                                sender: {
                                    id: ans.userId,
                                    name: ans.userName,
                                    role: ans.role
                                }
                            });
                        }
                        questions = questionsRaw.map(function (q) {
                            var _a;
                            return ({
                                id: q.questionId,
                                question: {
                                    content: q.questionContent,
                                    askedBy: {
                                        id: q.askerId,
                                        name: q.askerName
                                    },
                                    askedAt: q.questionCreatedAt
                                },
                                messages: (_a = answersByQuestion.get(q.questionId)) !== null && _a !== void 0 ? _a : []
                            });
                        });
                        return [4 /*yield*/, db_1.db("products as p")
                                .leftJoin("categories as c", "c.id", "p.category_id")
                                .leftJoin("users as u", "u.id", "p.highest_bidder_id")
                                .leftJoin("bids as b", "b.product_id", "p.id")
                                .leftJoin("product_images as pi", function () {
                                this.on("pi.product_id", "=", "p.id").andOn("pi.is_main", "=", db_1.db.raw("true"));
                            })
                                .select("p.id", "p.title", "p.end_time as endTime", "p.auction_type as auctionType", "p.buy_now_price as buyNowPrice", "p.created_at as postedDate", "c.name as category", "c.id as categoryId", "u.full_name as highestBidderName", db_1.db.raw("COALESCE(p.current_price, p.start_price)::int AS \"currentBid\""), db_1.db.raw("COALESCE(pi.image_url, '') AS \"image\""), db_1.db.raw("COUNT(b.id)::int AS \"bids\""))
                                .where("p.status", "active")
                                .andWhere("p.category_id", product.categoryId)
                                .andWhereNot("p.id", productId)
                                .groupBy("p.id", "c.id", "c.name", "pi.image_url", "u.full_name")
                                .limit(5)];
                    case 21:
                        relatedProducts = _j.sent();
                        // ----------------------------
                        // FINAL RAW RESULT
                        // ----------------------------
                        return [2 /*return*/, {
                                viewer: viewer,
                                product: product,
                                images: images,
                                seller: {
                                    id: seller.id,
                                    name: seller.full_name,
                                    rating: sellerRating
                                },
                                highestBid: highestBid,
                                highestBidder: highestBidder
                                    ? {
                                        id: highestBidder.id,
                                        name: highestBidder.full_name,
                                        rating: highestBidderRating
                                    }
                                    : null,
                                autoBids: autoBids,
                                bidHistory: bidHistory,
                                questions: questions,
                                relatedProducts: relatedProducts
                            }];
                }
            });
        });
    };
    return ProductService;
}());
exports.ProductService = ProductService;
