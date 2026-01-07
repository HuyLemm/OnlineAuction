"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMainCategoriesService = getMainCategoriesService;
exports.getCategoryTreeService = getCategoryTreeService;
const db_1 = require("../config/db");
async function getMainCategoriesService() {
    return (0, db_1.db)("categories as c")
        .leftJoin("categories as sub", "sub.parent_id", "c.id")
        .leftJoin("products as p", function () {
        this.on("p.category_id", "=", "c.id").orOn("p.category_id", "=", "sub.id");
    })
        .whereNull("c.parent_id")
        .groupBy("c.id")
        .select("c.id", "c.name", db_1.db.raw("COUNT(p.id)::int as count"))
        .orderBy("c.name", "asc");
}
async function getCategoryTreeService() {
    const categories = await (0, db_1.db)("categories").select("id", "name", "parent_id");
    const mainCategories = categories.filter((c) => c.parent_id === null);
    return mainCategories.map((main) => ({
        main: main.name,
        subcategories: categories
            .filter((sub) => sub.parent_id === main.id)
            .map((sub) => sub.name),
    }));
}
//# sourceMappingURL=category.service.js.map