"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTop5EndingSoonController = getTop5EndingSoonController;
exports.getTop5MostBidsController = getTop5MostBidsController;
exports.getTop5HighestPriceController = getTop5HighestPriceController;
const dayjs_1 = __importDefault(require("dayjs"));
const home_service_1 = require("../services/home.service");
function formatItem(item) {
    const end = (0, dayjs_1.default)(item.end_time);
    const now = (0, dayjs_1.default)();
    const diffYears = end.diff(now, "year");
    return {
        id: item.id,
        title: item.title,
        category: item.category,
        image: item.image,
        postedDate: item.postedDate,
        auctionType: item.auctionType,
        buyNowPrice: item.buyNowPrice,
        end_time: item.end_time,
        currentBid: Number(item.currentBid),
        bids: Number(item.bids),
        highestBidderId: item.highestBidderId ?? null,
        highestBidderName: item.highestBidderName ?? null,
        isHot: Number(item.bids) > 10,
        endingSoon: diffYears < 3,
    };
}
async function getTop5EndingSoonController(req, res) {
    try {
        const result = await (0, home_service_1.getTop5EndingSoonService)();
        res.json({ success: true, data: result.map(formatItem) });
    }
    catch (err) {
        console.error("❌ Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
async function getTop5MostBidsController(req, res) {
    try {
        const result = await (0, home_service_1.getTop5MostBidsService)();
        res.json({ success: true, data: result.map(formatItem) });
    }
    catch (err) {
        console.error("❌ Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
async function getTop5HighestPriceController(req, res) {
    try {
        const result = await (0, home_service_1.getTop5HighestPriceService)();
        res.json({ success: true, data: result.map(formatItem) });
    }
    catch (err) {
        console.error("❌ Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
//# sourceMappingURL=home.controller.js.map