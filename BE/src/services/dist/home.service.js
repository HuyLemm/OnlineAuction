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
exports.HomeService = void 0;
// src/services/home.service.ts
var dayjs_1 = require("dayjs");
var db_1 = require("../config/db");
var HomeService = /** @class */ (function () {
    function HomeService() {
    }
    // ===============================
    // Helpers
    // ===============================
    HomeService.baseQuery = function () {
        return db_1.db("products as p")
            .leftJoin("product_images as pi", function () {
            this.on("pi.product_id", "=", "p.id").andOn("pi.is_main", "=", db_1.db.raw("true"));
        })
            .leftJoin("bids as b", "b.product_id", "p.id")
            .leftJoin("categories as c", "c.id", "p.category_id")
            .leftJoin("users as u", "u.id", "p.highest_bidder_id")
            .select("p.id", "p.title", "p.auction_type as auctionType", "p.highest_bidder_id as highestBidderId", "u.full_name as highestBidderName", "p.buy_now_price as buyNowPrice", "p.created_at as postedDate", "p.end_time as end_time", "c.name as category", "c.id as categoryId", db_1.db.raw("COALESCE(MAX(b.bid_amount), p.start_price) AS \"currentBid\""), db_1.db.raw("COUNT(b.id) AS \"bids\""), db_1.db.raw("COALESCE(pi.image_url, '') AS \"image\""))
            .groupBy("p.id", "pi.image_url", "c.name", "c.id", "u.full_name");
    };
    /**
     * Map raw DB row → HomeProductDTO
     */
    HomeService.mapToHomeDTO = function (item) {
        var _a, _b;
        var end = dayjs_1["default"](item.end_time);
        var now = dayjs_1["default"]();
        var hoursLeft = end.diff(now, "hour");
        return {
            id: item.id,
            title: item.title,
            category: item.category,
            categoryId: item.categoryId,
            image: item.image,
            postedDate: item.postedDate,
            end_time: item.end_time,
            auctionType: item.auctionType,
            buyNowPrice: item.buyNowPrice,
            currentBid: Number(item.currentBid),
            bids: Number(item.bids),
            highestBidderId: (_a = item.highestBidderId) !== null && _a !== void 0 ? _a : null,
            highestBidderName: (_b = item.highestBidderName) !== null && _b !== void 0 ? _b : null,
            isHot: Number(item.bids) > 7,
            endingSoon: hoursLeft > 0 && hoursLeft < 72
        };
    };
    // ===============================
    // GET Top 5 Ending Soon
    // ===============================
    HomeService.getTop5EndingSoon = function () {
        return __awaiter(this, void 0, Promise, function () {
            var rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, HomeService.baseQuery()
                            .where("p.status", "active")
                            .orderBy("p.end_time", "asc")
                            .limit(5)];
                    case 1:
                        rows = _a.sent();
                        return [2 /*return*/, rows.map(HomeService.mapToHomeDTO)];
                }
            });
        });
    };
    // ===============================
    // GET Top 5 Most Bids
    // ===============================
    HomeService.getTop5MostBids = function () {
        return __awaiter(this, void 0, Promise, function () {
            var rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, HomeService.baseQuery()
                            .where("p.status", "active")
                            .havingRaw("COUNT(b.id) > 0")
                            .orderBy("bids", "desc")
                            .limit(5)];
                    case 1:
                        rows = _a.sent();
                        return [2 /*return*/, rows.map(HomeService.mapToHomeDTO)];
                }
            });
        });
    };
    // ===============================
    // GET Top 5 Highest Price
    // ===============================
    HomeService.getTop5HighestPrice = function () {
        return __awaiter(this, void 0, Promise, function () {
            var rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, HomeService.baseQuery()
                            .where("p.status", "active")
                            .orderBy("currentBid", "desc")
                            .limit(5)];
                    case 1:
                        rows = _a.sent();
                        return [2 /*return*/, rows.map(HomeService.mapToHomeDTO)];
                }
            });
        });
    };
    return HomeService;
}());
exports.HomeService = HomeService;
