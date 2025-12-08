import { db } from "../config/db";

export async function getMainCategoriesService() {
  return db("categories as c")
    .leftJoin("categories as sub", "sub.parent_id", "c.id")
    .leftJoin("products as p", function () {
      this.on("p.category_id", "=", "c.id").orOn(
        "p.category_id",
        "=",
        "sub.id"
      );
    })
    .whereNull("c.parent_id")
    .groupBy("c.id")
    .select("c.id", "c.name", db.raw("COUNT(p.id)::int as count"))
    .orderBy("c.name", "asc");
}

export async function getCategoryForMenuService() {
  const categories = await db("categories").select("id", "name", "parent_id");

  const mainCategories = categories.filter((c) => c.parent_id === null);

  return mainCategories.map((main) => ({
    main: main.name,
    subcategories: categories
      .filter((sub) => sub.parent_id === main.id)
      .map((sub) => sub.name),
  }));
}

export async function getCategoryForSidebarService() {
  const categories = await db("categories").select("id", "name", "parent_id");

  const productCounts = await db("products")
    .select("category_id")
    .count("* as count")
    .groupBy("category_id");

  const countMap: Record<string, number> = {};
  productCounts.forEach((row) => {
    const key = String(row.category_id ?? "");
    if (!key) return; 
    countMap[key] = Number(row.count);
  });

  const mainCategories = categories.filter((c) => c.parent_id === null);

  return mainCategories.map((main) => {
    const subs = categories.filter((c) => c.parent_id === main.id);

    const subcategories = subs.map((sub) => ({
      id: sub.id,
      label: sub.name,
      count: countMap[String(sub.id)] ?? 0,
    }));

    const totalMainCount =
      (countMap[String(main.id)] ?? 0) +
      subcategories.reduce((sum, s) => sum + s.count, 0);

    return {
      id: main.id,
      label: main.name,
      count: totalMainCount,
      subcategories,
    };
  });
}
