"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const home_controller_1 = require("../controllers/home.controller");
const router = (0, express_1.Router)();
router.get("/top-5-ending-soon", home_controller_1.getTop5EndingSoonController);
router.get("/top-5-most-bids", home_controller_1.getTop5MostBidsController);
router.get("/top-5-highest-price", home_controller_1.getTop5HighestPriceController);
exports.default = router;
//# sourceMappingURL=home.route.js.map