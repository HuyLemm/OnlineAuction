"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProducts = void 0;
const db_1 = require("../config/db");
const getAllProducts = () => {
    return (0, db_1.db)("products")
        .select("id", "title", "category_id", "seller_id", "created_at")
        .orderBy("created_at", "desc");
};
exports.getAllProducts = getAllProducts;
//# sourceMappingURL=product.service.js.map