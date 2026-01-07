import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

/**
 * Allow only specific roles
 * Example: authorize("admin"), authorize("seller", "admin")
 */
export function authorize(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthenticated",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: insufficient permissions",
      });
    }

    next();
  };
}
