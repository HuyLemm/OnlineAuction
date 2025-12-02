import { Request, Response, NextFunction } from "express";
import * as productService from "../services/product.service";

export const listProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await productService.getAllProducts();
    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};
