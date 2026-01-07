// src/utils/response.ts
import { Response } from "express";

export function ok(res: Response, data: any) {
  return res.json({ success: true, data });
}

export function fail(
  res: Response,
  message = "Internal Server Error",
  status = 500
) {
  return res.status(status).json({
    success: false,
    message,
  });
}
