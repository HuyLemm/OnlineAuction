"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const csv_parse_1 = require("csv-parse");
const csv_writer_1 = require("csv-writer");
// Load CSV helper
async function loadCSV(path) {
    const text = fs_1.default.readFileSync(path);
    return new Promise((resolve, reject) => {
        (0, csv_parse_1.parse)(text, { columns: true }, (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
}
async function main() {
    const products = await loadCSV("products.csv");
    const bids = await loadCSV("bids.csv");
    // Highest bid per product
    const bestMap = new Map();
    for (const bid of bids) {
        const pid = bid.product_id;
        const amount = Number(bid.bid_amount);
        if (!bestMap.has(pid) || amount > Number(bestMap.get(pid).bid_amount)) {
            bestMap.set(pid, bid);
        }
    }
    // Update product fields
    for (const p of products) {
        const best = bestMap.get(p.id);
        if (best) {
            p.current_price = best.bid_amount;
            p.highest_bidder_id = best.bidder_id;
        }
    }
    const csvWriter = (0, csv_writer_1.createObjectCsvWriter)({
        path: 'products_updated.csv',
        header: Object.keys(products[0]).map(k => ({ id: k, title: k }))
    });
    await csvWriter.writeRecords(products);
    console.log("🎉 DONE! Created products_updated.csv with updated prices & winners.");
}
main();
//# sourceMappingURL=updateProducts.js.map