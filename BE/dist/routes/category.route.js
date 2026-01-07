"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("../controllers/category.controller");
const router = (0, express_1.Router)();
router.get("/get-main-categories", category_controller_1.getMainCategoriesController);
router.get("/get-categories-tree", category_controller_1.getCategoryTreeController);
exports.default = router;
//# sourceMappingURL=category.route.js.map