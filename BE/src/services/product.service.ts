import { db } from "../config/db";

export const getAllProducts = () => {
  return db("products")
    .select("id", "title", "category_id", "seller_id", "created_at")
    .orderBy("created_at", "desc");
};
