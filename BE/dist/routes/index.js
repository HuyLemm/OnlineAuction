"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_route_1 = __importDefault(require("./product.route"));
const home_route_1 = __importDefault(require("./home.route"));
const category_route_1 = __importDefault(require("./category.route"));
const router = (0, express_1.Router)();
router.use("/products", product_route_1.default);
router.use("/home", home_route_1.default);
router.use("/categories", category_route_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map