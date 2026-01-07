"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMainCategoriesController = getMainCategoriesController;
exports.getCategoryTreeController = getCategoryTreeController;
const category_service_1 = require("../services/category.service");
async function getMainCategoriesController(req, res) {
    try {
        const data = await (0, category_service_1.getMainCategoriesService)();
        res.json({ success: true, data });
    }
    catch (error) {
        console.error("❌ getMainCategories Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
async function getCategoryTreeController(req, res) {
    try {
        const data = await (0, category_service_1.getCategoryTreeService)();
        res.json({ success: true, data });
    }
    catch (err) {
        console.error("❌ Category Tree Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
//# sourceMappingURL=category.controller.js.map