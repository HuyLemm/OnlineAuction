import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { db } from "../config/db";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Missing or invalid Authorization header",
    });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Missing or invalid Authorization header",
    });
  }

  try {
    const payload = verifyAccessToken(token);

    // 🔐 NEW: check user status in DB
    const user = await db("users")
      .select("id", "role", "is_deleted")
      .where({ id: payload.userId })
      .first();

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.is_deleted) {
      return res.status(403).json({
        success: false,
        message: "Account has been disabled",
      });
    }

    req.user = {
      userId: user.id,
      role: user.role,
    };

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Access token expired or invalid",
    });
  }
}

export async function authenticateOptional(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    delete req.user;
    return next();
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    delete req.user;
    return next();
  }

  try {
    const payload = verifyAccessToken(token);

    const user = await db("users")
      .select("id", "role", "is_deleted")
      .where({ id: payload.userId })
      .first();

    if (!user || user.is_deleted) {
      delete req.user;
      return next();
    }

    req.user = {
      userId: user.id,
      role: user.role,
    };
  } catch {
    delete req.user;
  }

  next();
}
