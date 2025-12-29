import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";

export interface AuthRequest extends Request {
  user?: {
    userId: string; // UUID → string
    role: string;
  };
}

export function authenticate(
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

    req.user = {
      userId: payload.userId,
      role: payload.role,
    };

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Access token expired or invalid",
    });
  }
}

// authenticateOptional.ts (hoặc cùng file)

export function authenticateOptional(
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
    req.user = {
      userId: payload.userId,
      role: payload.role,
    };
  } catch {
    delete req.user;
  }

  next();
}
